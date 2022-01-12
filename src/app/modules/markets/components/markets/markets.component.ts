import {Component, OnInit} from '@angular/core';
import {Apollo, gql, QueryRef, SubscriptionResult} from 'apollo-angular';
import {MarketReserve, MarketReservesResponse} from '../../../../core/interfaces/market-reserves.interface';
import {NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table/src/table.types';
import Big from 'big.js';
import {ReservesService} from '../../../../services/reserves.service';
import {compareBigNumberByKey, getBigNumbersSum} from '../../../../core/util/util';
import {GET_RESERVE_RATES_30_DAYS_AGO, GET_RESERVES_RATE_HISTORY} from '../../../../core/graphQL/queries';
import {Router} from '@angular/router';
import {MarketViewMode} from '../../../../core/enums/enums';
import {CalculationsUtil} from '../../../../core/util/util-calculations.class';
import {ReserveParamsHistoryItemsResponse} from '../../../../core/interfaces/reserve-history.interface';
import {environment} from '../../../../../environments/environment';
import {UtilsService} from '../../../../services/utils.service';
import {shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';


interface ColumnItem {
    name: string;
    subName?: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn | null;
    sortDirections: NzTableSortOrder[];
    nzWidth: string | null;
}

@Component({
    selector: 'app-markets',
    templateUrl: './markets.component.html',
    styleUrls: ['./markets.component.scss']
})
export class MarketsComponent implements OnInit {
    viewModes = MarketViewMode;
    activeViewMode: MarketViewMode = MarketViewMode.NATIVE;
    data: MarketReserve[] = [];
    marketSize: any;
    listOfColumns: ColumnItem[] = [
        {
            name: 'Asset',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => a.name.localeCompare(b.name),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null
        },
        // {
        //     name: 'Market size',
        //     sortOrder: null,
        //     sortFn: (a: MarketReserve, b: MarketReserve) => compareBigNumberByKey(a, b, 'totalLiquidity'),
        //     sortDirections: ['descend', 'ascend', null],
        //     nzWidth: null,
        // },
        {
            name: 'Total Borrowed',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => {
                const sumA = this.util.getBigSum(a.totalScaledVariableDebt, a.totalPrincipalStableDebt);
                const sumB = this.util.getBigSum(b.totalScaledVariableDebt, b.totalPrincipalStableDebt);
                if (Big(sumA).gt(Big(sumB))) {
                    return 1;
                } else {
                    return -1;
                }
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
            name: 'Borrow Rate',
            sortOrder: null,
            sortFn: (a: MarketReserve, b: MarketReserve) => compareBigNumberByKey(a, b, 'variableBorrowRate'),
            sortDirections: ['descend', 'ascend', null],
            nzWidth: null,
            // subName: 'Variable'
        },
    ];
    util = CalculationsUtil;
    isDarkTheme$: Observable<any>;

    constructor(private reservesService: ReservesService,
                private apollo: Apollo,
                private router: Router,
                private utilsService: UtilsService) {
    }

    ngOnInit(): void {
        this.isDarkTheme$ = this.utilsService.isDarkTheme$.pipe(
            shareReplay()
        );
        console.log(this.isDarkTheme$);
        
        this.utilsService.mobileHeaderTitle.next('Markets');
        this.apollo.query<ReserveParamsHistoryItemsResponse>({
            query: gql`{
                  reserves(pool: $pool) {
                    id,
                  }
                }`,
            variables: {
                pool: environment.pool
            }
        }).subscribe()
        this.reservesService.getMarkets().subscribe(list => {
            this.data = list;
            this.marketSize = list.reduce((acc, value) => {
                const marketSize = this.util.getAsNumber(value.totalLiquidity, value.decimals);
                return acc += Number(value.priceInUsd) * marketSize;
            }, 0);
        });
    }

    getAsMarketReserves(reserves: any): MarketReserve[] {
        return reserves as MarketReserve[];
    }

    navigate(r: MarketReserve): void {
        this.router.navigate(['/reserve', r.symbol, r.id]);
    }

    changeViewMode(mode: MarketViewMode): void {
        this.activeViewMode = mode;
    }

}


