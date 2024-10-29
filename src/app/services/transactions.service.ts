import {Injectable} from '@angular/core';
import {TransactionError} from '../core/interfaces/metamask.interface';
import {TransactionFlowStep, TransactionStepStatus} from '../core/enums/enums';
import {TransactionConfigStep} from '../core/interfaces/transaction-config.interface';

@Injectable({
	providedIn: 'root'
})
export class TransactionsService {

	constructor() {
	}


	handleApprove(approveMethod: any, account: string, currentStep: TransactionConfigStep, currentTransactionsStatus: TransactionFlowStep): Promise<any> {
		return approveMethod.send({from: account}, (error: TransactionError, hash: string) => {
			if (error) {
				currentStep.currentStatus = TransactionStepStatus.DENIED;
			} else {
				currentStep.hash = hash;
				currentStep.currentStatus = TransactionStepStatus.PENDING;
			}
		})

	}
}
