import {Injectable} from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import {combineLatest, forkJoin, Observable, of} from 'rxjs';
import {ReservesService} from '../../services/reserves.service';
import {AccountService} from '../../services/account.service';
import {MarketReserve} from '../interfaces/market-reserves.interface';

@Injectable({
    providedIn: 'root'
})
export class DepositOverviewResolver implements Resolve<[MarketReserve, string]> {

    constructor(private reservesService: ReservesService,
                private accountService: AccountService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[MarketReserve, string]> {
        const id = route.paramMap.get('id') as string;
        const symbol = route.paramMap.get('symbol') as string;

        return  forkJoin([
            this.reservesService.getReserveByIdOnce(id),
            this.accountService.getWalletBalanceBySymbolOnce(symbol)
        ]);
    }
}
