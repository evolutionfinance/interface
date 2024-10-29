import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {Liquidation2, LiquidationResponse} from '../core/interfaces/liqudation.interface';
import {map} from 'rxjs/operators';
import {getAssetColorBySymbol, getAssetPictureBySymbol, getRandomColorBySymbol} from '../core/util/util';
import {PriceOracleResponse} from '../core/interfaces/price-oracle-response.interface';
import {GET_ETH_PRICE, GET_LIQUIDATIONS} from '../core/graphQL/queries';
import {Apollo} from 'apollo-angular';
import {InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import Big from 'big.js';
import {UserReserve} from '../core/interfaces/user-reserves-response.interface';
import {CalculationsUtil} from '../core/util/util-calculations.class';

@Injectable({
	providedIn: 'root'
})
export class LiquidationService {
	private apiUrl: string = environment.liquidationApiUrl;
	private util = CalculationsUtil;

	constructor(private http: HttpClient,
				private httpLink: HttpLink,
				private apollo: Apollo) {
		const options2: any = {uri: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2-kovan'};
		apollo.createNamed('aave', {
			link: httpLink.create(options2),
			cache: new InMemoryCache()
		});
	}

	getLiquidations(): Observable<any> {
		return this.http.get<LiquidationResponse>(`${this.apiUrl}liquidations?get=proto`)
			.pipe(
				map(res => res.data),
				map(list => {
					list = list.filter(x => +x.user.healthFactor > 0);
					list.forEach(liq => {
						if (liq.reserve.symbol === 'WETH') {
							liq.reserve.symbol = 'ETH';
							// liq.reserve.name = 'Ethereum';
						}
						liq.reserve.assetPictureUrl = getAssetPictureBySymbol(liq.reserve.symbol);
						liq.reserve.color = getAssetColorBySymbol(liq.reserve.symbol);
						liq.user.reservesData = liq.user.reservesData.filter(x => x.currentUnderlyingBalanceETH !== '0');
						liq.user.reservesData.forEach(rData => {
							if (rData.reserve.symbol === 'WETH') {
								rData.reserve.symbol = 'ETH';
							}
							rData.reserve.assetPictureUrl = getAssetPictureBySymbol(rData.reserve.symbol);
							rData.reserve.color = getAssetColorBySymbol(rData.reserve.symbol);
						});
					});
					return list;
				})
			);
	}

	getLiquidations2(): Observable<Liquidation2[]> {
		// aave pool 0x88757f2f99175387ab4c6a4b3067c77a695b0349
		// this.apollo.use('aave')
		return forkJoin([
			this.apollo.query<{ liquidationCalls: Liquidation2[] }>({
				query: GET_LIQUIDATIONS,
				variables: {
					pool: environment.pool
				}
			}),
			this.apollo.query<PriceOracleResponse>({query: GET_ETH_PRICE}),
		]).pipe(
			map(([list, ethPrice]) => {
				const newList = JSON.parse(JSON.stringify(list.data.liquidationCalls)) as Liquidation2[];
				const usdPriceEth = Big(ethPrice.data?.priceOracle.usdPriceEth as string).div(1e18).toFixed(7);
				let updatedList = newList.map(l => {
					// debugger
					l.user.reserves.forEach(r => {
						const priceInEth = Big(r.reserve.price.priceInEth as string).div(1e18).toFixed(7);
						// if (r.reserve.symbol === 'WETH') {
						// 	r.reserve.symbol = 'ETH';
						// 	r.reserve.name = 'Ethereum';
						// }
						r.reserve.priceInUsd = Big(priceInEth).div(usdPriceEth as string).toFixed(5);
						r.reserve.color = getAssetColorBySymbol(r.reserve.symbol);
						r.reserve.assetPictureUrl = getAssetPictureBySymbol(r.reserve.symbol);
					});
					l.user.healthFactor = this.getCurrentHealthFactor(l.user.reserves);
					l.totalCollateralUsd = this.util.getTotalCollateralInUsd(l.user.reserves);
					l.totalCollateralEth = l.totalCollateralUsd * +usdPriceEth;
					l.currentBorrowsUsd = this.util.getTotalBorrowedInUsd(l.user.reserves);
					l.currentBorrowsEth = l.currentBorrowsUsd * +usdPriceEth;
					l.principalReserve.assetPictureUrl = getAssetPictureBySymbol(l.principalReserve.symbol);
					const colPriceInEth = Big(l.principalReserve.price.priceInEth as string).div(1e18).toFixed(7);
					l.principalReserve.priceInUsd = Big(colPriceInEth).div(usdPriceEth as string).toFixed(5);
					// if (l.principalReserve.symbol === 'WETH') {
					// 	l.principalReserve.symbol = 'ETH';
					// 	l.principalReserve.name = 'Ethereum';
					// }
					l.principalReserve.assetPictureUrl = getAssetPictureBySymbol(l.principalReserve.symbol);
					l.user.reserves = l.user.reserves.filter(x => +x.scaledATokenBalance > 0);
					// l.totalCollateral
					return l;
				});
				updatedList = updatedList.filter(x => x.user.reserves.length);
				return updatedList;
			})
		);
	}


	private getTotalBorrowedInUsd(userReserves: UserReserve[]): any {
		return userReserves.reduce((total, x) => {
			const price = Number(x.reserve.priceInUsd);
			if (+x.currentTotalDebt > 0) {
				const tokens = this.util.getAsNumber(x.currentTotalDebt, x.reserve.decimals);
				total += (tokens * price);
			}
			return total;
		}, 0);
	}

	private getCurrentHealthFactor(userReserves: any[]): number {
		const totalCollateralWithLiquidationThreshold = userReserves.reduce((total, x) => {
			const price = Number(x.reserve.priceInUsd);
			if (+x.currentATokenBalance > 0 && x.usageAsCollateralEnabledOnUser) {
				const tokens = this.util.getAsNumber(x.currentATokenBalance, x.reserve.decimals);
				const threshold = Number(x.reserve.reserveLiquidationThreshold) / 10000;
				total += (tokens * price) * threshold;
			}
			return total;
		}, 0);
		const totalBorrowed = this.getTotalBorrowedInUsd(userReserves);
		if (totalBorrowed === 0 && totalCollateralWithLiquidationThreshold === 0) {
			return 0;
		}
		if (totalBorrowed === 0) {
			return  2;
		}
		const healthFactor = totalCollateralWithLiquidationThreshold / totalBorrowed;
		return healthFactor;
	}
}
