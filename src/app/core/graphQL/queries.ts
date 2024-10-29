import {gql} from 'apollo-angular';


export const GET_RESERVES_RATE_HISTORY = gql`
    query ReserveRatesHistoryUpdateQuery($reserveAddress: String!) {
        reserveParamsHistoryItems(
            where: {reserve: $reserveAddress}
        first: 100
        orderBy: timestamp
        orderDirection: desc
    ) {
        variableBorrowRate
        stableBorrowRate
        liquidityRate
        utilizationRate
        timestamp
        __typename
        }
    }`;

export const GET_ETH_PRICE = gql`
        query UsdPriceEth {
          priceOracle(id: "1") {
            usdPriceEth
            __typename
          }
        }
    `;

export const GET_RESERVE_RATES_30_DAYS_AGO = gql`query ReservesRates30DaysAgoQuery($timestamp: Int, $pool: String) {
  reserves(where: {pool: $pool}) {
    id
    symbol
    paramsHistory(
      where: {timestamp_lte: $timestamp}
      first: 1
      orderBy: timestamp
      orderDirection: desc
    ) {
      variableBorrowIndex
      variableBorrowRate,
      liquidityIndex,
      liquidityRate,
      timestamp
      __typename
    }
    __typename
  }
}
`;

export const GET_TRANSACTION_HISTORY = gql`query UserHistory($user: String!, $pool: String, $first: Int, $skip: Int) {
  userTransactions(
    first: $first
    skip: $skip
    where: {user: $user, pool: $pool}
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    timestamp
    ... on Deposit {
      amount
        onBehalfOf {
            id
        }
      reserve {
        symbol
        decimals,
        price {
          priceInEth
          __typename
        },
        __typename
      }
      __typename
    }
    ... on RedeemUnderlying {
      amount
      reserve {
        symbol
        decimals
        price {
          priceInEth
          __typename
        }
        __typename
      }
      __typename
    }
    ... on Borrow {
      amount
      borrowRateMode
      borrowRate
      stableTokenDebt
      variableTokenDebt
        onBehalfOf {
            id
        }
      reserve {
        symbol
        decimals
        price {
          priceInEth
          __typename
        }
        __typename
      }
      __typename
    }
    ... on UsageAsCollateral {
      fromState
      toState
      reserve {
        symbol
        decimals
        price {
          priceInEth
          __typename
        }
        __typename
      }
      __typename
    }
    ... on Repay {
      amount
        onBehalfOf {
            id
        }
      reserve {
        symbol
        decimals
        price {
          priceInEth
          __typename
        }
        __typename
      }
      __typename
    }
    ... on Swap {
      borrowRateModeFrom
      borrowRateModeTo
      variableBorrowRate
      stableBorrowRate
      reserve {
        symbol
        decimals
        price {
          priceInEth
          __typename
        }
        __typename
      }
      __typename
    }
    ... on LiquidationCall {
      collateralAmount
      collateralReserve {
        symbol
        decimals
        __typename
      }
      principalAmount
      principalReserve {
        symbol
        decimals
        price {
          priceInEth
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`;

export const GET_LIQUIDATIONS = gql`query Liquidations($pool: String) {
    liquidationCalls(where: {pool: $pool}) {
        id,
        principalReserve {
            id
            underlyingAsset
            name
            symbol
            decimals
            liquidityRate
            reserveLiquidationBonus
            reserveLiquidationThreshold
            lastUpdateTimestamp
            baseLTVasCollateral
            price {
              priceInEth
              __typename
            }
            aToken {
                id
                __typename
            }
            __typename
        }
        user {
            id,
            reserves {
                scaledATokenBalance
                currentATokenBalance
                currentTotalDebt
                usageAsCollateralEnabledOnUser
                stableBorrowRate
                stableBorrowLastUpdateTimestamp
                principalStableDebt
                scaledVariableDebt
                variableBorrowIndex
                lastUpdateTimestamp
                __typename
                reserve {
                    id
                    underlyingAsset
                    name
                    symbol
                    decimals
                    liquidityRate
                    reserveLiquidationBonus
                    reserveLiquidationThreshold
                    lastUpdateTimestamp
                    baseLTVasCollateral
                    price {
                      priceInEth
                      __typename
                    }
                    aToken {
                        id
                        __typename
                    }
                    __typename
                }
            }
        }
    }
}
`;
