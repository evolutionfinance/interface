
export interface MarketReserve {
    aToken: {__typename: string; id: string};
    availableLiquidity: string;
    averageStableRate: string;
    baseLTVasCollateral: string;
    baseVariableBorrowRate: string;
    borrowingEnabled: boolean;
    decimals: number;
    id: string;
    isActive: boolean;
    isFrozen: boolean;
    lastUpdateTimestamp: number;
    liquidityIndex: string;
    liquidityRate: string;
    name: string;
    optimalUtilisationRate: string;
    price: {__typename: string; priceInEth: string};
    reserveFactor: string;
    reserveLiquidationBonus: string;
    reserveLiquidationThreshold: string;
    sToken: {__typename: string; id: string};
    stableBorrowRate: string;
    stableBorrowRateEnabled: boolean;
    stableDebtLastUpdateTimestamp: boolean;
    stableRateSlope1: string;
    stableRateSlope2: string;
    symbol: string;
    totalLiquidity: string;
    totalPrincipalStableDebt: string;
    totalScaledVariableDebt: string;
    underlyingAsset: string;
    usageAsCollateralEnabled: boolean;
    utilizationRate: string;
    vToken: {__typename: string; id: string};
    variableBorrowIndex: string;
    variableBorrowRate: string;
    variableRateSlope1: string;
    variableRateSlope2: string;
    __typename: string;

    priceInUsd: string;
    assetPictureUrl: string;
    liquidityRateFormatted: string;
}

export interface MarketReservesResponse {
    reserves: MarketReserve[];
}

