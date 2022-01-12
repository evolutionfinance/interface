import {Injectable} from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {MarketReserve} from '../interfaces/market-reserves.interface';
import {ReservesService} from '../../services/reserves.service';

@Injectable({
    providedIn: 'root'
})
export class ReserveResolver implements Resolve<MarketReserve> {

    constructor(private reservesService: ReservesService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<MarketReserve> {
        const address = route.paramMap.get('id') as string;
        return this.reservesService.getMarketByAddressOnce(address);
    }
}
