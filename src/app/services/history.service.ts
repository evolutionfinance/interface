import {Inject, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {ApolloQueryResult, InMemoryCache} from '@apollo/client/core';
import {GET_ETH_PRICE, GET_TRANSACTION_HISTORY} from '../core/graphQL/queries';
import {forkJoin, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpLink} from 'apollo-angular/http';
import {map} from 'rxjs/operators';
import {TransactionHistory} from '../core/interfaces/transaction-history.interface';
import {PriceOracleResponse} from '../core/interfaces/price-oracle-response.interface';
import Big from 'big.js';
import {HttpBackend} from '@angular/common/http';
import {getAssetPictureBySymbol} from '../core/util/util';

@Injectable({
	providedIn: 'root'
})
export class HistoryService {

	constructor(private apollo: Apollo) {
	}


	getTransactionHistory(account: string, amount: number, skipAmount: number): Observable<TransactionHistory[]> {
		return  forkJoin([
			this.apollo.query<{ userTransactions: TransactionHistory[] }>({
				query: GET_TRANSACTION_HISTORY,
				variables: {
					user: account,
					pool: environment.pool,
					first: amount,
					skip: skipAmount
				}
			}),
      this.apollo.query<{ userTransactions: TransactionHistory[] }>({
        query: GET_TRANSACTION_HISTORY,
        variables: {
          user: environment.WETHGateway.toLowerCase(),
          pool: environment.pool,
          first: amount,
          skip: skipAmount
        }
      }),
			this.apollo.query<PriceOracleResponse>({query: GET_ETH_PRICE}),
		]).pipe(
			map(([list, wethList, ethPrice]) => {
        const filteredByUser = wethList.data.userTransactions.filter(item => {
          return item?.onBehalfOf?.id?.toLowerCase() === account.toLowerCase();
        });
        console.log('list', wethList, filteredByUser);
        const newList = JSON.parse(JSON.stringify(list.data.userTransactions.concat(filteredByUser).sort((a, b) => a.timestamp - b.timestamp))) as TransactionHistory[];
				const usdPriceEth = Big(ethPrice.data?.priceOracle.usdPriceEth as string).div(1e18).toFixed(7);
				const updatedList = newList.map((x) => {
					const priceInEth = Big(x.reserve.price.priceInEth as string).div(1e18).toFixed(7);
					const clonedReserve = {
						...x.reserve,
						assetPictureUrl: getAssetPictureBySymbol(x.reserve.symbol),
						priceInUsd: Big(priceInEth).div(usdPriceEth as string).toFixed(5)
					};
					return {
						...x,
						__typename: x.__typename === 'RedeemUnderlying' ? 'Withdrawal' : x.__typename,
						reserve: clonedReserve
					};
				});
				return updatedList;
			})
		);
	}
}
