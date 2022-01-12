import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservesService} from './services/reserves.service';
import {AccountService} from './services/account.service';
import {combineLatest, forkJoin, from, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MarketReserve} from './core/interfaces/market-reserves.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'evolution';
	private destroyed$ = new Subject();

	constructor(private reservesService: ReservesService,
				private accountService: AccountService) {
	}

	ngOnInit(): void {
		this.checkConnectedAccounts();

		combineLatest([
			this.reservesService.getMarkets(),
			this.accountService.getAccount()
		]).pipe(
			takeUntil(this.destroyed$)
		).subscribe(([list, account]: [MarketReserve[], string | null]) => {
			if (list.length && account) {
				this.accountService.updateAssetWallet(list);
			}
		});
	}


	private checkConnectedAccounts(): void {
		try {
			this.accountService.getWeb3Accounts()
				.then((accounts: string[]) => {
					let account = accounts[0];
					const disconnected = JSON.parse(localStorage.getItem('disconnected') as string);
					if (account && !disconnected) {
						account = account.toLowerCase();
						this.accountService.setAccount(account);
						this.reservesService.initMarketSocket(true);
						this.reservesService.initUserReserveSocket(account);
					} else {
						this.reservesService.initMarketSocket();
					}
				}).catch((error: any) => {

			});
		} catch (e) {
			this.reservesService.initMarketSocket(false);
			console.error('Metamask is not detected');
		}
	}


	ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

}
