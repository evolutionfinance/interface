import {DepositedReserve, UserReserve} from './user-reserves-response.interface';

export interface Liquidation {
	currentBorrows: string;
	currentBorrowsETH: string;
	currentBorrowsUSD: string;
	id: string;
	principalBorrows: string;
	reserve: {
		decimals: number;
		id: string;
		symbol: string;
		underlyingAsset: string;
		color?: string;
		priceInUsd: string;
		assetPictureUrl?: string;
		__typename: string;
	};
	user: {
		availableBorrowsETH: string;
		currentLiquidationThreshold: string;
		currentLoanToValue: string;
		healthFactor: string;
		id: string;
		maxAmountToWithdrawInEth: string;
		totalBorrowsETH: string;
		totalBorrowsUSD: string;
		totalBorrowsWithFeesETH: string;
		totalBorrowsWithFeesUSD: string;
		totalCollateralETH: string;
		totalCollateralUSD: string;
		totalFeesETH: string;
		totalFeesUSD: string;
		totalLiquidityETH: string;
		totalLiquidityUSD: string;
		reservesData: LiquidationReserveData[]
	};
}


export interface LiquidationResponse {
	data: Liquidation[];
}

export interface LiquidationReserveData {
	borrowRate: string;
	borrowRateMode: string;
	currentBorrows: string;
	currentBorrowsETH: string;
	currentBorrowsUSD: string;
	currentUnderlyingBalance: string;
	currentUnderlyingBalanceETH: string;
	currentUnderlyingBalanceUSD: string;
	interestRedirectionAddress: string;
	lastUpdateTimestamp: number;
	originationFee: string;
	originationFeeETH: string;
	originationFeeUSD: string;
	principalATokenBalance: string;
	principalBorrows: string;
	principalBorrowsETH: string;
	principalBorrowsUSD: string;
	redirectedBalance: string;
	usageAsCollateralEnabledOnUser: boolean;
	userBalanceIndex: string;
	variableBorrowIndex: string;
	isSelected?: boolean;
	reserve: {
		aToken: {
			id: string;
			__typename: string;
		};
		decimals: number
		id: string;
		lastUpdateTimestamp: number;
		liquidityRate: string;
		name: string;
		reserveLiquidationBonus: string;
		symbol: string;
		underlyingAsset: string;
		usageAsCollateralEnabled: boolean;
		priceInUsd: string;
		color?: string;
		assetPictureUrl?: string;
		__typename: string;
	};
}


export interface Liquidation2 {
	totalCollateralEth: number;
	totalCollateralUsd: number;
	currentBorrowsEth: number;
	currentBorrowsUsd: number;
	principalReserve: DepositedReserve;
	id: string;
	user: {
		id: string;
		healthFactor: number;
		reserves: UserReserve[]
	};
}
