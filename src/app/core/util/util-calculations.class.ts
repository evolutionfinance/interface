import Big from 'big.js';
import {MarketReserve} from '../interfaces/market-reserves.interface';
import {DepositedReserve, UserReserve} from '../interfaces/user-reserves-response.interface';

export class CalculationsUtil {


	static getAsNumber(value: string, decimals: number): number {
		const divider = Math.pow(10, decimals);
		return Big(value).div(divider).toNumber();
	}

	static getBigSum(a: string, b: string): string {
		if (!a || !b) {
			return '';
		}
		return Big(a).plus(b).toString();
	}

	static getLiquidationPenalty(reserve: MarketReserve): number {
		if (reserve.reserveLiquidationBonus === '0') {
			return 0;
		}
		return Math.abs(Number(10000) - Number(reserve.reserveLiquidationBonus));
	}

	static getReserveFieldAsUsdString(reserve: MarketReserve, key: string): string {
		const value = (reserve as any)[key] as string;
		const divider = Math.pow(10, reserve.decimals);
		return Big(value).mul(reserve.priceInUsd).div(divider).toFixed(2);
	}

	static getBorrowTotalInUsd(reserve: MarketReserve): string {
		const sum = this.getBigSum(reserve.totalScaledVariableDebt, reserve.totalPrincipalStableDebt);
		const divider = Math.pow(10, reserve.decimals);
		return Big(sum).mul(reserve.priceInUsd).div(divider).toFixed(2);
	}

	static getCoinAmountByUsdTotal(priceInUsd: string, total: number): number {
		return total / Number(priceInUsd);
	}

	static getAvailableToBorrowInUsd(userReserves: UserReserve[]): number {
		return userReserves.reduce((total, x) => {
			const LTV = this.getAsNumber(x.reserve.baseLTVasCollateral, 4);
			const price = Number(x.reserve.priceInUsd);
			if (Number(x.scaledATokenBalance) > 0 && x.usageAsCollateralEnabledOnUser) {
				const tokens = this.getAsNumber(x.scaledATokenBalance, x.reserve.decimals);
				total += (tokens * price) * LTV;
			}
			if (Number(x.currentTotalDebt) > 0) {
				const tokens = this.getAsNumber(x.currentTotalDebt, x.reserve.decimals);
				total -= tokens * price;
			}
			return total;
		}, 0);
	}

	static getTotalBorrowedInUsd(userReserves: UserReserve[]): any {
		return userReserves.reduce((total, x) => {
			const price = Number(x.reserve.priceInUsd);
			if (+x.currentTotalDebt > 0) {
				const tokens = this.getAsNumber(x.currentTotalDebt, x.reserve.decimals);
				total += (tokens * price);
			}
			return total;
		}, 0);
	}

	static getTotalCollateralInUsd(userReserves: UserReserve[]): number {
		return userReserves.reduce((total, x) => {
			const price = Number(x.reserve.priceInUsd);
			if (+x.scaledATokenBalance > 0 && x.usageAsCollateralEnabledOnUser) {
				const tokens = this.getAsNumber(x.scaledATokenBalance, x.reserve.decimals);
				total += (tokens * price);
			}
			return total;
		}, 0);
	}

	static getCurrentHealthFactor(userReserves: UserReserve[]): number {
		const totalCollateralWithLiquidationThreshold = userReserves.reduce((total, x) => {
			const price = Number(x.reserve.priceInUsd);
			if (+x.scaledATokenBalance > 0 && x.usageAsCollateralEnabledOnUser) {
				const tokens = this.getAsNumber(x.scaledATokenBalance, x.reserve.decimals);
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


	static getNewHealthFactor(userReserves: UserReserve[], reserve: MarketReserve, amount: number, key: string): number {
		const updateReserves = this.getUpdatedReserves(userReserves, reserve, amount, key);
		const newHealthFactor = this.getCurrentHealthFactor(updateReserves);
		return newHealthFactor;
		// userReservesCopy[0].scaledVariableDebt = '666';
	}

	static getUpdatedReserves(userReserves: UserReserve[], reserve: MarketReserve, amount: number, key: string): UserReserve[] {
		const userReservesCopy = JSON.parse(JSON.stringify(userReserves)) as UserReserve[];
		const currentReserve = userReservesCopy.find(x => x.reserve.id === reserve.id) as UserReserve;
		const formattedAmount = Big(amount * Math.pow(10, reserve.decimals)).toString();
		if (!currentReserve) {
			const newUserReserve: Partial<UserReserve | any> = {
				usageAsCollateralEnabledOnUser: false,
				scaledATokenBalance: '0',
				scaledVariableDebt: '0',
				reserve: {...reserve} as Partial<DepositedReserve>
			};
			(newUserReserve as any)[key] = Big(formattedAmount).toString();
			userReservesCopy.push(newUserReserve as UserReserve);
		} else {
			(currentReserve as any)[key] = Big((currentReserve as any)[key]).plus(formattedAmount).toString();
		}
		return userReservesCopy;
	}

	static getAvailableToBorrowInTokens(list: UserReserve[] = [], targetReserve: MarketReserve): number {
		let availableToYou = 0;
		const availableByCollateral = this.getAvailableToBorrowInUsd(list);
		const availableByCollateralInTokens = this.getCoinAmountByUsdTotal(targetReserve.priceInUsd, availableByCollateral);
		const availableByLiquidity = this.getAsNumber(targetReserve.availableLiquidity, targetReserve.decimals);
		if (availableByLiquidity > availableByCollateralInTokens) {
			availableToYou = availableByCollateralInTokens;
		} else {
			availableToYou = availableByLiquidity;
		}
		return availableToYou;
	}

  static getTotalDebtInETH(userReserves: UserReserve[]): number {
    return userReserves.reduce((total, x) => {
        const priceInEth = this.getAsNumber(x.reserve.price.priceInEth, 18);
        const debtInToken = x.currentTotalDebt;
        if (+debtInToken > 0) {
          const tokens = this.getAsNumber(debtInToken, x.reserve.decimals);
          total += (tokens * priceInEth);
        }
        return total;
      }, 0);
  }

}
