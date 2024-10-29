import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {Subject} from 'rxjs';
import {AccountService} from '../../../../services/account.service';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {filter, takeUntil} from 'rxjs/operators';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {FlowSteps, TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {FormControl, Validators} from '@angular/forms';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {ReservesService} from '../../../../services/reserves.service';
import {APPROVE_ABI, LENDING_POOL_ABI, minABI, V_TOKEN_ABI, WETH_GATEWAY_ABI} from '../../../../core/abi/abi';
import {environment} from '../../../../../environments/environment';
import {TransactionError} from '../../../../core/interfaces/metamask.interface';
import {Web3Service} from '../../../../services/web3.service';
import Big from 'big.js';
import {CompositionPart} from '../../../../core/interfaces/composition-config.interface';
import {CompositionsService} from '../../../../services/compositions.service';
import {INFO_MODAL, InfoModal} from '../../../../core/config/info-modal';
import {TransactionPageClass} from '../../../../core/classes/transaction-page.class';
import {APPROVE_AMOUNT} from '../../../../core/constants/constans';
import BigNumber from 'bignumber.js';

@Component({
	selector: 'app-withdraw',
	templateUrl: './withdraw.component.html',
	styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent extends TransactionPageClass implements OnInit, OnDestroy {
	amountControl = new FormControl('', [Validators.required, Validators.min(0.000000001)]);
	currentFlowStep: FlowSteps = FlowSteps.USER_INPUT;
	steps = FlowSteps;
	reserve: MarketReserve;
	balance: string;
	balanceInUsd: number;
	currentTransactionsStatus = TransactionFlowStep.SUBMIT;
  isMaxAmount: boolean = false;
	transactionConfig: TransactionConfig = {
		steps: [
			{
				name: 'Withdraw',
				type: TransactionFlowStep.SUBMIT,
				currentStatus: TransactionStepStatus.DEFAULT
			},
			{
				name: 'Finished',
				type: TransactionFlowStep.SUCCESS,
				currentStatus: TransactionStepStatus.DEFAULT
			},
		],
		type: 'withdraw',
	};
	util = CalculationsUtil;
	userReserve: UserReserve;
	userReserves: UserReserve[] = [];
	nextHealthFactor: number = 0;
	private destroyed$ = new Subject();
	healthFactor: number = 0;
	compositionConfig: CompositionPart[] = [];
	INFO: InfoModal = INFO_MODAL;
	collateralTotal: number = 0;
	collateralEthereumEquivalent: string = '0';
	availableToWithdraw: string = '0';
	availableToWithdrawInETH: string = '0';

	constructor(private route: ActivatedRoute,
				private reservesService: ReservesService,
				private compositionsService: CompositionsService,
				private web3: Web3Service,
				private accountService: AccountService) {
		super();
	}

	ngOnInit(): void {
		this.reserve = this.route.snapshot.data.reserve as MarketReserve;
		this.accountService.getAccountBalance()
			.pipe(
				filter(wallet => !!Object.keys(wallet).length),
				takeUntil(this.destroyed$)
			)
			.subscribe((wallet: WalletBalance) => {
				this.balance = wallet[this.reserve.symbol];
				this.balanceInUsd = this.util.getAsNumber(this.balance, this.reserve.decimals) * +this.reserve.priceInUsd;
			});

		this.getUserReserves();
	}

	private getUserReserves(): void {
		this.reservesService.getUserReserves()
			.pipe(
				filter(list => !!list.length),
				takeUntil(this.destroyed$)
			)
			.subscribe( async (reserves: UserReserve[]) => {
				this.userReserves = reserves;
				this.userReserve = reserves.find((x) => x.reserve.symbol === this.reserve.symbol) as UserReserve;
				this.healthFactor = this.util.getCurrentHealthFactor(reserves);
				this.collateralTotal = this.util.getTotalCollateralInUsd(reserves);
				this.collateralEthereumEquivalent = Big(this.userReserve.reserve.price.priceInEth as string).div(1e18).toFixed(7);

				if (this.userReserve) {
					const totalBorrowsMarketReferenceCurrency = this.util.getTotalDebtInETH(this.userReserves);
					const aTokenContract = this.web3.createContract(minABI, this.reserve.aToken.id);
					const account = this.accountService.getAccount().getValue() as string;
					const available = await aTokenContract.methods.balanceOf(account).call({from: account});
					const priceInEth = this.util.getAsNumber(this.userReserve.reserve.price.priceInEth, this.userReserve.reserve.decimals);
					let maxUserAmountToWithdraw = BigNumber.min(new BigNumber(this.reserve.availableLiquidity), new BigNumber(available)).toString(10);
					let maxCollateralToWithdrawInETH = new BigNumber('0');
					if (
						this.userReserve.usageAsCollateralEnabledOnUser &&
						this.reserve.usageAsCollateralEnabled &&
						totalBorrowsMarketReferenceCurrency !== 0
					) {
						const currentHF = this.util.getCurrentHealthFactor(reserves);
						const excessHF = new BigNumber(currentHF).minus('1');
						if (excessHF.gt('0')) {
						const formatedLiquidationThreshold = new BigNumber(this.reserve.reserveLiquidationThreshold ).div(10000);
						maxCollateralToWithdrawInETH = excessHF
							.multipliedBy(Number(totalBorrowsMarketReferenceCurrency))
							// because of the rounding issue on the contracts side this value still can be incorrect
							.div(formatedLiquidationThreshold.plus(0.01).toString())
							.multipliedBy('0.99');
						}
						maxUserAmountToWithdraw = BigNumber.min(
						maxUserAmountToWithdraw,
						maxCollateralToWithdrawInETH.dividedBy(priceInEth)
						).toString();
					} else {
						maxUserAmountToWithdraw = new BigNumber(this.util.getAsNumber(maxUserAmountToWithdraw.toString(), this.reserve.decimals)).toString();
					}
					maxUserAmountToWithdraw = BigNumber.max(maxUserAmountToWithdraw, 0).toString();

					const divider = Math.pow(10, this.reserve.decimals);
					this.availableToWithdrawInETH = maxUserAmountToWithdraw;
					this.availableToWithdraw = Big(maxUserAmountToWithdraw).mul(divider).round().toFixed();
					console.log('this.availableToWithdraw!!!', this.availableToWithdraw);

				}

				this.compositionConfig = this.compositionsService.buildCollateralComposition(reserves, this.util.getTotalCollateralInUsd(reserves));
				if (this.userReserve) {
					this.amountControl.setValidators(
						[
							Validators.required,
							Validators.min(0.000000001),
							Validators.max(this.util.getAsNumber(this.availableToWithdraw, this.reserve.decimals))
						]
					);
				}
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	private checkIfApproveNeed(): void {
		if (this.reserve.symbol === 'ETH') {
      const approve = {
        name: 'Approve',
        currentStatus: TransactionStepStatus.DEFAULT,
        type: TransactionFlowStep.APPROVE
      };
      if (!this.transactionConfig.steps.some(item => item.name === approve.name)) {
        this.transactionConfig.steps.unshift(approve);
      }
			this.currentTransactionsStatus = TransactionFlowStep.APPROVE;
		}
		this.currentFlowStep = FlowSteps.TRANSACTION_DETAILS;
	}

	setMax(percent: number): void {
		let value = this.util.getAsNumber(this.availableToWithdraw, this.reserve.decimals);
		value = value * (percent / 100);
    	this.isMaxAmount = percent === 100;
		this.amountControl.patchValue(value.toFixed(this.reserve.decimals).toString());
	}

	checkAmount(): void {
		if (this.amountControl.invalid) {
			this.amountControl.markAllAsTouched();
			return;
		}
		const amount = 0 - this.amountControl.value;
		this.nextHealthFactor = this.util.getNewHealthFactor(
			this.userReserves,
			this.reserve,
			amount,
			'currentATokenBalance');
		this.checkIfApproveNeed();
	}

	submit(): void {
		const asset = this.reserve.underlyingAsset;
		const account = this.accountService.getAccount().getValue() as string;
		const amount = this.amountControl.value;
		const formattedAmount = Big(amount * Math.pow(10, 18)).round().toString();
		const percentageFormattedAmount = Big(formattedAmount).plus(Big(formattedAmount).div(100).times(5)).round().toFixed().toString();
		const currentStep = this.getStep(TransactionFlowStep.SUBMIT);
		const lastStep = this.getStep(TransactionFlowStep.SUCCESS);

		if (this.reserve.symbol === 'ETH') {
			this.createETHWithdraw(this.availableToWithdraw, account, currentStep, lastStep);
		} else {
			this.createERC20Withdraw(asset, this.availableToWithdraw, account, currentStep, lastStep);
		}

	}

	private createETHWithdraw(formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		const contract = this.web3.createContract(WETH_GATEWAY_ABI, environment.WETHGateway);
		const method = contract.methods.withdrawETH(
			environment.lendingPoolAddress,
			formattedAmount,
			account
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


	private createERC20Withdraw(asset: string, formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		const contract = this.web3.createContract(LENDING_POOL_ABI, environment.lendingPoolAddress);

		const method = contract.methods.withdraw(
			asset,
			formattedAmount,
			account,
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

	private getStep(step: TransactionFlowStep): TransactionConfigStep {
		return this.transactionConfig.steps.find(x => x.type === step) as TransactionConfigStep;
	}

	approve(): void {
		const asset = this.reserve.aToken.id;
		const account = this.accountService.getAccount().getValue() as string;
		const currentStep = this.getStep(TransactionFlowStep.APPROVE);
		// this.currentTransactionsStatus = TransactionFlowStep.PENDING;

		//weth only
		const contract = this.web3.createContract(APPROVE_ABI, asset);
		const method = contract.methods.approve(
			environment.WETHGateway,
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

	changeStep(step: FlowSteps): void {
		this.currentFlowStep = step;
		this.resetConfig();
	}
}
