export interface UserReservesResponse {
    userReserves: UserReserve[];
}

export interface UserReserve {
    lastUpdateTimestamp: number;
    principalStableDebt: string;
    scaledATokenBalance: string;
    scaledVariableDebt: string;
    currentATokenBalance: string;
    stableBorrowLastUpdateTimestamp: number;
    stableBorrowRate: string;
    currentTotalDebt: string;
    currentVariableDebt: string;
    usageAsCollateralEnabledOnUser: boolean;
    reserve: DepositedReserve;
    variableBorrowIndex: string;
    __typename: string;
    isSelected?: boolean;
}

export interface DepositedReserve {
    decimals: number;
    id: string;
    lastUpdateTimestamp: number;
    liquidityRate: string;
    priceInUsd: string;
    name: string;
    reserveLiquidationBonus: string;
    symbol: string;
    underlyingAsset: string;
    assetPictureUrl: string;
    liquidityRateFormatted: string;
    reserveLiquidationThreshold: string;
    baseLTVasCollateral: string;
    price: {
        priceInEth: string;
        __typename: string;
    };
    aToken: {
        id: string;
        __typename: string;
    };
    __typename: string;
    color: string;
}
