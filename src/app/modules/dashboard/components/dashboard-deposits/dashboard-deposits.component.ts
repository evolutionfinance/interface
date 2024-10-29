import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil, map} from 'rxjs/operators';
import {NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table/src/table.types';
import {compareBigNumber, compareBigNumberByKey} from '../../../../core/util/util';
import {UserReserve} from '../../../../core/interfaces/user-reserves-response.interface';
import {WalletBalance} from '../../../../core/interfaces/wallet-balance.interface';
import {ReservesService} from '../../../../services/reserves.service';
import {AccountService} from '../../../../services/account.service';
import Big from 'big.js';
import {Router} from '@angular/router';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {CompositionPart} from '../../../../core/interfaces/composition-config.interface';
import {CompositionsService} from '../../../../services/compositions.service';
import {INFO_MODAL, InfoModal} from '../../../../core/config/info-modal';

interface ColumnItem {
    name: string;
    subName?: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn | any;
    sortDirections: NzTableSortOrder[];
    nzWidth: string | null;
}

@Component({
    selector: 'app-deposits',
    templateUrl: './dashboard-deposits.component.html',
    styleUrls: ['./dashboard-deposits.component.scss']
})
export class DashboardDepositsComponent implements OnInit, OnDestroy {
    data: UserReserve[];
    listOfColumns: ColumnItem[] = [
        {
            name: 'Your deposits',
            sortOrder: null,
            sortFn: (a: UserReserve, b: UserReserve) => a.reserve.name.localeCompare(b.reserve.name),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: '300px'
        },
        {
            name: 'Current balance',
            sortOrder: null,
            sortFn: (a: UserReserve, b: UserReserve) => {
                return compareBigNumber(a.scaledATokenBalance, b.scaledATokenBalance);
            },
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null,
        },
        {
            name: 'Deposit Rate',
            sortOrder: null,
            sortFn: (a: UserReserve, b: UserReserve) => compareBigNumberByKey(a.reserve, b.reserve, 'liquidityRate'),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null
        },
        {
            name: 'Collateral',
            sortOrder: null,
            sortFn: (a: UserReserve, b: UserReserve) => +a.usageAsCollateralEnabledOnUser - +b.usageAsCollateralEnabledOnUser,
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null
        },
        {
            name: '',
            sortOrder: null,
            sortFn: false,
            sortDirections: [null],
            nzWidth: null
        },
    ];
    approximateBalance: number = 0;
    private userWallet: WalletBalance;
    private destroyed$ = new Subject();
    private util = CalculationsUtil;
    compositionConfig: CompositionPart[] = [];
    INFO: InfoModal = INFO_MODAL;

    constructor(
        private reservesService: ReservesService,
        private compositionsService: CompositionsService,
        private accountService: AccountService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.getUserReserves();

        this.accountService.getAccountBalance()
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe((balance: WalletBalance) => {
                this.userWallet = balance;
            });
    }

    getAsUserReserves(reserves: any): UserReserve[] {
        return reserves as UserReserve[];
    }

    private getUserReserves(): void {
        this.reservesService.getUserReserves()
            .pipe(
                map((list: UserReserve[]) => list.filter(item => {
                    const divider = Math.pow(10, item.reserve.decimals);
                    if(item.reserve.symbol !== 'ETH') {
                        const formattedBalance = Big(item.currentATokenBalance).mul(divider).round().toNumber();
                        return formattedBalance > 100000000;
                    } else {
                        return +item.currentATokenBalance > 100000000;
                    }
                })),
                takeUntil(this.destroyed$)
            )
            .subscribe(list => {
                this.data = list;
                this.approximateBalance = list.reduce((total, x) => {
                    const price = x.reserve.priceInUsd;
                    const tokens = this.util.getAsNumber(x.scaledATokenBalance, x.reserve.decimals);
                    total += +price * tokens;
                    return total;
                }, 0);
                this.compositionConfig = this.compositionsService.buildDepositComposition(list, this.approximateBalance)
            });
    }

    changeDepositCollateral(userReserve: UserReserve): void {
        userReserve.usageAsCollateralEnabledOnUser = !userReserve.usageAsCollateralEnabledOnUser;
        this.router.navigate(['dashboard', userReserve.reserve.symbol, userReserve.reserve.id, 'collateral']);
    }


    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    navigateToDeposit(item: UserReserve): void {
        this.router.navigate(['deposit', item.reserve.symbol, item.reserve.id]);
    }

    navigateToWithdraw(item: UserReserve): void {
        this.router.navigate(['deposit', item.reserve.symbol, item.reserve.id, 'withdraw']);
    }
}
