import {Injectable} from '@angular/core';
import {Subscription} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class MarketReservesGQL extends Subscription {
    document = gql`
        subscription ReserveUpdateSubscription($pool: String) {
          reserves(where: {pool: $pool}) {
            ...ReserveData
            __typename
          }
        }

        fragment ReserveData on Reserve {
          id
          underlyingAsset
          name
          symbol
          decimals
          isActive
          isFrozen
          usageAsCollateralEnabled
          borrowingEnabled
          stableBorrowRateEnabled
          baseLTVasCollateral
          optimalUtilisationRate
          averageStableRate
          stableRateSlope1
          stableRateSlope2
          baseVariableBorrowRate
          variableRateSlope1
          variableRateSlope2
          liquidityIndex
          reserveLiquidationThreshold
          variableBorrowIndex
          aToken {
            id
            __typename
          }
          vToken {
            id
            __typename
          }
          sToken {
            id
            __typename
          }
          availableLiquidity
          stableBorrowRate
          liquidityRate
          totalPrincipalStableDebt
          totalScaledVariableDebt
          totalLiquidity
          utilizationRate
          reserveLiquidationBonus
          variableBorrowRate
          price {
            priceInEth
            __typename
          }
          lastUpdateTimestamp
          stableDebtLastUpdateTimestamp
          reserveFactor,
          __typename
        }`;

}
