import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import Web3 from 'web3';
import RenJS from '@renproject/ren';
import {AbiItem, TxStatus} from '@renproject/interfaces';
import {Ethereum} from '@renproject/chains-ethereum';
import BigNumber from 'bignumber.js';
import {Clipboard} from '@angular/cdk/clipboard';

import {balanceAbi} from '../../core/abi/abi';
import {BurnTransactionInfo, MintTransaction, RenCurrency} from '../../core/interfaces/ren';
import {Web3Service} from '../../services/web3.service';
import {AccountService} from '../../services/account.service';
import {RenService} from '../../services/ren.service';
import {RenStatuses} from '../../core/enums/enums';

@Component({
    selector: 'app-ren',
    templateUrl: './ren.component.html',
    styleUrls: ['./ren.component.scss']
})
export class RenComponent implements OnInit {

    account$: Observable<string | null>;
    private web3: any;
    private ren: RenJS = new RenJS('testnet', {logLevel: 'log'});
    currencies: RenCurrency[];
    currenciesForm = this.fb.group({
        currency: ['', Validators.required],
        amount: ['0']
    });
    mintForm = this.fb.group({
        address: ['', Validators.required]
    });
    burnForm = this.fb.group({
        address: ['', Validators.required],
        amount: ['', Validators.required]
    });
    showBurnSubmitContainer: boolean = false;
    burnTransactionInfo: BurnTransactionInfo;
    errorText: string | null;
    watchingDeposits: boolean = false;
    mintTransaction: MintTransaction;
    mintDeposits: MintTransaction[] = [];
    renStatuses = RenStatuses;
    errorMint: string | null;
    mintAddressCopied: boolean = false;

    constructor(
        private web3Service: Web3Service,
        private accountService: AccountService,
        private cd: ChangeDetectorRef,
        private renService: RenService,
        private fb: FormBuilder,
        private clipboard: Clipboard
    ) {
        if (window.web3?.currentProvider) {
            const web3Provider = window.web3.currentProvider;
            window.web3 = new Web3(web3Provider);
            this.web3 = window.web3;
        }
    }

    ngOnInit(): void {
        this.account$ = this.accountService.getAccount()
            .pipe(
                map((address: any) => {
                    if (address) {
                        const formatted = `${address.substr(0, 4)}...${address.substr(address.length - 4)}`;
                        return formatted;
                    }
                    return address;
                }),
                tap(() => this.cd.detectChanges())
            );
        this.currencies = this.renService.getRenCurrencies();
        this.currenciesForm.valueChanges.subscribe(() => {
            this.getRenBalance();
        });
        this.burnTransactionInfo = {
            ...this.burnTransactionInfo,
            totalConfirmations: 15,
            status: 'Submitting to RenVM...',
        };
    }

    private getRenBalance(): void {
        this.mintForm.reset();
        this.burnForm.reset();
        this.mintDeposits = [];
        this.watchingDeposits = false;
        this.updateBalance();
    }

    private async updateBalance(): Promise<void> {
        const web3Address = (await this.web3.eth.getAccounts())[0];
        const symbol = this.currenciesForm.get('currency')?.value.symbol;
        const tokenAddress = await (Ethereum(this.web3.currentProvider).Account({
            address: web3Address,
        }))
            .initialize(
                'testnet'
            )
            .getTokenContractAddress(symbol);
        const tokenContract = new this.web3.eth.Contract(
            balanceAbi as AbiItem[],
            tokenAddress
        );

        const decimals = await tokenContract.methods.decimals().call();
        const balance = await tokenContract.methods.balanceOf(web3Address).call();
        const amount = new BigNumber(balance)
            .div(
                new BigNumber(10).exponentiatedBy(
                    new BigNumber(decimals).toNumber()
                )
            )
            .toFixed(4, BigNumber.ROUND_DOWN);
        this.currenciesForm.get('amount')?.patchValue(amount, {emitEvent: false});
    }

    connectWallet(): void {
        this.web3Service.connectWallet().then((accounts: string[]) => {
            const address = accounts[0];
            if (address) {
                this.accountService.setAccount(address);
            }
        });
    }

    setMax(): void {
        const balance = this.currenciesForm.get('amount')?.value;
        this.burnForm.get('amount')?.patchValue(balance);
    }

