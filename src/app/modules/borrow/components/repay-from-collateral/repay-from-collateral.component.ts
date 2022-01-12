import {Component, OnInit} from '@angular/core';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {FlowSteps, TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {combineLatest, merge, Subject} from 'rxjs';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {debounceTime, startWith, takeUntil} from 'rxjs/operators';
import {DepositedReserve, UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {ReservesService} from '../../../../services/reserves.service';
import {Web3Service} from '../../../../services/web3.service';
import {AccountService} from '../../../../services/account.service';
import {ActivatedRoute} from '@angular/router';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {APPROVE_ABI, REPAY_ABI, UNISWAP_ROUTER_ABI,} from '../../../../core/abi/abi';
import {environment} from '../../../../../environments/environment';
import Big from 'big.js';
import {APPROVE_AMOUNT, STABLE_COINS} from '../../../../core/constants/constans';
import {TransactionError} from '../../../../core/interfaces/metamask.interface';
import {TransactionsService} from '../../../../services/transactions.service';
import {TransactionPageClass} from '../../../../core/classes/transaction-page.class';
import {hex_to_ascii} from '../../../../core/util/util';
import {NzModalService} from 'ng-zorro-antd/modal';
import {TooltipInfoModalComponent} from '../../../shared/components/tooltip-info/tooltip-info-modal/tooltip-info-modal.component';

@Component({
	selector: 'app-repay-from-collateral',
	templateUrl: './repay-from-collateral.component.html',
	styleUrls: ['./repay-from-collateral.component.scss']
})
export class RepayFromCollateralComponent extends TransactionPageClass implements OnInit {
	userReserves: UserReserve[];
	reserve: MarketReserve;
	depositsList: UserReserve[];
	borrowedReserve: UserReserve;
	currentFlowStep: FlowSteps = FlowSteps.USER_INPUT;
	steps = FlowSteps;
	borrowedForm = this.fb.group({
		borrowedReserve: ['', Validators.required],
		amount: ['', [Validators.required, Validators.min(0.000000001)]]
	});
	collateralForm = this.fb.group({
		reserve: ['', Validators.required],
		amount: ['', [Validators.required, Validators.min(0.000000001)]]
	});
	slippageControl = new FormControl(2);
	showSlippage: boolean = false;
	private destroyed$ = new Subject();
	currentTransactionsStatus = TransactionFlowStep.SUBMIT;
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
	util = CalculationsUtil;
	nextHealthFactor: number = 0;
	healthFactor: number = 0;

	constructor(private fb: FormBuilder,
				private web3: Web3Service,
				private route: ActivatedRoute,
				private transactionsService: TransactionsService,
				private accountService: AccountService,
				private modal: NzModalService,
				private reservesService: ReservesService) {
		super();
	}

	ngOnInit(): void {
		this.reserve = this.route.snapshot.parent?.data.reserve as MarketReserve;
		this.collateralForm.get('amount')?.disable();
		this.reservesService.getUserReserves()
			.pipe(
				takeUntil(this.destroyed$)
			)
			.subscribe((list) => {
				this.userReserves = list;
				this.healthFactor = this.util.getCurrentHealthFactor(this.userReserves);
				this.depositsList = list.filter(x => Number(x.scaledATokenBalance) > 0);
				this.borrowedReserve = this.userReserves.find(x => x.reserve.id === this.reserve.id) as UserReserve;
				this.borrowedForm.patchValue({borrowedReserve: this.borrowedReserve});
				this.borrowedForm.get('borrowedReserve')?.disable();
			});

		this.initAmountChangesListener();
	}

	private initAmountChangesListener(): void {
		merge(
			this.borrowedForm.valueChanges,
			this.slippageControl.valueChanges
		).pipe(
			startWith('', ''),
			debounceTime(700),
			takeUntil(this.destroyed$)
		).subscribe((v) => {
			this.calculateAmountTo();
		});
	}

	get userBorrowedReserve(): UserReserve {
		return this.borrowedForm.getRawValue()?.borrowedReserve as UserReserve;
	}

	get fromCollateral(): UserReserve {
		return this.collateralForm.value.reserve;
	}

	calculateAmountTo(): void {
		const amountBorrowed = this.borrowedForm.value?.amount;
		if (amountBorrowed && this.userBorrowedReserve && this.fromCollateral) {
			const borrowedAsset = this.userBorrowedReserve?.reserve?.underlyingAsset;
			const collateralAsset = this.fromCollateral?.reserve?.underlyingAsset;
			const formattedBorrowedAmount = Big(amountBorrowed * Math.pow(10, this.userBorrowedReserve.reserve.decimals)).toString();

			const Weth = environment.WethAddress;
			const assets = [collateralAsset, borrowedAsset];
			if (this.containStableCoins()) {
				assets.splice(1, 0, Weth);
			}
			const amountContract = this.web3.createContract(UNISWAP_ROUTER_ABI, environment.uniswapRouter);
			amountContract.methods.getAmountsIn(
				formattedBorrowedAmount,
				assets
			).call().then((res: any) => {
				const slippagePercent = this.slippageControl?.value ? +this.slippageControl.value : 2;
				const slippage = slippagePercent / 100;
				const preAmount = Big(res[0]).mul(1 + slippage).toNumber();
				const amountTo = preAmount / Math.pow(10, this.fromCollateral.reserve.decimals);
				this.collateralForm.get('amount')?.patchValue(amountTo, {emitEvent: false});
			}).catch((err: any) => {
				this.handleError(err);
				this.collateralForm.get('amount')?.patchValue(0, {emitEvent: false});
			});
		}
		this.updateHealthFactor();
	}


	private updateHealthFactor(): void {
		const reserveFrom = this.borrowedForm.getRawValue().borrowedReserve as UserReserve;
		const amountFrom = (0 - this.borrowedForm.getRawValue().amount) as number;
		const reserveTo = this.collateralForm.getRawValue().reserve as UserReserve;
		const amountTo = (0 - this.collateralForm.getRawValue().amount) as number;
		if (amountFrom && reserveFrom && amountTo && reserveTo) {
			const updatedReserves = this.util.getUpdatedReserves(this.userReserves, reserveFrom.reserve as any, amountFrom, 'scaledVariableDebt');
			this.nextHealthFactor = this.util.getNewHealthFactor(updatedReserves, reserveTo.reserve as any, amountTo, 'scaledATokenBalance');
		}
	}

	get subtotalBorrowed(): number {
		const amount = this.borrowedForm.value?.amount;
		if (amount && this.userBorrowedReserve) {
			return +amount * +this.userBorrowedReserve.reserve.priceInUsd;
		}
		return 0;
	}

	get subtotalCollateral(): number {
		const amount = this.collateralForm.getRawValue()?.amount;
		const slippagePercent = this.slippageControl?.value ? +this.slippageControl.value + 0.3 : 2.3;
		if (amount && this.fromCollateral) {
			const total = +amount * +this.fromCollateral?.reserve.priceInUsd;
			return total * ((100 + slippagePercent) / 100);
		}
		return 0;
	}

	resetAmount(key: string): void {
		((this as any)[key] as FormGroup).get('amount')?.reset();
	}

	checkAmount(): void {
		if (this.borrowedForm.invalid) {
			this.borrowedForm.markAllAsTouched();
			return;
		}
		if (this.collateralForm.invalid) {
			this.collateralForm.markAllAsTouched();
			return;
		}
		this.currentFlowStep = FlowSteps.TRANSACTION_DETAILS;
		this.checkIfApproveNeed(this.fromCollateral.reserve.aToken.id);

	}


	submit(): void {
		const account = this.accountService.getAccount().getValue() as string;

		const borrowedAsset = this.userBorrowedReserve.reserve.underlyingAsset;
		const collateralAsset = this.fromCollateral.reserve.underlyingAsset;
		const amountBorrowed = this.borrowedForm.getRawValue().amount;
		const formattedBorrowedAmount = Big(amountBorrowed * Math.pow(10, this.userBorrowedReserve.reserve.decimals)).toString();
		const amountCollateral = this.collateralForm.getRawValue().amount;
		const formattedCollateralAmount = Big(amountCollateral * Math.pow(10, this.fromCollateral.reserve.decimals)).toFixed(0).toString();

		const currentStep = this.getStep(TransactionFlowStep.SUBMIT);
		const lastStep = this.getStep(TransactionFlowStep.SUCCESS);


		const contract = this.web3.createContract(REPAY_ABI, environment.uniswapRepayAdapter);

		const useEth = this.containStableCoins() ? true : false;

		const createdMethod = contract.methods.swapAndRepay(
			collateralAsset,
			borrowedAsset,
			formattedCollateralAmount,
			formattedBorrowedAmount,
			'2',
			['0', '0', '0', '0x0000000000000000000000000000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000000'],
			useEth
		);
		createdMethod.call({from: account}).then((res: number) => {
			this.swapAndRepay(createdMethod, account, currentStep, lastStep);
			// debugger
		}).catch((err: any) => {
			this.handleError(err);
		});
	}

	private swapAndRepay(method: any, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
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

	private containStableCoins(): boolean {
		if (this.fromCollateral && this.userBorrowedReserve) {
			if (STABLE_COINS.indexOf(this.fromCollateral.reserve.symbol) >= 0 && STABLE_COINS.indexOf(this.userBorrowedReserve.reserve.symbol) >= 0) {
				return true;
			}
		}
		return false;
	}


	approve(): void {
		const account = this.accountService.getAccount().getValue() as string;
		const collateral = this.fromCollateral.reserve as DepositedReserve;
		const approveContract = this.web3.createContract(APPROVE_ABI, collateral.aToken.id);
		const currentStep = this.getStep(TransactionFlowStep.APPROVE);

		const method = approveContract.methods.approve(
			environment.uniswapRepayAdapter,
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


	setMaxSlippage(value: number): void {
		this.slippageControl.patchValue(value);
	}

	toggleSlippage(): void {
		this.showSlippage = !this.showSlippage;
	}

	private checkIfApproveNeed(asset: string): void {
		const account = this.accountService.getAccount().getValue() as string;
		const approve = {
      name: 'Approve',
      currentStatus: TransactionStepStatus.DEFAULT,
      type: TransactionFlowStep.APPROVE
    };
		this.web3.getAllowanceByAssetUniswap(account, asset).then((allowance: string) => {
			if (Number(allowance) === 0 && !this.transactionConfig.steps.some(item => item.name === approve.name)) {
				this.transactionConfig.steps.unshift(approve);
				this.currentTransactionsStatus = TransactionFlowStep.APPROVE;
			}
			this.currentFlowStep = FlowSteps.TRANSACTION_DETAILS;
		});

	}

	private handleError(error: { message: string }): void {
		const code = error.message.substr(29);
		const reason = hex_to_ascii(code.substr(138));


		this.modal.create({
			nzContent: TooltipInfoModalComponent,
			nzComponentParams: {
				data: {
					title: 'Some error occured',
					content: reason
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
