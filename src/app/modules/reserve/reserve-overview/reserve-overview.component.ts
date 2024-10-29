import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {GET_RESERVES_RATE_HISTORY} from '../../../core/graphQL/queries';
import {ActivatedRoute, Router} from '@angular/router';
import {
	ReserveParamsHistoryItem,
	ReserveParamsHistoryItemsResponse
} from '../../../core/interfaces/reserve-history.interface';
import {ChartType} from 'ng-chartist';
import {IBarChartOptions, IChartistData, IChartistSeriesData, ILineChartOptions, IPieChartOptions} from 'chartist';
// import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import Big from 'big.js';
import moment from 'moment';
import {ReservesService} from '../../../services/reserves.service';
import {MarketReserve} from '../../../core/interfaces/market-reserves.interface';
import {getBigNumbersSum} from '../../../core/util/util';
import {DEFAULT_CHART_OPTIONS} from '../../../core/constants/constans';
import {AccountService} from '../../../services/account.service';
import {WalletBalance} from '../../../core/interfaces/wallet-balance.interface';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {DepositedReserve, UserReserve} from '../../../core/interfaces/user-reserves-response.interface';
import {CalculationsUtil} from '../../../core/util/util-calculations.class';
import {INFO_MODAL, InfoModal} from '../../../core/config/info-modal';
import {UtilsService} from '../../../services/utils.service';

@Component({
	selector: 'app-reserve-overview',
	templateUrl: './reserve-overview.component.html',
	styleUrls: ['./reserve-overview.component.scss']
})
export class ReserveOverviewComponent implements OnInit, OnDestroy {
	history: ReserveParamsHistoryItem[];
	reserve: MarketReserve;
	type: ChartType = 'Line';
	chartsData: { [key: string]: IChartistData } = {
		utilization: {
			labels: [],
			series: [],
		},
		deposit: {
			labels: [],
			series: [],
		},
		borrow: {
			labels: [],
			series: [],
		},
		pie: {
			series: []
		}
	};
	lineChartOptions: ILineChartOptions = DEFAULT_CHART_OPTIONS;
	pieChartOptions: IPieChartOptions = {
		donut: true,
		donutWidth: 25,
		showLabel: false,
		width: 193,
		height: 193,
	};
	userBalance: string = '0';
	userReserve: UserReserve;
	util = CalculationsUtil;
	healthFactor: number;
	availableToYou: number;
	user$: BehaviorSubject<string | null>;
	private destroyed$ = new Subject<boolean>();
	INFO: InfoModal = INFO_MODAL;


	constructor(private markets: ReservesService,
				private accountService: AccountService,
				private router: Router,
				private route: ActivatedRoute,
				private utilsService: UtilsService) {
	}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id') as string;
		this.user$ = this.accountService.getAccount();
		this.markets.getReservesRateHistory(id).subscribe(res => {
			this.history = res.data.reserveParamsHistoryItems;
			this.buildChartData(this.history);
		});

		this.reserve = this.route.snapshot.data.reserve as MarketReserve;
		this.utilsService.mobileHeaderTitle.next(`${this.reserve.name} Reserve Overview`);

		this.chartsData.pie = {
			series: [Number(this.reserve.availableLiquidity), Number(this.util.getBigSum(this.reserve.totalScaledVariableDebt, this.reserve.totalPrincipalStableDebt))]
		};
		this.getAccountBalance();
		this.getUserReserves(id);

	}

	private getUserReserves(id: string): void {
		this.markets.getUserReserves()
			.pipe(
				filter(list => !!list.length)
			)
			.subscribe((userReserves) => {
				this.calcInfo(userReserves, this.reserve);
				this.userReserve = userReserves.find(x => x.reserve.id === id) as UserReserve;
			});
	}

	private calcInfo(list: UserReserve[], reserve: MarketReserve): void {
		this.healthFactor = this.util.getCurrentHealthFactor(list);
		const availableByCollateral = this.util.getAvailableToBorrowInUsd(list);
		const availableByCollateralInTokens = this.util.getCoinAmountByUsdTotal(reserve.priceInUsd, availableByCollateral);
		const availableByLiquidity = this.util.getAsNumber(reserve.availableLiquidity, reserve.decimals);
		if (availableByLiquidity > availableByCollateralInTokens) {
			this.availableToYou = availableByCollateralInTokens;
		} else {
			this.availableToYou = availableByLiquidity;
		}
		// const a
	}

	private getAccountBalance(): void {
		this.accountService.getAccountBalance()
			.pipe(
				filter(wallet => !!Object.keys(wallet).length),
				takeUntil(this.destroyed$)
			)
			.subscribe((wallet: WalletBalance) => {
				this.userBalance = wallet[this.reserve.symbol];
			});
	}

	private buildChartData(history: ReserveParamsHistoryItem[]): void {
		const sorted = history.slice().sort((a, b) => {
			return a.timestamp - b.timestamp;
		});
		const labels = sorted.map((x, index) => {
			return moment.unix(x.timestamp).format('DD MMM');
		});
		const depositData = sorted.map(x => {
			return +Big(x.liquidityRate).div(1e25).toFixed(2);
		});
		const stableData = sorted.map(x => {
			return +Big(x.stableBorrowRate).div(1e25).toFixed(2);
		});
		const utilizationData = sorted.map(x => {
			return +Number(x.utilizationRate).toFixed(2);
		});
		this.chartsData.deposit = {
			labels: [...labels],
			series: [depositData]
		};
		this.chartsData.borrow = {
			labels: [...labels],
			series: [stableData]
		};
		this.chartsData.utilization = {
			labels: [...labels],
			series: [utilizationData]
		};
	}


	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	overallStable(variable: string, stable: string): number {
		const total = Big(variable).plus(stable);
		return Big(variable).div(total).toNumber();
	}

	navigateToDeposit(): void {
		const symbol = this.route.snapshot.paramMap.get('symbol');
		const id = this.route.snapshot.paramMap.get('id');
		this.router.navigate(['deposit', symbol, id]);
	}

	navigateToWithdraw(): void {
		const symbol = this.route.snapshot.paramMap.get('symbol');
		const id = this.route.snapshot.paramMap.get('id');
		this.router.navigate(['deposit', symbol, id, 'withdraw']);
	}

	navigateToRepay(): void {
		const symbol = this.route.snapshot.paramMap.get('symbol');
		const id = this.route.snapshot.paramMap.get('id');
		this.router.navigate(['borrow', symbol, id, 'repay']);
	}

	navigateToBorrow(): void {
		const symbol = this.route.snapshot.paramMap.get('symbol');
		const id = this.route.snapshot.paramMap.get('id');
		this.router.navigate(['borrow', symbol, id]);
	}

	navigateToCollateralSwitch(): void {
		this.userReserve.usageAsCollateralEnabledOnUser = !this.userReserve.usageAsCollateralEnabledOnUser;
		if (+this.userReserve.scaledATokenBalance) {
			const symbol = this.route.snapshot.paramMap.get('symbol');
			const id = this.route.snapshot.paramMap.get('id');
			this.router.navigate(['dashboard', symbol, id, 'collateral']);
		}

	}
}
