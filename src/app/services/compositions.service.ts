import {Injectable} from '@angular/core';
import {CalculationsUtil} from '../core/util/util-calculations.class';
import {CompositionPart} from '../core/interfaces/composition-config.interface';
import {UserReserve} from '../core/interfaces/user-reserves-response.interface';

@Injectable({
	providedIn: 'root'
})
export class CompositionsService {
	util = CalculationsUtil;

	constructor() {
	}

	buildDepositComposition(list: UserReserve[], total: number): CompositionPart [] {
		const composition: CompositionPart[] = [];
		list.forEach(x => {
			const assetTotalInUsd = this.util.getAsNumber(x.scaledATokenBalance, x.reserve.decimals) * +x.reserve.priceInUsd;
			composition.push({
				pictureUrl: x.reserve.assetPictureUrl,
				label: x.reserve.symbol,
				value: this.util.getAsNumber(x.scaledATokenBalance, x.reserve.decimals),
				percentage: (assetTotalInUsd / total) * 100,
				color: x.reserve.color
			});
		});
		return composition;
	}

	buildCollateralComposition(list: UserReserve[], total: number): CompositionPart[] {
		const composition: CompositionPart[] = [];
		list.forEach(x => {
			if (+x.scaledATokenBalance && x.usageAsCollateralEnabledOnUser) {
				const assetTotalInUsd = this.util.getAsNumber(x.scaledATokenBalance, x.reserve.decimals) * +x.reserve.priceInUsd;
				composition.push({
					pictureUrl: x.reserve.assetPictureUrl,
					label: x.reserve.symbol,
					value: this.util.getAsNumber(x.scaledATokenBalance, x.reserve.decimals),
					percentage: (assetTotalInUsd / total) * 100,
					color: x.reserve.color
				});
			}

		});
		return composition;
	}

	buildBorrowingComposition(list: UserReserve[], total: number): CompositionPart[] {
		const composition: CompositionPart[] = [];
		list.forEach(x => {
			if (+x.currentTotalDebt) {
				const assetTotalInUsd = this.util.getAsNumber(x.currentTotalDebt, x.reserve.decimals) * +x.reserve.priceInUsd;
				composition.push({
					pictureUrl: x.reserve.assetPictureUrl,
					label: x.reserve.symbol,
					value: this.util.getAsNumber(x.scaledATokenBalance, x.reserve.decimals),
					percentage: (assetTotalInUsd / total) * 100,
					color: x.reserve.color
				});
			}
		});
		const available = this.util.getAvailableToBorrowInUsd(list);
		composition.push({
			label: 'Left',
			percentage: (available / total) * 100,
			color: '#e5e5e5'
		});
		return composition;

	}
}
