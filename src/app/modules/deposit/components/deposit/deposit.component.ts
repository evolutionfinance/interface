import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {FlowSteps, TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {ActivatedRoute} from '@angular/router';
import {ReservesService} from '../../../../services/reserves.service';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {IChartistData, ILineChartOptions} from 'chartist';
import {ReserveParamsHistoryItem} from '../../../../core/interfaces/reserve-history.interface';
import moment from 'moment';
import Big from 'big.js';
import {AccountService} from '../../../../services/account.service';
import {APPROVE_AMOUNT, DEFAULT_CHART_OPTIONS} from '../../../../core/constants/constans';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {BehaviorSubject, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {Web3Service} from '../../../../services/web3.service';
import {APPROVE_ABI, LENDING_POOL_ABI, WETH_GATEWAY_ABI} from '../../../../core/abi/abi';
import {environment} from '../../../../../environments/environment';
import {TransactionError} from '../../../../core/interfaces/metamask.interface';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {INFO_MODAL, InfoModal} from '../../../../core/config/info-modal';
import {TransactionsService} from '../../../../services/transactions.service';
import {TransactionPageClass} from '../../../../core/classes/transaction-page.class';
import {UtilsService} from '../../../../services/utils.service';


@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.scss']
})
export class DepositComponent extends TransactionPageClass implements OnInit, OnDestroy {
    amountControl = new FormControl('', [Validators.required, Validators.min(0.000000001)]);
    currentFlowStep: FlowSteps = FlowSteps.USER_INPUT;
    userReserves: UserReserve[];
    steps = FlowSteps;
    currentTransactionsStatus = TransactionFlowStep.SUBMIT;
    reserve: MarketReserve;
    balance: string = '0';
    chartsData: IChartistData = {
        labels: [],
        series: [],
    };
    options: ILineChartOptions = {
        ...DEFAULT_CHART_OPTIONS,
        chartPadding: {
            left: 20,
            right: 20
        }

    };
    emptyState: boolean = false;
    transactionConfig: TransactionConfig = {
        steps: [
            {
                name: 'Deposit',
                type: TransactionFlowStep.SUBMIT,
                currentStatus: TransactionStepStatus.DEFAULT,
            },
            {
                name: 'Finished',
                type: TransactionFlowStep.SUCCESS,
                currentStatus: TransactionStepStatus.DEFAULT,
            },
        ],
        type: 'deposit',
    };
    util = CalculationsUtil;
    healthFactor: number = 0;
    nextHealthFactor: number = 0;
    private destroyed$ = new Subject();
    account$: BehaviorSubject<string>;
    INFO: InfoModal = INFO_MODAL;

    constructor(private route: ActivatedRoute,
                private accountService: AccountService,
                private transactionsService: TransactionsService,
                private web3: Web3Service,
                private reservesService: ReservesService,
                private utilsService: UtilsService) {
        super();
    }

    ngOnInit(): void {
        this.reserve = this.route.snapshot.data.reserve as MarketReserve;
        this.utilsService.mobileHeaderTitle.next(`Deposit ${this.reserve.symbol}`);
        this.account$ = this.accountService.getAccount() as BehaviorSubject<string>;
        const id = this.route.snapshot.paramMap.get('id') as string;
        this.reservesService.getReservesRateHistory(id).subscribe(res => {
            this.buildChartData(res.data.reserveParamsHistoryItems);
        });
        this.getUserReserves();
        this.getAccountBalance();

        this.checkIfApproveNeed();
    }

    private getUserReserves(): void {
        this.reservesService.getUserReserves()
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe((reserves: UserReserve[]) => {
                this.userReserves = reserves;
                this.healthFactor = this.util.getCurrentHealthFactor(reserves);
            });
    }

    private checkIfApproveNeed(): void {
        if (!this.web3.isWeb3Connected()) {
            return;
        }
        const asset = this.reserve.underlyingAsset;
        const account = this.account$.getValue() as string;
        const approve = {
          name: 'Approve',
          currentStatus: TransactionStepStatus.DEFAULT,
          type: TransactionFlowStep.APPROVE
        };
        this.web3.getAllowanceByAsset(account, asset).then((allowance: string) => {
            if (Number(allowance) === 0 && !this.transactionConfig.steps.some(item => item.name === approve.name)) {
                this.transactionConfig.steps.unshift(approve);
                this.currentTransactionsStatus = TransactionFlowStep.APPROVE;
            }
        });
    }

