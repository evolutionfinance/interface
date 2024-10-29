export interface TransactionHistory {
	amount: string;
	id: string;
	reserve: {
		__typename: 'Reserve',
		assetPictureUrl: string,
		decimals: number,
		priceInUsd: string;
		price: {__typename: string; priceInEth: string};
		symbol: string
	};
  onBehalfOf?: {
    id?: string
}
	timestamp: number;
	totalInUsd: number;
	fromState?: boolean;
	toState?: boolean;
	borrowRate?: string;
	borrowRateMode?: string;
	stableTokenDebt?: string;
	variableTokenDebt?: string;
	__typename: 'Deposit' | 'Repay' | 'UsageAsCollateral' | 'RedeemUnderlying' | 'Borrow' | 'Withdrawal';
}

