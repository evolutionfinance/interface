import {Component, OnInit, ViewChild} from '@angular/core';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {ActivatedRoute} from '@angular/router';
import {ReservesService} from '../../../../services/reserves.service';
import {ReserveParamsHistoryItem} from '../../../../core/interfaces/reserve-history.interface';
import moment from 'moment';
import Big from 'big.js';
import {IChartistData, ILineChartOptions} from 'chartist';
import {APPROVE_AMOUNT, DEFAULT_CHART_OPTIONS} from '../../../../core/constants/constans';
import {FlowSteps, TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {FormControl, Validators} from '@angular/forms';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {debounceTime, filter, takeUntil} from 'rxjs/operators';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {AccountService} from '../../../../services/account.service';
import {Subject} from 'rxjs';
import {Web3Service} from '../../../../services/web3.service';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {BORROW_ABI, V_TOKEN_ABI, WETH_GATEWAY_ABI} from '../../../../core/abi/abi';
import {environment} from '../../../../../environments/environment';
import {TransactionError} from '../../../../core/interfaces/metamask.interface';
import {INFO_MODAL, InfoModal} from '../../../../core/config/info-modal';
import {TransactionPageClass} from '../../../../core/classes/transaction-page.class';
import {Slider} from '../../../../core/interfaces/utils';
import {CustomSliderComponent} from '../../../shared/components/custom-slider/custom-slider.component';
import {UtilsService} from '../../../../services/utils.service';

@Component({
	selector: 'app-borrow',
	templateUrl: './borrow.component.html',
	styleUrls: ['./borrow.component.scss']
})
export class BorrowComponent extends TransactionPageClass implements OnInit {
	balance: string = '0';
	reserve: MarketReserve;
	chartsData: IChartistData = {
		labels: [],
		series: [],
	};
	options: ILineChartOptions = DEFAULT_CHART_OPTIONS;
	noAvailableLiquidity: boolean;
	currentFlowStep: FlowSteps = FlowSteps.USER_INPUT;
	steps = FlowSteps;
	util = CalculationsUtil;
	amountControl = new FormControl('', [Validators.required, Validators.min(0.000000001)]);
	userReserves: UserReserve[];
	currentUserReserve: UserReserve;
	currentTransactionsStatus = TransactionFlowStep.SUBMIT;
	transactionConfig: TransactionConfig = {
		steps: [
			{
				name: 'Borrow',
				type: TransactionFlowStep.SUBMIT,
				currentStatus: TransactionStepStatus.DEFAULT,
			},
			{
				name: 'Finished',
				type: TransactionFlowStep.SUCCESS,
				currentStatus: TransactionStepStatus.DEFAULT,
			},
		],
		type: 'borrow',
	};
	availableToBorrow: number;
	healthFactor: number = 0;
	nextHealthFactor: number = 0;
	collateralTotal: number = 0;
	totalBorrowedUsd: number = 0;
	private destroyed$ = new Subject();
	INFO: InfoModal = INFO_MODAL;
	healthFactorSlider: Slider = {
		min: 0,
		max: 100,
		current: 0,
		title: 'New health factor'
	};

	@ViewChild(CustomSliderComponent) healthFactorSliderComponentRef: CustomSliderComponent;

	constructor(private route: ActivatedRoute,
				private accountService: AccountService,
				private web3: Web3Service,
				private reservesService: ReservesService,
				private utilsService: UtilsService) {
		super();
	}

	ngOnInit(): void {
		this.reserve = this.route.snapshot.data.reserve as MarketReserve;
		this.utilsService.mobileHeaderTitle.next(`Borrow ${this.reserve.symbol}`);
		this.noAvailableLiquidity = this.reserve.availableLiquidity === '0';
		// this.getAccountBalance();
		const id = this.route.snapshot.paramMap.get('id') as string;
		this.reservesService.getReservesRateHistory(id).subscribe(res => {
			this.buildChartData(res.data.reserveParamsHistoryItems);
		});

		this.reservesService.getUserReserves()
			.pipe(
				filter(list => !!list.length),
				takeUntil(this.destroyed$)
			)
			.subscribe((uReserves: UserReserve[]) => {
				this.userReserves = uReserves;
				this.currentUserReserve = uReserves.find(x => x.reserve.symbol === this.reserve.symbol) as UserReserve;
				this.healthFactor = this.util.getCurrentHealthFactor(uReserves);
				this.totalBorrowedUsd = this.util.getTotalBorrowedInUsd(uReserves);
				this.calculateAvailableToBorrow(this.userReserves);
				this.collateralTotal = this.util.getTotalCollateralInUsd(uReserves);
				this.setupHealthFactorSelector();
			});
		this.initAmountChangesListener();
	}

	private initAmountChangesListener(): void {
		this.amountControl.valueChanges
			.pipe(
				debounceTime(500),
				takeUntil(this.destroyed$)
			)
			.subscribe(v => {
				this.updateHealthFactorByAmount(v);
			});
	}

	private setupHealthFactorSelector(): void {
		const maxNewHealthFactor = this.util.getNewHealthFactor(
			this.userReserves,
			this.reserve,
			this.availableToBorrow,
			'currentTotalDebt');
		this.healthFactorSlider.min = maxNewHealthFactor;
		this.healthFactorSlider.max = this.healthFactor;
		this.healthFactorSlider.current = this.healthFactor;

	}

	private calculateAvailableToBorrow(userReserves: UserReserve[]): void {
		this.availableToBorrow = this.util.getAvailableToBorrowInTokens(userReserves, this.reserve);
		this.amountControl.setValidators([Validators.required, Validators.min(0.000000001), Validators.max(this.availableToBorrow)]);

	}

	// private getAccountBalance(): void {
	// 	this.accountService.getAccountBalance()
	// 		.pipe(
	// 			filter(wallet => !!Object.keys(wallet).length),
	// 			takeUntil(this.destroyed$)
	// 		)
	// 		.subscribe((wallet: WalletBalance) => {
	// 			this.balance = wallet[this.reserve.symbol];
	// 		});
	// }


	private buildChartData(history: ReserveParamsHistoryItem[]): void {
		const sorted = history.slice().sort((a, b) => {
			return a.timestamp - b.timestamp;
		});
		const labels = sorted.map((x, index) => {
			return moment.unix(x.timestamp).format('DD MMM');
		});
		const depositData = sorted.map(x => {
			return +Big(x.liquidityRate).div(1e25).toFixed(2);
		});
		this.chartsData = {
			labels: [...labels],
			series: [depositData]
		};
	}


	setMax(percent: number): void {
		const value = this.availableToBorrow * (percent / 100);
    this.amountControl.patchValue(value.toFixed(this.reserve.decimals));
	}

	checkAmount(): void {
		if (this.amountControl.invalid) {
			this.amountControl.markAsTouched();
			return;
		}
    this.amountControl.setValue(Number(this.amountControl.value).toFixed(this.reserve.decimals).toString());
		this.nextHealthFactor = this.util.getNewHealthFactor(
			this.userReserves,
			this.reserve,
			this.amountControl.value,
			'currentTotalDebt');
		this.checkIfApproveNeed(this.reserve.vToken.id);
	}

	submitBorrow(): void {
		const asset = this.reserve.underlyingAsset;
		const account = this.accountService.getAccount().getValue() as string;
		const amount = this.amountControl.value;
		const formattedAmount = Big(amount * Math.pow(10, this.reserve.decimals)).round().toString();
		const currentStep = this.getStep(TransactionFlowStep.SUBMIT);
		const lastStep = this.getStep(TransactionFlowStep.SUCCESS);
console.log('formattedAmount', amount, formattedAmount);
		if (this.reserve.symbol === 'ETH') {
			this.createETHBorrow(formattedAmount, account, currentStep, lastStep);
		} else {
			this.createERC20Borrow(asset, formattedAmount, account, currentStep, lastStep);
		}

	}

	private createETHBorrow(formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		const contract = this.web3.createContract(WETH_GATEWAY_ABI, environment.WETHGateway);
		const method = contract.methods.borrowETH(
			environment.lendingPoolAddress,
			formattedAmount,
			'2',
			'0'
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

	private createERC20Borrow(asset: string, formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		const contract = this.web3.createContract(BORROW_ABI, environment.lendingPoolAddress);
		const method = contract.methods.borrow(
			asset,
			formattedAmount,
			'2',
			'0',
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

	private checkIfApproveNeed(asset: string): void {
		if (this.reserve.symbol === 'ETH') {
      const account = this.accountService.getAccount().getValue() as string;
      console.log('account', account);
      console.log('asset', asset);
      this.web3.getBorrowAllowanceByAsset(account, asset, environment.WETHGateway).then((allowance: string) => {
        console.log('allowance', allowance);
        const approve = {
          name: 'Approve',
          currentStatus: TransactionStepStatus.DEFAULT,
          type: TransactionFlowStep.APPROVE
        };
        console.log('this.transactionConfig.steps', this.transactionConfig.steps, this.transactionConfig.steps.some(item => item.name === approve.name));
        if (Number(allowance) === 0 && !this.transactionConfig.steps.some(item => item.name === approve.name)) {
          this.transactionConfig.steps.unshift(approve);
          this.currentTransactionsStatus = TransactionFlowStep.APPROVE;
        }
      });
		}
		this.currentFlowStep = FlowSteps.TRANSACTION_DETAILS;
	}

	approve(): void {
		const contract = this.web3.createContract(V_TOKEN_ABI, this.reserve.vToken.id);
		const account = this.accountService.getAccount().getValue();
		const currentStep = this.getStep(TransactionFlowStep.APPROVE);
		const method = contract.methods.approveDelegation(
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

	private getStep(step: TransactionFlowStep): TransactionConfigStep {
		return this.transactionConfig.steps.find(x => x.type === step) as TransactionConfigStep;
	}

	changeStep(step: FlowSteps): void {
		this.currentFlowStep = step;
		this.resetConfig();

	}

	updateAmountByHealthFactor(val: number): void {
		const d = this.healthFactorSlider.max / val - 1;
		const targetTotalBorrow = this.totalBorrowedUsd * d;
		const newBorrow = this.util.getCoinAmountByUsdTotal(this.reserve.priceInUsd, targetTotalBorrow);
		if (newBorrow > this.availableToBorrow) {
			this.amountControl.patchValue(this.availableToBorrow.toFixed(this.reserve.decimals), {emitEvent: false});
		} else {
			this.amountControl.patchValue(newBorrow.toFixed(this.reserve.decimals), {emitEvent: false});
		}

	}

	updateHealthFactorByAmount(val: number): void {
		if (val >= 0) {
			const borrowIncreasedBy = val * +this.reserve.priceInUsd;
			const newHealthFactor = this.healthFactorSlider.max / (1 + borrowIncreasedBy / this.totalBorrowedUsd) ;
			this.healthFactorSliderComponentRef?.sliderControl.patchValue(newHealthFactor, {emitEvent: false});
		}

	}
}
