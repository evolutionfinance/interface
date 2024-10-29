import {TransactionFlowStep, TransactionStepStatus} from '../enums/enums';

export interface TransactionConfig {
    steps: TransactionConfigStep[];
    type: 'deposit' | 'borrow' | 'withdraw' | 'swap' | 'repay' | 'liquidation' | 'use as collateral' | 'do not use as collateral';
}

export interface TransactionConfigStep {
    name: string;
    hash?: string;
    currentStatus: TransactionStepStatus;
    type: TransactionFlowStep;
    submitMessage?: string;
}
