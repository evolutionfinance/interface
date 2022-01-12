import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BorrowCoinsViewMode, MarketViewMode} from '../../../../core/enums/enums';
import {ReservesService} from '../../../../services/reserves.service';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table/src/table.types';
import {compareBigNumberByKey} from '../../../../core/util/util';
import Big from 'big.js';
import {filter, startWith, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {STABLE_COINS} from '../../../../core/constants/constans';
import {DepositedReserve, UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {BehaviorSubject, Subject} from 'rxjs';
import {AccountService} from '../../../../services/account.service';
import {UtilsService} from '../../../../services/utils.service';

interface BorrowedReserve extends MarketReserve {
    haveBorrow?: boolean;
}

interface ColumnItem {
    name: string;
    subName?: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn | null;
    sortDirections: NzTableSortOrder[];
    nzWidth: string | null;
}

@Component({
    selector: 'app-borrows-list',
    templateUrl: './borrows-list.component.html',
    styleUrls: ['./borrows-list.component.scss']
})
export class BorrowsListComponent implements OnInit, OnDestroy {
    searchControl = new FormControl();
    reserves: BorrowedReserve[] = [];
    filteredData: BorrowedReserve[] = [];
    viewModes = BorrowCoinsViewMode;
    activeViewMode: BorrowCoinsViewMode = BorrowCoinsViewMode.ALL;
    listOfColumns: ColumnItem[] = [
        {
            name: 'Asset',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null
        },
        {
            name: 'Available to borrow',
            subName: 'Based on you collateral',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null
        },
        {
            name: 'Borrow Rate',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => compareBigNumberByKey(a, b, 'variableBorrowRate'),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null,
            // subName: 'Variable'
        },
        {
            name: '',
            sortOrder: null,
            sortDirections: [null],
            sortFn: null,
            nzWidth: null,
        }
    ];
    userReserves: UserReserve[] = [];
    util = CalculationsUtil;
    availableToBorrow: number;
    private destroyed$ = new Subject();
    account$: BehaviorSubject<string>;

    constructor(private reservesService: ReservesService,
                private accountService: AccountService,
                private router: Router,
                private utilsService: UtilsService) {
    }

    ngOnInit(): void {
        this.utilsService.mobileHeaderTitle.next('Borrow');
        this.account$ = this.accountService.getAccount() as BehaviorSubject<string>;

        this.reservesService.getMarkets()
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe(list => {
                this.reserves = list;
                this.markExistingDeposits();
                this.initSearch();
            });

        this.reservesService.getUserReserves()
            .pipe(
                filter(list => !!list.length),
                takeUntil(this.destroyed$)
            )
            .subscribe((reserves: UserReserve[]) => {
                this.userReserves = reserves;
                this.markExistingDeposits();
                this.calculateAvailableToBorrow(this.userReserves);
            });
    }

    private markExistingDeposits(): void {
        if (this.reserves.length && this.userReserves.length) {
            this.reserves.forEach(x => {
                const deposit = this.userReserves.find(y => y.reserve.symbol === x.symbol);
                if (Number(deposit?.scaledVariableDebt) > 0) {
                    x.haveBorrow = true;
                }
            });
        }
    }

    get activeBorrows(): BorrowedReserve[] {
        return this.filteredData?.filter(x => x.haveBorrow);
    }

    get otherReserves(): BorrowedReserve[] {
        return this.filteredData?.filter(x => x.haveBorrow);
    }


    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private calculateAvailableToBorrow(userReserves: UserReserve[]): void {
        this.availableToBorrow = this.util.getAvailableToBorrowInUsd(userReserves);
    }

    private initSearch(): void {
        this.searchControl.valueChanges
            .pipe(
                startWith(''),
            )
            .subscribe(value => {
                this.filteredData = this.filterByViewMode().filter((x) => x.name.toLowerCase().includes(value.toLowerCase()));
            });
    }


    private filterByViewMode(): MarketReserve[] {
        return this.reserves.filter(x => {
            switch (this.activeViewMode) {
                case BorrowCoinsViewMode.ALL:
                    return true;
                case BorrowCoinsViewMode.STABLE:
                    return STABLE_COINS.indexOf(x.symbol) >= 0;
            }
        });
    }

    availableToBorrowMoreThanLiquidity(reserve: MarketReserve): boolean {
        const availableLiquidity = this.util.getAsNumber(reserve.availableLiquidity, reserve.decimals);
        return this.availableToBorrow > (availableLiquidity * Number(reserve.priceInUsd));
    }


    getAsMarketReserves(reserves: any): BorrowedReserve[] {
        return reserves as BorrowedReserve[];
    }


    changeViewMode(mode: BorrowCoinsViewMode): void {
        this.activeViewMode = mode;
        this.filteredData = this.filterByViewMode();
    }

    navigate(reserve: BorrowedReserve): void {
        this.router.navigate(['borrow', reserve.symbol, reserve.id]);
    }
}
