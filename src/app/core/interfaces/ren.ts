import {
    LockChain
} from '@renproject/interfaces';
import BigNumber from 'bignumber.js';

export interface RenCurrency {
    name: string;
    symbol: string;
    imageLink: string;
    action: LockChain;
}

export interface BurnTransactionInfo {
    renHash: string;
    status: string;
    confirmations: number;
    ethereumTX: string | undefined;
    totalConfirmations: number;
    renStatus: 'Submitting to RenVM...' | 'Done';
}

export interface MintTransaction {
    amount: string;
    address?: string;
    renVMHash: string;
    status: string;
    transactionLink: string | undefined;
    confirmationsTotal?: number;
    confirmationsCurrent: number;
    transactionHash: string;
    error?: string;
    action: any;
}
