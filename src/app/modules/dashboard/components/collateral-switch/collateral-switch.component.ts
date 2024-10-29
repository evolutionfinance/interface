import {Component, OnDestroy, OnInit} from '@angular/core';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {ActivatedRoute} from '@angular/router';
import {ReservesService} from '../../../../services/reserves.service';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Web3Service} from '../../../../services/web3.service';
import {LENDING_POOL_ABI} from '../../../../core/abi/abi';
import {environment} from '../../../../../environments/environment';
import {TransactionError} from '../../../../core/interfaces/metamask.interface';
import {AccountService} from '../../../../services/account.service';

@Component({
	selector: 'app-collateral-switch',
	templateUrl: './collateral-switch.component.html',
	styleUrls: ['./collateral-switch.component.scss']
})
export class CollateralSwitchComponent implements OnInit, OnDestroy {
	reserve: MarketReserve;
	userReserves: UserReserve[];
	util = CalculationsUtil;
	currentTransactionsStatus = TransactionFlowStep.SUBMIT;
	healthFactor: number = 0;
	nextHealthFactor: number = 0;
	transactionConfig: TransactionConfig = {
		steps: [
			{
				name: 'Usage as collateral',
				type: TransactionFlowStep.SUBMIT,
				currentStatus: TransactionStepStatus.DEFAULT,
			},
			{
				name: 'Finished',
				type: TransactionFlowStep.SUCCESS,
				currentStatus: TransactionStepStatus.DEFAULT,
			},
		],
		type: 'use as collateral',
	};
	private destroyed$ = new Subject();
	targetSwitchValue: boolean;

	constructor(private route: ActivatedRoute,
				private accountService: AccountService,
				private web3: Web3Service,
				private reservesService: ReservesService) {
	}

	ngOnInit(): void {
		this.reserve = this.route.snapshot.data.reserve as MarketReserve;
		this.reservesService.getUserReserves()
			.pipe(
				takeUntil(this.destroyed$)
			)
			.subscribe((list) => {
				this.userReserves = list;
				this.healthFactor = this.util.getCurrentHealthFactor(list);

				const currentReserve = list.find(x => x.reserve.id === this.reserve.id) as UserReserve;
				this.targetSwitchValue = !currentReserve.usageAsCollateralEnabledOnUser;
				if (currentReserve) {
					let amount = this.util.getAsNumber(currentReserve.scaledATokenBalance, currentReserve.reserve.decimals);
					if (!this.targetSwitchValue) {
						amount = 0 - amount;
					}
					this.nextHealthFactor = this.util.getNewHealthFactor(list, this.reserve, amount, 'scaledATokenBalance')
				}
				this.setStepBySwitchValue(this.targetSwitchValue);
			});
	}

	private setStepBySwitchValue(value: boolean): void {
		if (!value) {
			this.transactionConfig.steps[0] = {
				name: 'Do not use as collateral',
				type: TransactionFlowStep.SUBMIT,
				currentStatus: TransactionStepStatus.DEFAULT,
			};
			this.transactionConfig.type = 'do not use as collateral';
		}
	}


	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	submit(): void {
		const asset = this.reserve.underlyingAsset;
		const account = this.accountService.getAccount().getValue() as string;
		const currentStep = this.getStep(TransactionFlowStep.SUBMIT);
		const contract = this.web3.createContract(LENDING_POOL_ABI, environment.lendingPoolAddress);
		contract.methods.setUserUseReserveAsCollateral(
			asset,
			this.targetSwitchValue
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

	private getStep(step: TransactionFlowStep): TransactionConfigStep {
		return this.transactionConfig.steps.find(x => x.type === step) as TransactionConfigStep;
	}
}
