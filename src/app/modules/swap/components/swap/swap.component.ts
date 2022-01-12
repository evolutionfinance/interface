import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservesService} from '../../../../services/reserves.service';
import {debounceTime, startWith, takeUntil} from 'rxjs/operators';
import {DepositedReserve, UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {FlowSteps, TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, combineLatest, merge, Subject} from 'rxjs';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {Web3Service} from '../../../../services/web3.service';
import {AccountService} from '../../../../services/account.service';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import Big from 'big.js';
import {APPROVE_ABI, REPAY_ABI, SWAP_ABI, SWAP_AMOUNT_OUT_ABI, UNISWAP_ROUTER_ABI} from '../../../../core/abi/abi';
import {environment} from '../../../../../environments/environment';
import {APPROVE_AMOUNT, STABLE_COINS} from '../../../../core/constants/constans';
import {INFO_MODAL, InfoModal} from '../../../../core/config/info-modal';
import {TransactionError} from '../../../../core/interfaces/metamask.interface';
import {EMPTY_LIST, EmptyListBody} from '../../../../core/config/empty-list';
import {hex_to_ascii} from '../../../../core/util/util';
import {TooltipInfoModalComponent} from '../../../shared/components/tooltip-info/tooltip-info-modal/tooltip-info-modal.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {TransactionPageClass} from '../../../../core/classes/transaction-page.class';
import {UtilsService} from '../../../../services/utils.service';

@Component({
	selector: 'app-swap',
	templateUrl: './swap.component.html',
	styleUrls: ['./swap.component.scss']
})
export class SwapComponent extends TransactionPageClass implements OnInit, OnDestroy {
	deposits: UserReserve[];
	reserves: MarketReserve[];
	currentFlowStep: FlowSteps = FlowSteps.USER_INPUT;
	steps = FlowSteps;
	from = this.fb.group({
		userReserve: ['', Validators.required],
		amount: ['', [Validators.required, Validators.min(0.000000001)]]
	});
	to = this.fb.group({
		reserve: ['', Validators.required],
		amount: ['', [Validators.required, Validators.min(0.000000001)]]
	});
	private destroyed$ = new Subject();
	currentTransactionsStatus = TransactionFlowStep.SUBMIT;
	slippageControl = new FormControl(2);
	showSlippage: boolean = false;
	transactionConfig: TransactionConfig = {
		steps: [
			{
				name: 'Swap',
				type: TransactionFlowStep.SUBMIT,
				currentStatus: TransactionStepStatus.DEFAULT,
			},
			{
				name: 'Finished',
				type: TransactionFlowStep.SUCCESS,
				currentStatus: TransactionStepStatus.DEFAULT,
			},
		],
		type: 'swap',
	};
	account$: BehaviorSubject<string>;
	healthFactor: number = 0;
	nextHealthFactor: number = 0;
	util = CalculationsUtil;
	userReserves: UserReserve[];
	INFO: InfoModal = INFO_MODAL;
	emptyListConfig: EmptyListBody = EMPTY_LIST.SWAP;

	constructor(private reservesService: ReservesService,
				private accountService: AccountService,
				private modal: NzModalService,
				private web3: Web3Service,
				private fb: FormBuilder,
				private utilsService: UtilsService) {
		super();
	}

	ngOnInit(): void {
		this.utilsService.mobileHeaderTitle.next('Swap');
		this.to.get('amount')?.disable();
		this.account$ = this.accountService.getAccount() as BehaviorSubject<string>;


		this.reservesService.getMarkets()
			.pipe(
				takeUntil(this.destroyed$)
			)
			.subscribe((list) => {
				this.reserves = list;
			});
		this.getUserReserves();
		this.initAmountChangesListener();
	}

	private getUserReserves(): void {
		this.reservesService.getUserReserves()
			.pipe(
				takeUntil(this.destroyed$)
			)
			.subscribe((list) => {
				this.userReserves = list;
				this.healthFactor = this.util.getCurrentHealthFactor(list);
				this.deposits = list.filter(x => Number(x.scaledATokenBalance) > 0);
			});
	}

	private initAmountChangesListener(): void {
		merge(
			this.slippageControl.valueChanges,
			this.from.valueChanges
		).pipe(
			startWith('', ''),
			debounceTime(700),
			takeUntil(this.destroyed$)
		).subscribe((v) => {
			this.calculateAmountTo();
		});
	}

	checkAmount(): void {
		if (this.from.invalid) {
			this.from.markAllAsTouched();
			return;
		}
		if (this.to.invalid) {
			this.to.markAllAsTouched();
			return;
		}
		const asset = this.userReserveFrom.reserve.aToken.id;
		const account = this.accountService.getAccount().getValue() as string;
		const approve = {
      name: 'Approve',
      currentStatus: TransactionStepStatus.DEFAULT,
      type: TransactionFlowStep.APPROVE
    };
		this.web3.getAllowanceByAssetUniswapSwap(account, asset).then((allowance: string) => {
			if (Number(allowance) === 0 && !this.transactionConfig.steps.some(item => item.name === approve.name)) {
				this.transactionConfig.steps.unshift(approve);
				this.currentTransactionsStatus = TransactionFlowStep.APPROVE;
			}
			this.currentFlowStep = FlowSteps.TRANSACTION_DETAILS;
		});
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	get userReserveFrom(): UserReserve {
		return this.from.value.userReserve as UserReserve;
	}

	get reserveTo(): MarketReserve {
		return this.to.value.reserve;
	}

	calculateAmountTo(): void {
		const amountFrom = this.from.value?.amount;
		if (amountFrom && this.userReserveFrom && this.reserveTo) {
			const fromAsset = this.userReserveFrom?.reserve?.underlyingAsset;
			const toAsset = this.reserveTo?.underlyingAsset;
			const formattedAmountFrom = Big(amountFrom * Math.pow(10, this.userReserveFrom.reserve.decimals)).toString();
			const amountContract = this.web3.createContract(UNISWAP_ROUTER_ABI, environment.uniswapRouter);
			const Weth = environment.WethAddress;
			const assets = [fromAsset, toAsset];
			if (this.containStableCoins()) {
				assets.splice(1, 0, Weth);
			}
			amountContract.methods.getAmountsOut(
				formattedAmountFrom,
				assets
			).call().then((res: any) => {
				const slippagePercent = this.slippageControl?.value ? +this.slippageControl.value : 2;
				const slippage = slippagePercent / 100;
				const preAmount = Big(res[1]).mul(1 - slippage).toNumber();
				const amountTo = preAmount / Math.pow(10, this.reserveTo.decimals);
				this.to.get('amount')?.patchValue(amountTo, {emitEvent: false});
			}).catch((err: any) => {
				this.handleError(err);
				this.to.get('amount')?.patchValue(0, {emitEvent: false});
			});
		}
		this.updateHealthFactor();

	}

	get subtotalFrom(): number {
		const amount = this.from.value?.amount;
		if (amount && this.userReserveFrom) {
			return +amount * +this.userReserveFrom.reserve.priceInUsd;
		}
		return 0;
	}

	get subtotalTo(): number {
		const amount = this.to.getRawValue()?.amount;
		const slippagePercent = this.slippageControl?.value ? +this.slippageControl.value + 0.3 : 2.3;
		if (amount && this.reserveTo) {
			const total = +amount * +this.reserveTo.priceInUsd;

			return total * ((100 - slippagePercent) / 100);

		}
		return 0;
	}

	private containStableCoins(): boolean {
		if (this.userReserveFrom && this.reserveTo) {
			if (STABLE_COINS.indexOf(this.userReserveFrom.reserve.symbol) >= 0 && STABLE_COINS.indexOf(this.reserveTo.symbol) >= 0) {
				return true;
			}
		}
		return false;
	}


	private updateHealthFactor(): void {
		const reserveFrom = this.from.getRawValue().userReserve as UserReserve;
		const amountFrom = (0 - this.from.getRawValue().amount) as number;
		const reserveTo = this.to.getRawValue().reserve as MarketReserve;
		const amountTo = this.to.getRawValue().amount as number;
		if (amountFrom && reserveFrom && amountTo && reserveTo) {
			const updatedReserves = this.util.getUpdatedReserves(this.userReserves, reserveFrom.reserve as any, amountFrom, 'scaledATokenBalance');
			this.nextHealthFactor = this.util.getNewHealthFactor(updatedReserves, reserveTo, amountTo, 'scaledATokenBalance');
		}
	}

	resetAmount(key: string): void {
		((this as any)[key] as FormGroup).get('amount')?.reset();
	}

	submitSwap(): void {
		// const assetFrom = this.
		const account = this.accountService.getAccount().getValue() as string;

		const amountFrom = this.from.getRawValue().amount;
		const formattedAmountFrom = Big(amountFrom * Math.pow(10, this.userReserveFrom.reserve.decimals)).toString();

		const amountTo = this.to.getRawValue().amount;
		const formattedAmountTo = Big(amountTo * Math.pow(10, this.reserveTo.decimals)).toNumber().toFixed(0);

		const fromAsset = this.userReserveFrom.reserve.underlyingAsset;
		const toAsset = this.reserveTo.underlyingAsset;

		const currentStep = this.getStep(TransactionFlowStep.SUBMIT);
		const lastStep = this.getStep(TransactionFlowStep.SUCCESS);

		//
		const useEth = this.containStableCoins() ? true : false;

		const contract = this.web3.createContract(SWAP_ABI, environment.uniswapLiquiditySwapAdapter);

		const createdMethod = contract.methods.swapAndDeposit(
			[fromAsset],
			[toAsset],
			[formattedAmountFrom],
			[formattedAmountTo],
			[
				['0', '0', '0', '0x0000000000000000000000000000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000000'],
			],
			[useEth]
		);
		createdMethod.call({from: account}).then((res: number) => {
			this.swapAndDeposit(createdMethod, account, currentStep, lastStep);
		}).catch((err: any) => {
			this.handleError(err);
		});
	}

	private swapAndDeposit(method: any, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		const sendMethod = method.send({from: account}, (error: TransactionError, hash: string) => {
			if (error) {
				currentStep.currentStatus = TransactionStepStatus.DENIED;
			} else {
				currentStep.hash = hash;
				currentStep.currentStatus = TransactionStepStatus.PENDING;
			}
		});
		this.handleTransactionResult(
			sendMethod,
			currentStep,
			lastStep
		);
	}

	approve(): void {
		const account = this.accountService.getAccount().getValue() as string;
		const fromAsset = this.userReserveFrom.reserve as DepositedReserve;
		const approveContract = this.web3.createContract(APPROVE_ABI, fromAsset.aToken.id);
		const currentStep = this.getStep(TransactionFlowStep.APPROVE);

		const method = approveContract.methods.approve(
			environment.uniswapLiquiditySwapAdapter,
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

	setMaxSlippage(value: number): void {
		this.slippageControl.patchValue(value);
	}

	private getStep(step: TransactionFlowStep): TransactionConfigStep {
		return this.transactionConfig.steps.find(x => x.type === step) as TransactionConfigStep;
	}

	toggleSlippage(): void {
		this.showSlippage = !this.showSlippage;
	}

	private handleError(error: { message: string }): void {
		const code = error.message.substr(29);
		const reason = hex_to_ascii(code.substr(138));


		this.modal.create({
			nzContent: TooltipInfoModalComponent,
			nzComponentParams: {
				data: {
					title: 'Some error occured',
					content: reason || 'unknown error'
				}
			},
			nzClosable: false,
			nzCentered: true,
			nzFooter: null
		});
	}

	changeStep(step: FlowSteps): void {
		this.currentFlowStep = step;
		this.resetConfig();
	}
}
