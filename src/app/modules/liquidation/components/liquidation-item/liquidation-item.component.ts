import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CompositionPart} from '../../../../core/interfaces/composition-config.interface';
import {Liquidation, Liquidation2, LiquidationReserveData} from '../../../../core/interfaces/liqudation.interface';
import Big from 'big.js';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {AccountService} from '../../../../services/account.service';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {Subject, Subscription} from 'rxjs';
import {filter, skip, takeUntil} from 'rxjs/operators';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {CompositionsService} from '../../../../services/compositions.service';

@Component({
	selector: 'app-liquidation-item',
	templateUrl: './liquidation-item.component.html',
	styleUrls: ['./liquidation-item.component.scss']
})
export class LiquidationItemComponent implements OnInit, OnDestroy {
	compositionConfig: CompositionPart[] = [];
	etherscanUrl = environment.etherscanUrl;
	amount = new FormControl('', [Validators.required, Validators.min(0.00000001)]);

	totalCollateral = {
		eth: '0',
		usd: '0'
	};
	formattedAddress: string;
	debtToCover = {
		usd: 0,
		coins: 0
	};
	util = CalculationsUtil;
	selectedCollateral: UserReserve;
	walletBalance: string;
	maxToCoverInCoins: number;
	coverAssetPriceUsd: string;
	sub: Subscription;
	receivedAmount: number;
	liquidationBonus: number;
	private destroyed$ = new Subject();

	@Input() liquidation: Liquidation2;


	constructor(private router: Router,
				private compositionsService: CompositionsService,
				private accountService: AccountService) {
	}

	ngOnInit(): void {
		if (this.liquidation.user.reserves.length) {
			this.liquidation.user.reserves[0].isSelected = true;
			this.selectedCollateral = this.liquidation.user.reserves[0];
		}
		this.compositionConfig = this.compositionsService.buildCollateralComposition(this.liquidation.user.reserves, this.liquidation.totalCollateralUsd);
		this.calcDebtToCover();
		this.listenAmountChanges();
		this.getWalletBalance();
		const address = this.liquidation.user.id;
		this.formattedAddress = `${address.substr(0, 4)}...${address.substr(address.length - 4)}`;
	}

	private listenAmountChanges(): void {
		this.sub = this.amount.valueChanges
			.pipe(
				skip(1)
			)
			.subscribe(v => {
				const amount = +v;
				const totalCovered = amount * +this.liquidation.principalReserve.priceInUsd;
				this.receivedAmount = this.util.getCoinAmountByUsdTotal(this.selectedCollateral.reserve.priceInUsd, totalCovered);
				this.liquidationBonus = this.receivedAmount * this.util.getAsNumber(this.selectedCollateral?.reserve.reserveLiquidationBonus, 2);
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
		this.sub?.unsubscribe();
	}


	private getWalletBalance(): void {
		this.accountService.getAccountBalance()
			.pipe(
				filter(x => Object.keys(x).length > 0),
				takeUntil(this.destroyed$)
			)
			.subscribe((wallet: WalletBalance) => {
				const key = this.liquidation.principalReserve.symbol;
				this.walletBalance = wallet[key];
				this.checkMaxToCover();
			});
	}


	private checkMaxToCover(): void {
		this.maxToCoverInCoins = 0;
		if (this.walletBalance) {
			const debtToCoverMax = (+this.liquidation.currentBorrowsUsd / 2);
			const walletMax = this.util.getAsNumber(this.walletBalance, this.liquidation.principalReserve.decimals) * +this.liquidation.principalReserve.priceInUsd;
			const collateralMax = this.util.getAsNumber(this.selectedCollateral.scaledATokenBalance, this.selectedCollateral.reserve.decimals) * +this.selectedCollateral.reserve.priceInUsd;
			const amountInUsd = Math.min(debtToCoverMax, walletMax, collateralMax);
			this.maxToCoverInCoins = amountInUsd / +this.liquidation.principalReserve.priceInUsd;
		}
		if (this.maxToCoverInCoins === 0) {
			this.amount.disable();
		} else {
			this.amount.enable();
		}
	}

	setMax(): void {
		this.amount.patchValue(this.maxToCoverInCoins);
	}


	// private calcTotalCollateral(list: LiquidationReserveData[]): void {
	// 	this.totalCollateral.eth = list.reduce((total, value) => {
	// 		total = Big(total).plus(value.currentUnderlyingBalanceETH).toString();
	// 		return total;
	// 	}, '0');
	// 	this.totalCollateral.usd = list.reduce((total, value) => {
	// 		total = Big(total).plus(value.currentUnderlyingBalanceUSD).toString();
	// 		return total;
	// 	}, '0');
	// }

	private calcDebtToCover(): void {
		this.debtToCover.usd = +this.liquidation.currentBorrowsUsd / 2;
		this.debtToCover.coins = this.debtToCover.usd / +(this.liquidation.principalReserve.priceInUsd as string);
	}


	selectCollateral(collateral: UserReserve, i: number): void {
		this.liquidation.user.reserves.forEach(x => x.isSelected = false);
		collateral.isSelected = true;
		this.selectedCollateral = collateral;
	}

	checkAmount(): void {
		const selected = this.liquidation.user.reserves.find(x => x.isSelected) as UserReserve;
		this.router.navigate(['liquidation', 'confirm'], {
			queryParams: {
				liquidationId: this.liquidation.id,
				amount: this.amount.value,
				collateralReserveId: selected.reserve.id,
				collateralAmount: this.receivedAmount
			}
		});
	}
}
