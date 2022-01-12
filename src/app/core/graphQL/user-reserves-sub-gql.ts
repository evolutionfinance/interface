import {Injectable} from '@angular/core';
import {Subscription} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class UserReservesGQl extends Subscription {
    // pool: "0x88757f2f99175387ab4c6a4b3067c77a695b0349"
    // userAddress: "0x1c9f21cbe172b1bf440d0accbeae48e3e4384fb6"
    document = gql`
        subscription UserPositionUpdateSubscription($userAddress: String, $pool: String) {
            userReserves(where: {user: $userAddress, pool: $pool}) {
            ...UserReserveData
                __typename
            }
        }
        
        fragment UserReserveData on UserReserve {
            scaledATokenBalance
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
            usageAsCollateralEnabledOnUser
            stableBorrowRate
            currentTotalDebt
            currentVariableDebt
            currentATokenBalance
            stableBorrowLastUpdateTimestamp
            principalStableDebt
            scaledVariableDebt
            variableBorrowIndex
            lastUpdateTimestamp
            __typename
        }
        `;

}



