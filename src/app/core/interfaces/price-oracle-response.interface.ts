export interface PriceOracleResponse {
    priceOracle: PriceOracle;
}

export interface PriceOracle {
    usdPriceEth: string;
    __typename: 'PriceOracle';
}
