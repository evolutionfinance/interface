import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TransactionConfig, TransactionConfigStep} from '../../../../core/interfaces/transaction-config.interface';
import {TransactionFlowStep, TransactionStepStatus} from '../../../../core/enums/enums';
import {Liquidation, Liquidation2, LiquidationReserveData} from '../../../../core/interfaces/liqudation.interface';
import {LiquidationService} from '../../../../services/liquidation.service';
import {APPROVE_ABI, LENDING_POOL_ABI, WETH_GATEWAY_ABI} from '../../../../core/abi/abi';
import {environment} from '../../../../../environments/environment';
import {Web3Service} from '../../../../services/web3.service';
import {AccountService} from '../../../../services/account.service';
import Big from 'big.js';
import {DepositedReserve, UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {TransactionPageClass} from '../../../../core/classes/transaction-page.class';
import {hex_to_ascii} from '../../../../core/util/util';
import {APPROVE_AMOUNT} from '../../../../core/constants/constans';
import {TransactionError} from '../../../../core/interfaces/metamask.interface';

@Component({
	selector: 'app-liquidation-confirmation',
	templateUrl: './liquidation-confirmation.component.html',
	styleUrls: ['./liquidation-confirmation.component.scss']
})
export class LiquidationConfirmationComponent extends TransactionPageClass implements OnInit {
	liquidationId: string;
	amount: string;
	collateralAmount: string;
	collateralReserveId: string;
	currentTransactionsStatus = TransactionFlowStep.SUBMIT;
	transactionConfig: TransactionConfig = {
		steps: [
			{
				name: 'Liquidation',
				type: TransactionFlowStep.SUBMIT,
				currentStatus: TransactionStepStatus.DEFAULT
			},
			{
				name: 'Finished',
				type: TransactionFlowStep.SUCCESS,
				currentStatus: TransactionStepStatus.DEFAULT
			},
		],
		type: 'liquidation',
	};
	liquidation: Liquidation2;
	collateral: UserReserve;


	constructor(private route: ActivatedRoute,
				private accountService: AccountService,
				private web3: Web3Service,
				private liquidationsService: LiquidationService,
				private router: Router) {
		super();
	}

	ngOnInit(): void {
		this.liquidationId = this.route.snapshot.queryParamMap.get('liquidationId') as string;
		this.amount = this.route.snapshot.queryParamMap.get('amount') as string;
		this.collateralAmount = this.route.snapshot.queryParamMap.get('collateralAmount') as string;
		this.collateralReserveId = this.route.snapshot.queryParamMap.get('collateralReserveId') as string;
		if (!this.liquidationId || !this.amount || !this.collateralReserveId) {
			this.router.navigate(['liquidation']);
		}
		this.getLiquidation(this.liquidationId, this.collateralReserveId);
	}

	private getLiquidation(liqId: string, collId: string): void {
		this.liquidationsService.getLiquidations2().subscribe(list => {
			this.liquidation = list.find((x: Liquidation2) => x.id === liqId) as Liquidation2;
			this.checkIfApproveNeed(this.liquidation.principalReserve.underlyingAsset);
			this.collateral = this.liquidation.user.reserves.find(x => x.reserve.id === collId) as UserReserve;
		});
	}

	private checkIfApproveNeed(asset: string): void {
		const account = this.accountService.getAccount().getValue() as string;
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

	submit(): void {
		const account = this.accountService.getAccount().getValue() as string;
		const currentStep = this.getStep(TransactionFlowStep.SUBMIT);
		const lastStep = this.getStep(TransactionFlowStep.SUCCESS);
		const formattedAmount = Big(+this.amount * Math.pow(10, this.liquidation.principalReserve.decimals)).toString();


		// if (this.collateral.reserve.symbol === 'ETH') {
		//
		// } else {
		this.createERC20Liquidation(
			formattedAmount, account, currentStep, lastStep
		);
		// }
	}

	private createERC20Liquidation(formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		// Aave v2  0xe0fba4fc209b4948668006b2be61711b7f465bae
		const contract = this.web3.createContract(LENDING_POOL_ABI, environment.lendingPoolAddress);

		const method = contract.methods.liquidationCall(
			this.collateral.reserve.underlyingAsset,
			this.liquidation.principalReserve.underlyingAsset,
			this.liquidation.user.id,
			formattedAmount,
			false
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

	private createETHLiquidation(formattedAmount: string, account: string, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		const contract = this.web3.createContract(WETH_GATEWAY_ABI, environment.WETHGateway);
	``
	}


	private getStep(step: TransactionFlowStep): TransactionConfigStep {
		return this.transactionConfig.steps.find(x => x.type === step) as TransactionConfigStep;
	}

	approve(): void {
		const asset = this.liquidation.principalReserve.underlyingAsset;
		const account = this.accountService.getAccount().getValue() as string;
		const currentStep = this.getStep(TransactionFlowStep.APPROVE);
		// this.currentTransactionsStatus = TransactionFlowStep.PENDING;


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
}
