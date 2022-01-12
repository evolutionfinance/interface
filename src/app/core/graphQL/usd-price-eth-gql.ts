import {Injectable} from '@angular/core';
import {Subscription} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class EthPriceGQL extends Subscription {
    document = gql`
        subscription UsdPriceEth {
          priceOracle(id: "1") {
            usdPriceEth
            __typename
          }
        }
    `;

}
