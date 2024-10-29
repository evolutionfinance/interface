import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {WalletBalance} from '../core/interfaces/wallet-balance.interface';
import Web3 from 'web3';
import {MarketReserve} from '../core/interfaces/market-reserves.interface';
import {minABI, WETH_GATEWAY_ABI} from '../core/abi/abi';
import {filter, map, take} from 'rxjs/operators';
import {ReservesService} from './reserves.service';
import {environment} from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AccountService {
	private web3: Web3;
	private account$: BehaviorSubject<string | null>;
	private accountBalance$: BehaviorSubject<WalletBalance>;

	constructor(private reservesService: ReservesService) {
		if (window.web3?.currentProvider) {
			const web3Provider = window.web3.currentProvider;
			window.web3 = new Web3(web3Provider);
			this.web3 = window.web3;
			this.listenAccountChange();
		}
	}


	private listenAccountChange(): void {
		window.ethereum.on('accountsChanged', (accounts: string[]) => {
			const account = accounts[0];
			if (account) {
				this.reservesService.initUserReserveSocket(account);
				this.setAccount(account);
			} else {
				this.setAccount(null);
			}
			this.setAccount(account);
		});
		window.ethereum.on('disconnect', () => {
			window.location.reload();
		});
	}

	getWeb3Accounts(): Promise<string[]> {
		return this.web3?.eth.getAccounts();

	}


	setAccount(address: string | null): void {
		if (!this.account$) {
			this.account$ = new BehaviorSubject<string | null>(address);
		} else {
			this.account$.next(address);
		}
	}

	getAccount(): BehaviorSubject<string | null> {
		if (!this.account$) {
			this.account$ = new BehaviorSubject<string | null>(null);
		}
		return this.account$;
	}

	getEthBalance(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.web3.eth.getCoinbase((err, account) => {
				this.web3.eth.getBalance(account, (err, balance) => {
					resolve(balance);
				});
			});
		});
	}

	disconnect(): void {
		this.setAccount(null);
		localStorage.setItem('disconnected', JSON.stringify(true));
	}

	updateAssetWallet(reserves: MarketReserve[]): void {
		const account = this.account$.getValue();
		const balances = reserves.map(x => {
			const tokenInst = new this.web3.eth.Contract(minABI as any, x.underlyingAsset);
			return tokenInst.methods.balanceOf(account)
				.call();
		});
		const wethTokenInst = new this.web3.eth.Contract(minABI as any, environment.WethAddress);
		balances.push(wethTokenInst.methods.balanceOf(account).call());
		Promise.all(balances).then((data: string[]) => {
			const bal: WalletBalance = {};
			data.forEach((x, index) => {
				if (index < reserves.length) {
					bal[reserves[index].symbol] = x;
				} else {
					bal['WETH'] = x;
				}

			});

			this.getEthBalance().then((balance: string) => {
				bal.ETH = balance;
				this.setAccountBalance(bal);
			});
		});

	}

	setAccountBalance(balance: WalletBalance): void {
		if (!this.accountBalance$) {
			this.accountBalance$ = new BehaviorSubject<WalletBalance>(balance);
		} else {
			this.accountBalance$.next(balance);
		}

	}

	getWalletBalanceBySymbolOnce(symbol: string): Observable<string> {
		return this.getAccountBalance()
			.pipe(
				filter(wallet => {
					return !!Object.keys(wallet).length;
				}),
				map(wallet => wallet[symbol]),
				take(1)
			);
	}


	getAccountBalance(): BehaviorSubject<WalletBalance> {
		if (!this.accountBalance$) {
			this.accountBalance$ = new BehaviorSubject<WalletBalance>({});
		}
		return this.accountBalance$;
	}
}
