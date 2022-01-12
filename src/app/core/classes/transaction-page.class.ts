import {TransactionConfig, TransactionConfigStep} from '../interfaces/transaction-config.interface';
import {TransactionFlowStep, TransactionStepStatus} from '../enums/enums';
import {TransactionError} from '../interfaces/metamask.interface';

export abstract class TransactionPageClass {
	transactionConfig: TransactionConfig;
	currentTransactionsStatus: TransactionFlowStep = TransactionFlowStep.SUBMIT;

	resetConfig(): void {
		this.transactionConfig.steps.forEach(x => {
			x.currentStatus = TransactionStepStatus.DEFAULT;
		});
		this.currentTransactionsStatus = this.transactionConfig.steps[0].type;
	}

	handleApproveTransactionResult(transactionPromise: any, currentStep: TransactionConfigStep): void {
		transactionPromise.then((res: any, error: TransactionError) => {
			if (error) {
				currentStep.currentStatus = TransactionStepStatus.DENIED;
			} else {
				currentStep.hash = res.transactionHash;
				currentStep.currentStatus = TransactionStepStatus.SUCCESS;
				this.currentTransactionsStatus = TransactionFlowStep.SUBMIT;
			}
		});
	}

	handleTransactionResult(transactionPromise: any, currentStep: TransactionConfigStep, lastStep: TransactionConfigStep): void {
		transactionPromise.then((res: any, error: TransactionError) => {
			if (error) {
				currentStep.currentStatus = TransactionStepStatus.DENIED;
			} else {
				lastStep.hash = res.transactionHash;
				currentStep.currentStatus = TransactionStepStatus.SUCCESS;
				this.currentTransactionsStatus = TransactionFlowStep.SUCCESS;
			}
		});
	}
}
