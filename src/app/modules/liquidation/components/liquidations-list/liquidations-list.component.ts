import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table/src/table.types';

import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {compareBigNumberByKey} from '../../../../core/util/util';
import {CompositionPart} from '../../../../core/interfaces/composition-config.interface';
import {LiquidationService} from '../../../../services/liquidation.service';
import {Liquidation, Liquidation2, LiquidationReserveData} from '../../../../core/interfaces/liqudation.interface';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {AccountService} from '../../../../services/account.service';
import {ReservesService} from '../../../../services/reserves.service';
import {forkJoin, Subject} from 'rxjs';
import {debounceTime, filter, skip, take, takeUntil, tap} from 'rxjs/operators';
import {INFO_MODAL, InfoModal} from '../../../../core/config/info-modal';
import {Slider} from '../../../../core/interfaces/utils';

interface ColumnItem {
	name: string;
	sortOrder: NzTableSortOrder | null;
	sortFn: NzTableSortFn | null;
	sortDirections: NzTableSortOrder[];
}

@Component({
	selector: 'app-liquidations-list',
	templateUrl: './liquidations-list.component.html',
	styleUrls: ['./liquidations-list.component.scss']
})
export class LiquidationsListComponent implements OnInit, OnDestroy {
	filters = this.fb.group({
		addressSearch: [''],
		assets: [[]],
		amount: ['']
	});
	liquidations: Liquidation2[] = [];
	filteredLiquidations: Liquidation2[] = [];
	public listOfColumns: ColumnItem[] = [
		{
			name: '',
			sortOrder: null,
			sortFn: null,
			sortDirections: [null]
		},
		{
			name: 'Address',
			sortOrder: null,
			sortFn: (a: MarketReserve, b: MarketReserve) => a.name.localeCompare(b.name),
			sortDirections: ['descend', 'ascend', null]
		},
		{
			name: 'Health factor',
			sortOrder: null,
			sortFn: null,
			sortDirections: ['descend', 'ascend', null]
		},
		{
			name: 'Debt to cover',
			sortOrder: null,
			sortFn: (a: MarketReserve, b: MarketReserve) => compareBigNumberByKey(a, b, 'liquidityRate'),
			sortDirections: ['descend', 'ascend', null]
		},
		{
			name: 'Total collateral',
			sortOrder: null,
			sortFn: null,
			sortDirections: ['descend', 'ascend', null]
		},
		{
			name: 'Collateral composition',
			sortOrder: null,
			sortFn: null,
			sortDirections: ['descend', 'ascend', null]
		},
		{
			name: '',
			sortOrder: null,
			sortFn: null,
			sortDirections: [null]
		},
	];

	public assetsFilterOptions: string[] = [];

	public amountSlider: Slider = {
		min: 0,
		max: 100,
		current: 0
	};
	wallet: WalletBalance = {};
	private destroyed$ = new Subject();
	INFO: InfoModal = INFO_MODAL;

	constructor(private fb: FormBuilder,
				private reservesService: ReservesService,
				private accountService: AccountService,
				private liquidationService: LiquidationService) {
	}

	ngOnInit(): void {
		// forkJoin([
		// 	this.reservesService.getMarkets()
		// 		.pipe(
		// 			filter(list => !!list.length),
		// 			take(1),
		// 		),
		// 	this.liquidationService.getLiquidations()
		// ]).subscribe(([reserves, liquidations]) => {
		// 	this.setAssetPriceToLiquidation(reserves, liquidations);
		// 	this.liquidations = liquidations;
		// 	this.filteredLiquidations = liquidations;
		// 	this.calcAmountFilterMax();
		// 	this.liquidations.forEach(x => {
		// 		// x.user.reservesData.forEach(y => {
		// 		if (this.assetsFilterOptions.indexOf(x.reserve.symbol) === -1) {
		// 			this.assetsFilterOptions.push(x.reserve.symbol);
		// 		}
		// 		// });
		// 	});
		// 	this.initSearch();
		// });
		this.liquidationService.getLiquidations2().subscribe(list => {
				this.liquidations = list;
				this.filteredLiquidations = list;
				this.calcAmountFilterMax();
				this.liquidations.forEach(x => {
					// x.user.reservesData.forEach(y => {
					if (this.assetsFilterOptions.indexOf(x.principalReserve.symbol) === -1) {
						this.assetsFilterOptions.push(x.principalReserve.symbol);
					}
					// });
					this.initSearch()
				});
		});

		// this.liquidationService.getLiquidations2().subscribe((res) => {
		// 	debugger
		// 	console.log(res)
		// })

	}


	private calcAmountFilterMax(): void {
		this.amountSlider.max = this.liquidations.reduce((max, value) => {
			const debtToCover = +value.currentBorrowsUsd / 2;
			if (debtToCover > max) {
				max = debtToCover;
			}
			return max;
		}, 0);
	}

	private initSearch(): void {
		this.filters.valueChanges
			.pipe(
				debounceTime(300),
				takeUntil(this.destroyed$)
			)
			.subscribe((values: {
				addressSearch: string,
				assets: string[],
				amount: number;
			}) => {
				const formattedAddress = values.addressSearch.toLowerCase();
				this.filteredLiquidations = this.liquidations.filter(x => x.user.id.toLowerCase().includes(formattedAddress));
				if (values.assets.length) {
					this.filteredLiquidations = this.filteredLiquidations.filter(x => values.assets.indexOf(x.principalReserve.symbol) >= 0);
				}
				this.filteredLiquidations = this.filteredLiquidations.filter(x => {
					const debtToCover = +x.currentBorrowsUsd / 2;
					return debtToCover > values.amount;
				});
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}


}
