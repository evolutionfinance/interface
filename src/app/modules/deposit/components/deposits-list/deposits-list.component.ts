import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../../../services/web3.service';
import {ReservesService} from '../../../../services/reserves.service';
import {MarketReserve} from '../../../../core/interfaces/market-reserves.interface';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table/src/table.types';
import {compareBigNumber, compareBigNumberByKey} from '../../../../core/util/util';
import Big from 'big.js';
import {FormControl} from '@angular/forms';
import {filter, startWith, takeUntil, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AccountService} from '../../../../services/account.service';
import {Router} from '@angular/router';
import {BorrowCoinsViewMode} from '../../../../core/enums/enums';
import {STABLE_COINS} from '../../../../core/constants/constans';
import {UtilsService} from '../../../../services/utils.service';

interface DepositedReserve extends MarketReserve {
    haveDeposit?: boolean;
}

interface ColumnItem {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn | null;
    sortDirections: NzTableSortOrder[];
    nzWidth: string | null;
}

@Component({
    selector: 'app-deposit',
    templateUrl: './deposits-list.component.html',
    styleUrls: ['./deposits-list.component.scss']
})
export class DepositsListComponent implements OnInit, OnDestroy {
    viewModes = BorrowCoinsViewMode;
    activeViewMode: BorrowCoinsViewMode = BorrowCoinsViewMode.ALL;
    searchControl = new FormControl();
    reserves: DepositedReserve[] = [];
    filteredData: DepositedReserve[] = [];
    userWallet: WalletBalance;
    userReserves: UserReserve[] = [];
    listOfColumns: ColumnItem[] = [
        {
            name: 'Assets',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null
        },
        {
            name: 'Your Wallet Balance',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => {
                const aBalance = this.getWalletBalanceByAsset(a.symbol);
                const bBalance = this.getWalletBalanceByAsset(b.symbol);
                return compareBigNumber(aBalance, bBalance);
            },
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null,
        },
        {
            name: 'Deposit Rate',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => compareBigNumberByKey(a, b, 'liquidityRate'),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null,
        },
        {
            name: '',
            sortOrder: null,
            sortDirections: [null],
            sortFn: null,
            nzWidth: null,
        }
    ];
    account$: Observable<string | null>;
    private destroyed$ = new Subject<boolean>();

    constructor(private cd: ChangeDetectorRef,
                private accountService: AccountService,
                private router: Router,
                private reservesService: ReservesService,
                private utilsService: UtilsService) {
    }

    ngOnInit(): void {
        this.utilsService.mobileHeaderTitle.next('Deposit');
        this.account$ = this.accountService.getAccount()
            .pipe(
                tap(x => this.cd.detectChanges())
            );

        this.accountService.getAccountBalance()
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe((balance) => {
                this.userWallet = balance;
            });

        this.reservesService.getMarkets()
            .pipe(
                filter(list => !!list.length),
                takeUntil(this.destroyed$)
            )
            .subscribe(list => {
                this.reserves = list as DepositedReserve[];
                this.markExistingDeposits();
                this.initSearch();
            });

        this.reservesService.getUserReserves().subscribe(list => {
            this.userReserves = list;
            this.markExistingDeposits();

        });
    }

    get activeDeposits(): DepositedReserve[] {
        return this.filteredData?.filter(x => x.haveDeposit);
    }

    get otherReserves(): DepositedReserve[] {
        return this.filteredData?.filter(x => x.haveDeposit);
    }

    private markExistingDeposits(): void {
        if (this.reserves.length && this.userReserves.length) {
            this.reserves.forEach(x => {
                const deposit = this.userReserves.find(y => y.reserve.symbol === x.symbol);
                if (Number(deposit?.scaledATokenBalance) > 0) {
                    x.haveDeposit = true;
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private initSearch(): void {
        this.searchControl.valueChanges
            .pipe(
                startWith('')
            )
            .subscribe(value => {
                this.filteredData = this.reserves.filter((x) => x.name.toLowerCase().includes(value.toLowerCase()));
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

    getWalletBalanceByAsset(key: string): string | null {
        let value = '0';
        if (this.userWallet?.hasOwnProperty(key)) {
            value = this.userWallet[key];
        }
        return value;
    }

    navigate(reserve: MarketReserve): void {
        this.router.navigate(['deposit', reserve.symbol, reserve.id]);
    }

    changeViewMode(mode: BorrowCoinsViewMode): void {
        this.activeViewMode = mode;
        this.filteredData = this.filterByViewMode();
    }
}
