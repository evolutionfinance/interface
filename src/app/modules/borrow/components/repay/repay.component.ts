import {Component, OnDestroy, OnInit} from '@angular/core';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {ActivatedRoute} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {AccountService} from '../../../../services/account.service';
import {Subject} from 'rxjs';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {Validators} from '@angular/forms';
import {ReservesService} from '../../../../services/reserves.service';
import {CompositionPart} from '../../../../core/interfaces/composition-config.interface';
import {CompositionsService} from '../../../../services/compositions.service';
import {INFO_MODAL, InfoModal} from '../../../../core/config/info-modal';
import {LiquidationOverviewModalComponent} from '../../../dashboard/components/liquidation-overview-modal/liquidation-overview-modal.component';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
	selector: 'app-repay',
	templateUrl: './repay.component.html',
	styleUrls: ['./repay.component.scss']
})
export class RepayComponent implements OnInit, OnDestroy {
	reserve: MarketReserve;
	util = CalculationsUtil;
	balance: string = '0';
	balanceInUsd: number;
	userReserve: UserReserve;
	userReserveInUsd: number;
	private destroyed$ = new Subject();
	healthFactor: number = 0;
	collateralTotal: number = 0;
	compositionConfig: CompositionPart[] = [];
	INFO: InfoModal = INFO_MODAL;

	constructor(private route: ActivatedRoute,
				private reservesService: ReservesService,
				private compositionsService: CompositionsService,
				private modal: NzModalService,
				private accountService: AccountService) {
	}

	ngOnInit(): void {
		this.reserve = this.route.snapshot.data.reserve as MarketReserve;


		this.accountService.getAccountBalance()
			.pipe(
				filter(wallet => !!Object.keys(wallet).length),
				takeUntil(this.destroyed$)
			)
			.subscribe((wallet: WalletBalance) => {
				this.balance = wallet[this.reserve.symbol];
				this.balanceInUsd = this.util.getAsNumber(this.balance, this.reserve.decimals) * +this.reserve.priceInUsd;
			});

		this.reservesService.getUserReserves()
			.pipe(
				filter(list => !!list.length),
				takeUntil(this.destroyed$)
			)
			.subscribe((reserves: UserReserve[]) => {
				this.healthFactor = this.util.getCurrentHealthFactor(reserves);
				this.collateralTotal = this.util.getTotalCollateralInUsd(reserves);
				this.compositionConfig = this.compositionsService.buildCollateralComposition(reserves, this.util.getTotalCollateralInUsd(reserves));
				this.userReserve = reserves.find((x) => x.reserve.symbol === this.reserve.symbol) as UserReserve;
				this.userReserveInUsd = this.util.getAsNumber(this.userReserve.scaledVariableDebt, this.reserve.decimals) * +this.userReserve.reserve.priceInUsd;
			});
	}


	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	openLiquidationModal(): void {
		this.modal.create({
			nzContent: LiquidationOverviewModalComponent,
			nzComponentParams: {
				currentLTV: +this.reserve.baseLTVasCollateral / Math.pow(10, 4)
			},
			nzCentered: true,
			nzFooter: null
		});
	}
}