    async makeMint(): Promise<void> {
        const sendingAddress = this.mintForm.get('address')?.value;
        const symbol = this.currenciesForm.get('currency')?.value.symbol;
        const action = this.currenciesForm.get('currency')?.value.action;

        const decimals = await action.assetDecimals(symbol);

        const fees = await this.ren.getFees({
            asset: symbol,
            from: action,
            to: Ethereum(this.web3.currentProvider, 'testnet').Account({
                address: sendingAddress,
            }),
        });

        this.mintTransaction = {
            ...this.mintTransaction, amount: new BigNumber(fees.mint).dividedBy(
                new BigNumber(10).exponentiatedBy(decimals)
            ).toFixed()
        };

        const lockAndMint: any = await this.ren.lockAndMint({
            asset: symbol,
            from: action,
            to: Ethereum(this.web3.currentProvider).Account({
                address: sendingAddress,
            }),
        }).catch(err => {
            this.errorMint = err;
            this.cd.detectChanges();
        });

        if (!lockAndMint) {
            return;
        }

        this.watchingDeposits = true;
        this.mintTransaction.address = lockAndMint.gatewayAddress;
        this.errorMint = null;

        lockAndMint.on('deposit', async (deposit: any) => {
            const hash = await deposit.txHash();
            const amount: any = deposit.depositDetails.amount;
            this.mintDeposits.unshift(
                {
                    amount: new BigNumber(amount)
                        .div(new BigNumber(10).exponentiatedBy(decimals))
                        .toFixed(),
                    status: RenStatuses.SUBMITTING,
                    renVMHash: hash,
                    transactionLink: deposit.params.from.utils?.transactionExplorerLink ?
                        deposit.params.from.utils.transactionExplorerLink(deposit.depositDetails.transaction) : '',
                    transactionHash: deposit.depositDetails.transaction.txHash,
                    confirmationsCurrent: 0,
                    action: deposit
                }
            );

            this.cd.detectChanges();

            await deposit
                .confirmed()
                .on('target', (confs: number) => {
                        this.checkStatus(deposit, confs);
                    }
                )
                .on('confirmation', (confs: number) => {
                        this.checkStatus(deposit, confs);
                    }
                );

            await deposit.signed().catch((err: any) => {
                const currentDeposit = this.findDeposit(deposit);
                if (currentDeposit) {
                    currentDeposit.error = err;
                    currentDeposit.status = RenStatuses.ERROR;
                    this.cd.detectChanges();
                }
            });
        });
    }

    private checkStatus(deposit: any, confirmationCurrent: number): void {
        const currentDeposit = this.findDeposit(deposit);

        if (deposit.status === RenStatuses.CONFIRMED.toLowerCase()) {
            return;
        }

        currentDeposit.confirmationsCurrent = confirmationCurrent;
        currentDeposit.confirmationsTotal = deposit._state.targetConfirmations;

        if (currentDeposit.confirmationsCurrent >= currentDeposit.confirmationsTotal ||
            deposit.status === RenStatuses.SIGNED.toLowerCase()) {
            currentDeposit.status = RenStatuses.SIGNED;
        } else if (deposit.status === RenStatuses.DETECTED.toLowerCase()) {
            currentDeposit.status = RenStatuses.DETECTED;
        }

        this.cd.detectChanges();
    }

    async submitDeposit(deposit: any): Promise<void> {
        await deposit.action
            .mint()
            .on('transactionHash', () => {
                    deposit.confirmationsCurrent = 0;
                    deposit.status = RenStatuses.DONE;
                    this.updateBalance();
                }
            ).catch((err: any) => {
                deposit.error = err.message;
                deposit.status = RenStatuses.ERROR;
                this.cd.detectChanges();
            });
    }

    findDeposit(deposit: any): any {
        return this.mintDeposits.find(item => item.transactionHash === deposit.depositDetails.transaction.txHash);
    }

    async makeBurn(): Promise<void> {
        const symbol = this.currenciesForm.get('currency')?.value.symbol;
        const action = this.currenciesForm.get('currency')?.value.action;
        const sendingAddress = this.burnForm.get('address')?.value;
        const value = new BigNumber(this.burnForm.get('amount')?.value)
            .times(new BigNumber(10).exponentiatedBy(await action.Address(sendingAddress).assetDecimals(symbol)))
            .toFixed();

        if (+this.burnForm.get('amount')?.value < 0.005) {
            this.setError('Amount must be greater than 0.005');
            return;
        }

        const burnAndRelease = await this.ren.burnAndRelease({
            asset: symbol,
            to: action.Address(sendingAddress),
            from: Ethereum(this.web3.currentProvider).Account({value}),
        });

        if (action.Address(sendingAddress).utils.addressIsValid && !action.Address(sendingAddress).utils.addressIsValid(sendingAddress)) {
            this.setError(`Invalid recipient address ${sendingAddress}`);
            return;
        }

        this.setError(null);
        let txHash: string | undefined;

        await burnAndRelease.burn().on('confirmation', (confs: number) => {
            if (txHash) {
                this.showBurnSubmitContainer = true;
                this.burnTransactionInfo.renHash = txHash;
                this.burnTransactionInfo.confirmations = confs;
                this.burnTransactionInfo.ethereumTX = burnAndRelease.params.from.utils?.transactionExplorerLink ?
                    burnAndRelease.params.from.utils.transactionExplorerLink(burnAndRelease.burnDetails?.transaction) : '';
                this.burnTransactionInfo.renStatus = RenStatuses.SUBMITTING;
                this.cd.detectChanges();
            }
        }).catch(error => {
            this.setError(String(error.message || error.error || JSON.stringify(error)));
        });

        txHash = await burnAndRelease.txHash();

        burnAndRelease
            .release()
            .on('status', (renVMStatus: TxStatus) => {
                if (txHash) {
                    console.log(txHash, renVMStatus);
                }
            }).then(() => {
            if (txHash) {
                console.log(txHash, 'Done');
                txHash = undefined;
                this.burnTransactionInfo.renHash = RenStatuses.DONE;
                this.burnTransactionInfo.status = RenStatuses.DONE;
                this.updateBalance();
            }
        });
    }

    copyMintAddress(): void {
        this.mintAddressCopied = true;
        setTimeout(() => {
            this.mintAddressCopied = false;
        }, 2000);
        this.clipboard.copy(this.mintTransaction.address || 'Adress');
    }

    private setError(error: string | null): void {
        this.errorText = error;
    }
}
