import {Injectable} from '@angular/core';
import {MarketReservesGQL} from '../core/graphQL/market-reserves-gql';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {MarketReserve, MarketReservesResponse} from '../core/interfaces/market-reserves.interface';
import {Apollo, SubscriptionResult} from 'apollo-angular';
import {filter, map, shareReplay, take} from 'rxjs/operators';
import {UserReservesGQl} from '../core/graphQL/user-reserves-sub-gql';
import {UserReserve, UserReservesResponse} from '../core/interfaces/user-reserves-response.interface';
import {environment} from '../../environments/environment';
import {EthPriceGQL} from '../core/graphQL/usd-price-eth-gql';
import {PriceOracleResponse} from '../core/interfaces/price-oracle-response.interface';
import Big from 'big.js';
import {ReserveParamsHistoryItemsResponse} from '../core/interfaces/reserve-history.interface';
import {GET_RESERVES_RATE_HISTORY} from '../core/graphQL/queries';
import {ApolloQueryResult} from '@apollo/client/core';
import {AccountService} from './account.service';
import {BigNumPipe} from '../modules/pipes/pipes/big-num.pipe';
import {getAssetColorBySymbol, getAssetPictureBySymbol, getRandomColorBySymbol} from '../core/util/util';

@Injectable({
	providedIn: 'root'
})
export class ReservesService {
	private markets$: BehaviorSubject<MarketReserve[]>;
	private userReserves$: BehaviorSubject<UserReserve[]>;
	private pricesSocket$: Observable<SubscriptionResult<PriceOracleResponse>>;
	colors: string[] = ['#f94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F', '#90BE6D', '#43AA8B', '#4D908E', '#577590', '#577590'];

	constructor(
		private marketsSocket: MarketReservesGQL,
		private ethPriceSocket: EthPriceGQL,
		private bigNumPipe: BigNumPipe,
		private apollo: Apollo,
		private userReservesSocket: UserReservesGQl) {
	}

	initMarketSocket(updateWallet: boolean = false): void {
		combineLatest([
			this.marketsSocket.subscribe({pool: environment.pool}),
			this.getEthPriceSocket()
		]).subscribe(([reservesRes, ethPrice]: [SubscriptionResult<MarketReservesResponse>, SubscriptionResult<PriceOracleResponse>]) => {
			if (reservesRes.data) {
				const updatedList: MarketReserve[] = reservesRes.data.reserves.map(x => {
					if (x.symbol === 'WETH') {
						x.symbol = 'ETH';
						x.name = 'Ethereum';
					}
					const usdPriceEth = Big(ethPrice.data?.priceOracle.usdPriceEth as string).div(1e18).toFixed(16);
					const priceInEth = Big(x.price.priceInEth as string).div(1e18).toFixed(17);
          x.priceInUsd = Number(usdPriceEth) ? Big(priceInEth).div(usdPriceEth as string).toFixed(5) : '0';
					x.assetPictureUrl = getAssetPictureBySymbol(x.symbol);
					x.liquidityRateFormatted = this.bigNumPipe.transform(x.liquidityRate, 25);
					return x;
				});
				this.setMarkets(updatedList);
			}
		});
	}

	getRandomIntFromInterval(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	getEthPriceSocket(): Observable<SubscriptionResult<PriceOracleResponse>> {
		if (!this.pricesSocket$) {
			this.pricesSocket$ = this.ethPriceSocket.subscribe()
				.pipe(
					shareReplay({bufferSize: 1, refCount: true})
				);
		}
		return this.pricesSocket$;
	}

	initUserReserveSocket(account: string): void {
		combineLatest([
			this.userReservesSocket.subscribe({pool: environment.pool, userAddress: account}),
			this.getEthPriceSocket()
		]).subscribe(([reservesRes, ethPrice]: [SubscriptionResult<UserReservesResponse>, SubscriptionResult<PriceOracleResponse>]) => {
			if (reservesRes.data) {
				const updatedList: UserReserve[] = reservesRes.data.userReserves.map(x => {
					if (x.reserve.symbol === 'WETH') {
						x.reserve.symbol = 'ETH';
						x.reserve.name = 'Ethereum';
					}
					const usdPriceEth = Big(ethPrice.data?.priceOracle.usdPriceEth as string).div(1e18).toFixed(17);
					const priceInEth = Big(x.reserve.price.priceInEth as string).div(1e18).toFixed(17);

					x.reserve.priceInUsd = Number(usdPriceEth) ? Big(priceInEth).div(usdPriceEth as string).toFixed(5) : '0';
					x.reserve.assetPictureUrl = getAssetPictureBySymbol(x.reserve.symbol);
					x.reserve.liquidityRateFormatted = this.bigNumPipe.transform(x.reserve.liquidityRate, 25);
					x.reserve.color = getAssetColorBySymbol(x.reserve.symbol);
					return x;
				});
				this.setUserReserves(updatedList);
			}
		});
	}

	getReserveByIdOnce(id: string): Observable<MarketReserve> {
		return this.getMarkets()
			.pipe(
				filter(list => !!list.length),
				map(list => list.find(x => x.id === id) as MarketReserve),
				take(1)
			);
	}

	getReservesRateHistory(id: string): Observable<ApolloQueryResult<ReserveParamsHistoryItemsResponse>> {
		return this.apollo.query<ReserveParamsHistoryItemsResponse>({
			query: GET_RESERVES_RATE_HISTORY,
			variables: {
				reserveAddress: id
			}
		});
	}


	getMarkets(): BehaviorSubject<MarketReserve[]> {
		if (!this.markets$) {
			this.markets$ = new BehaviorSubject<MarketReserve[]>([]);
		}
		return this.markets$;

	}

	getUserReserves(): BehaviorSubject<UserReserve[]> {
		if (!this.userReserves$) {
			this.userReserves$ = new BehaviorSubject<UserReserve[]>([]);
		}
		return this.userReserves$;
	}

	private setUserReserves(userReserves: UserReserve[]): void {
		if (!this.userReserves$) {
			this.userReserves$ = new BehaviorSubject(userReserves);
		} else {
			this.userReserves$.next(userReserves);
		}
	}

	getMarketByAddressOnce(address: string): Observable<MarketReserve> {
		return this.getMarkets()
			.pipe(
				filter(list => !!list.length),
				map(list => list.find(x => x.id === address) as MarketReserve),
				take(1)
			);
	}

	private setMarkets(markets: MarketReserve[]): void {
		if (!this.markets$) {
			this.markets$ = new BehaviorSubject(markets);
		} else {
			this.markets$.next(markets);
		}
	}


}