    private getAccountBalance(): void {
        this.accountService.getAccountBalance()
            .pipe(
                filter(wallet => !!Object.keys(wallet).length),
                takeUntil(this.destroyed$)
            )
            .subscribe((wallet: WalletBalance) => {
                this.balance = wallet[this.reserve.symbol];
                this.emptyState = Number(this.balance) === 0;
                if (this.balance) {
                    this.amountControl.setValidators([
                            Validators.required,
                            Validators.min(0.000000001),
                            Validators.max(this.util.getAsNumber(this.balance, this.reserve.decimals))
                        ]
                    );
                }
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private buildChartData(history: ReserveParamsHistoryItem[]): void {
        const sorted = history.slice().sort((a, b) => {
            return a.timestamp - b.timestamp;
        });
        const labels = sorted.map((x, index) => {
            return moment.unix(x.timestamp).format('DD MMM');
        });
        const depositData = sorted.map(x => {
            return +Big(x.variableBorrowRate).div(1e25).toFixed(2);
        });
        this.chartsData = {
            labels: [...labels],
            series: [depositData]
        };
    }


    checkAmount(): void {
        this.amountControl.updateValueAndValidity();
        if (this.amountControl.invalid) {
            this.amountControl.markAsTouched();
            return;
        }
        this.amountControl.setValue(Number(this.amountControl.value).toFixed(this.reserve.decimals).toString());
        this.nextHealthFactor = this.util.getNewHealthFactor(
            this.userReserves,
            this.reserve,
            this.amountControl.value,
            'scaledATokenBalance');
        this.currentFlowStep = FlowSteps.TRANSACTION_DETAILS;
    }

    submitDeposit(): void {
        const asset = this.reserve.underlyingAsset;
        const account = this.account$.getValue() as string;
        const amount = this.amountControl.value;
        const formattedAmount = Big(amount * Math.pow(10, this.reserve.decimals)).round().toString();
        const currentStep = this.getStep(TransactionFlowStep.SUBMIT);
        const lastStep = this.getStep(TransactionFlowStep.SUCCESS);

        if (this.reserve.symbol === 'ETH') {
            this.createETHDeposit(formattedAmount, account, currentStep, lastStep);
        } else {
            this.createERC20Deposit(asset, formattedAmount, account, currentStep, lastStep);
        }

    }

    private createETHDeposit(formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
        const contract = this.web3.createContract(WETH_GATEWAY_ABI, environment.WETHGateway);
        const method = contract.methods.depositETH(
            environment.lendingPoolAddress,
            account,
            0
        ).send({from: account, value: formattedAmount}, (error: TransactionError, hash: string) => {
            if (error) {
                currentStep.currentStatus = TransactionStepStatus.DENIED;
            } else {
                currentStep.hash = hash;
                currentStep.currentStatus = TransactionStepStatus.PENDING;
            }
        });
        this.handleTransactionResult(
            method,
            currentStep,
            lastStep
        );
    }

    private createERC20Deposit(asset: string, formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
        const contract = this.web3.createContract(LENDING_POOL_ABI, environment.lendingPoolAddress);
        const method = contract.methods.deposit(
            asset,
            formattedAmount,
            account,
            0
        ).send({from: account}, (error: TransactionError, hash: string) => {
            if (error) {
                currentStep.currentStatus = TransactionStepStatus.DENIED;
            } else {
                currentStep.hash = hash;
                currentStep.currentStatus = TransactionStepStatus.PENDING;
            }
        });
        this.handleTransactionResult(
            method,
            currentStep,
            lastStep
        );
    }

    approveDeposit(): void {
        const asset = this.reserve.underlyingAsset;
        const account = this.account$.getValue() as string;
        const currentStep = this.getStep(TransactionFlowStep.APPROVE);
        const contract = this.web3.createContract(APPROVE_ABI, asset);
        this.handleApproveTransactionResult(
            contract.methods.approve(
                environment.lendingPoolAddress,
                APPROVE_AMOUNT
            ).send({from: account}, (error: TransactionError, hash: string) => {
                if (error) {
                    currentStep.currentStatus = TransactionStepStatus.DENIED;
                } else {
                    currentStep.hash = hash;
                    currentStep.currentStatus = TransactionStepStatus.PENDING;
                }
            }),
            currentStep
        );
    }

    private getStep(step: TransactionFlowStep): TransactionConfigStep {
        return this.transactionConfig.steps.find(x => x.type === step) as TransactionConfigStep;
    }


    setMax(percent: number): void {
        let value = this.util.getAsNumber(this.balance, this.reserve.decimals);
        value = value * (percent / 100);
        value = Big(value).minus(0.001).toNumber() // Fix for gas
        this.amountControl.patchValue(value.toFixed(this.reserve.decimals).toString());
    }
}
