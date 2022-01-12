import {Component, OnDestroy, OnInit} from '@angular/core';
import {FlowSteps, TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {FormControl, Validators} from '@angular/forms';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {ActivatedRoute} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {AccountService} from '../../../../services/account.service';
import {Subject} from 'rxjs';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {APPROVE_ABI, LENDING_POOL_ABI, WETH_GATEWAY_ABI} from '../../../../core/abi/abi';
import {environment} from '../../../../../environments/environment';
import {APPROVE_AMOUNT} from '../../../../core/constants/constans';
import {TransactionError} from '../../../../core/interfaces/metamask.interface';
import {Web3Service} from '../../../../services/web3.service';
import Big from 'big.js';
import {ReservesService} from '../../../../services/reserves.service';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {TransactionPageClass} from '../../../../core/classes/transaction-page.class';

@Component({
	selector: 'app-repay-from-wallet',
	templateUrl: './repay-from-wallet.component.html',
	styleUrls: ['./repay-from-wallet.component.scss']
})
export class RepayFromWalletComponent extends TransactionPageClass implements OnInit, OnDestroy {
	currentStep: FlowSteps = FlowSteps.USER_INPUT;
	amountControl = new FormControl('', [Validators.required, Validators.min(0.000000001)]);
	steps = FlowSteps;
	currentTransactionsStatus = TransactionFlowStep.SUBMIT;
	balance: string = '0';
	availableToRepay: number = 0;
	reserve: MarketReserve;
	util = CalculationsUtil;
	userReserve: UserReserve;
	emptyState: boolean = false;
	transactionConfig: TransactionConfig = {
		steps: [
			{
				name: 'Repay',
				type: TransactionFlowStep.SUBMIT,
				currentStatus: TransactionStepStatus.DEFAULT,
			},
			{
				name: 'Finished',
				type: TransactionFlowStep.SUCCESS,
				currentStatus: TransactionStepStatus.DEFAULT,
			},
		],
		type: 'repay',
	};
	private destroyed$ = new Subject();
	healthFactor: number;
	remainingToRepay = {
		inCoins: 0,
		inUsd: 0
	};

	constructor(private route: ActivatedRoute,
				private web3: Web3Service,
				private reservesService: ReservesService,
				private accountService: AccountService) {
		super();
	}

	ngOnInit(): void {
		this.reserve = (this.route.parent as ActivatedRoute).snapshot.data.reserve as MarketReserve;
		this.getAccountBalance();
    this.checkIfApproveNeed();
		this.reservesService.getUserReserves()
			.pipe(
				takeUntil(this.destroyed$)
			)
			.subscribe((list) => {
				this.healthFactor = this.util.getCurrentHealthFactor(list);
				this.userReserve = list.find(x => x.reserve.id === this.reserve.id) as UserReserve;
				this.checkAmountToRepay();
			});
	}

  private checkIfApproveNeed(): void {
    if (!this.web3.isWeb3Connected()) {
      return;
    }
    const asset = this.reserve.underlyingAsset;
    const account = this.accountService.getAccount().getValue() as string;
    const approve = {
      name: 'Approve',
      currentStatus: TransactionStepStatus.DEFAULT,
      type: TransactionFlowStep.APPROVE
    };
    this.web3.getAllowanceByAsset(account, asset).then((allowance: string) => {
      console.log('allowance', allowance);
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
				this.checkAmountToRepay();
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

	private checkAmountToRepay(): void {
		if (this.balance && this.userReserve) {
			const balance = +this.balance;
			const available = +this.userReserve.scaledVariableDebt;
			this.availableToRepay = Math.min(balance, available);
		}
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}


	setMax(percent: number): void {
		let value = this.util.getAsNumber(this.availableToRepay.toString(), this.reserve.decimals);
		value = value * (percent / 100);
    console.log('value', value);
		this.amountControl.patchValue(value);
	}

	checkAmount(): void {
		this.amountControl.updateValueAndValidity();
		if (this.amountControl.invalid) {
			this.amountControl.markAsTouched();
			return;
		}
    this.amountControl.setValue(Number(this.amountControl.value).toFixed(this.reserve.decimals).toString());
		this.remainingToRepay.inCoins = this.util.getAsNumber(this.userReserve.scaledVariableDebt, this.userReserve.reserve.decimals) - this.amountControl.value;
		this.remainingToRepay.inUsd = this.remainingToRepay.inCoins * +this.userReserve.reserve.priceInUsd;
		this.currentStep = FlowSteps.TRANSACTION_DETAILS;
	}

	submit(): void {
		const asset = this.reserve.underlyingAsset;
		const account = this.accountService.getAccount().getValue() as string;
		const currentStep = this.getStep(TransactionFlowStep.SUBMIT);
		const amount = this.amountControl.value;
    let formattedAmount = Big(amount * Math.pow(10, this.reserve.decimals)).round().toString();
    if (formattedAmount === this.availableToRepay.toString()) {
      const percent = Big(this.reserve.variableBorrowRate).div(Big(Math.pow(10, 25))).round(2).toString();
      let amountWithPercent = Big(Big(amount).mul(percent).div(100).toNumber());
      formattedAmount = Big(formattedAmount).plus(amountWithPercent).toString();
      if (this.reserve.symbol === 'ETH') {
        formattedAmount = Big(amount).plus(amountWithPercent).toString();
      }
      formattedAmount = Big(+ formattedAmount * Math.pow(10, this.reserve.decimals)).round().toString();
    }
		const lastStep = this.getStep(TransactionFlowStep.SUCCESS);

		if (this.reserve.symbol === 'ETH') {
			this.createETHRepay(formattedAmount, account, currentStep, lastStep);
		} else {
			this.createERC20repay(asset, formattedAmount, account, currentStep, lastStep);
		}
	}

	private createETHRepay(formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		const contract = this.web3.createContract(WETH_GATEWAY_ABI, environment.WETHGateway);
		const method = contract.methods.repayETH(
			environment.lendingPoolAddress,
			formattedAmount,
			'2',
			account
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

	private createERC20repay(asset: string, formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		const contract = this.web3.createContract(LENDING_POOL_ABI, environment.lendingPoolAddress);
		contract.methods.repay(
			asset,
			formattedAmount,
			'2',
			account
		).send({from: account}, (error: TransactionError, hash: string) => {
			if (error) {
				currentStep.currentStatus = TransactionStepStatus.DENIED;
			} else {
				currentStep.hash = hash;
				currentStep.currentStatus = TransactionStepStatus.PENDING;
			}
		}).then((res: any, error: TransactionError) => {
			if (error) {
				currentStep.currentStatus = TransactionStepStatus.DENIED;
			} else {
				currentStep.hash = res.transactionHash;
				currentStep.currentStatus = TransactionStepStatus.SUCCESS;
				this.currentTransactionsStatus = TransactionFlowStep.SUCCESS;
			}
		});
	}

  approve(): void {
    const account = this.accountService.getAccount().getValue() as string;
    const collateral = this.reserve;
    const approveContract = this.web3.createContract(APPROVE_ABI, collateral.underlyingAsset);
    const currentStep = this.getStep(TransactionFlowStep.APPROVE);

    const method = approveContract.methods.approve(
      environment.lendingPoolAddress,
      APPROVE_AMOUNT
    ).send({from: account}, (error: TransactionError, hash: string) => {
      if (error) {
        currentStep.currentStatus = TransactionStepStatus.DENIED;
      } else {
        currentStep.hash = hash;
        currentStep.currentStatus = TransactionStepStatus.PENDING;
      }
    });
    this.handleApproveTransactionResult(
      method,
      currentStep
    );
  }

	private getStep(step: TransactionFlowStep): TransactionConfigStep {
		return this.transactionConfig.steps.find(x => x.type === step) as TransactionConfigStep;
	}

	changeStep(value: FlowSteps): void {
		this.currentStep = value;

	}
}
