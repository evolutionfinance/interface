import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {map, takeUntil, tap} from 'rxjs/operators';
import {NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table/src/table.types';

import {compareBigNumber, compareBigNumberByKey} from '../../../../core/util/util';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {ReservesService} from '../../../../services/reserves.service';
import {AccountService} from '../../../../services/account.service';
import {Route, Router} from '@angular/router';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {CompositionPart} from '../../../../core/interfaces/composition-config.interface';
import {CompositionsService} from '../../../../services/compositions.service';
import {EMPTY_LIST, EmptyListBody} from '../../../../core/config/empty-list';
import {NzModalService} from 'ng-zorro-antd/modal';
import {LiquidationOverviewModalComponent} from '../liquidation-overview-modal/liquidation-overview-modal.component';
import {INFO_MODAL, InfoModal} from '../../../../core/config/info-modal';

interface ColumnItem {
	name: string;
	subName?: string;
	sortOrder: NzTableSortOrder | null;
	sortFn: NzTableSortFn | null;
	sortDirections: NzTableSortOrder[];
	nzWidth: string | null;
}

@Component({
	selector: 'app-borrowings',
	templateUrl: './dashboard-borrowings.component.html',
	styleUrls: ['./dashboard-borrowings.component.scss']
})
export class DashboardBorrowingsComponent implements OnInit, OnDestroy {

	data: UserReserve[];
	listOfColumns: ColumnItem[] = [
		{
			name: 'Your borrows',
			sortOrder: null,
			sortFn: (a: UserReserve, b: UserReserve) => a.reserve.name.localeCompare(b.reserve.name),
			sortDirections: ['descend', 'ascend', null],
			nzWidth: '300px'
		},
		{
			name: 'Borrowed',
			sortOrder: null,
			sortFn: (a: UserReserve, b: UserReserve) => compareBigNumber(a.scaledVariableDebt, b.scaledVariableDebt),
			sortDirections: ['descend', 'ascend', null],
			nzWidth: null,
		},
		{
			name: 'Borrow Rate',
			subName: 'Variable',
			sortOrder: null,
			sortFn: (a: UserReserve, b: UserReserve) => compareBigNumberByKey(a.reserve, b.reserve, 'liquidityRate'),
			sortDirections: ['descend', 'ascend', null],
			nzWidth: null
		},
		{
			name: '',
			sortOrder: null,
			sortFn: null,
			sortDirections: [null],
			nzWidth: null
		},
	];
	borrowInfo = {
		borrowed: 0,
		healthFactor: 0,
		collateral: 0,
		currentLTV: 0,
		borrowingPowerUsed: 0
	};
	userWallet: WalletBalance;
	private destroyed$ = new Subject();
	util = CalculationsUtil;
	borrowCompositionConfig: CompositionPart[] = [];
	collateralCompositionConfig: CompositionPart[] = [];
	emptyListConfig: EmptyListBody = EMPTY_LIST.BORROW;
	INFO: InfoModal = INFO_MODAL;

	constructor(
		private reservesService: ReservesService,
		private compositionsService: CompositionsService,
		private accountService: AccountService,
		private router: Router,
        private modal: NzModalService
	) {
	}

	ngOnInit(): void {
		this.reservesService.getUserReserves()
			.pipe(
				tap(list => this.calcInfo(list)),
				map((list: UserReserve[]) => list.filter(item => +item.scaledVariableDebt > 0)),
				takeUntil(this.destroyed$)
			)
			.subscribe((list) => {
				this.data = list;
			});

		this.accountService.getAccountBalance()
			.pipe(
				takeUntil(this.destroyed$)
			)
			.subscribe((balance: WalletBalance) => {
				this.userWallet = balance;
			});
	}

	getAsMarketReserves(reserves: any): UserReserve[] {
		return reserves as UserReserve[];
	}

	private calcInfo(list: UserReserve[]): void {
		this.borrowInfo.borrowed = this.util.getTotalBorrowedInUsd(list);
		this.borrowInfo.collateral = this.util.getTotalCollateralInUsd(list);
		this.borrowInfo.currentLTV = this.borrowInfo.borrowed / this.borrowInfo.collateral;
		this.borrowInfo.borrowingPowerUsed = this.borrowInfo.borrowed / (this.util.getAvailableToBorrowInUsd(list) + this.borrowInfo.borrowed);
		this.borrowInfo.healthFactor = this.util.getCurrentHealthFactor(list);
		this.collateralCompositionConfig = this.compositionsService.buildCollateralComposition(list, this.borrowInfo.collateral);
		this.borrowCompositionConfig = this.compositionsService.buildBorrowingComposition(list, (this.util.getAvailableToBorrowInUsd(list) + this.borrowInfo.borrowed));
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	navigateToBorrow(item: UserReserve): void {
		this.router.navigate(['borrow', item.reserve.symbol, item.reserve.id]);
	}

	navigateToRepay(item: UserReserve): void {
		this.router.navigate(['borrow', item.reserve.symbol, item.reserve.id, 'repay']);
	}

    openLiquidationModal(): void {
        this.modal.create({
            nzContent: LiquidationOverviewModalComponent,
            nzComponentParams: {
               currentLTV: this.borrowInfo.currentLTV
            },
            nzCentered: true,
            nzFooter: null
        });
    }
}
