import {Injectable} from '@angular/core';
import Web3 from 'web3';
import {ReservesService} from './reserves.service';
// const Web3 = require('web3')
import {NzMessageService} from 'ng-zorro-antd/message';
import {ALLOWANCE_ABI, APPROVE_ABI, LENDING_POOL_ABI, V_TOKEN_ABI} from '../core/abi/abi';
import {environment} from '../../environments/environment';
import {AbiItem} from 'web3-utils';
import {Contract} from 'web3-eth-contract';

declare global {
	interface Window {
		ethereum: any;
		web3: Web3;
	}
}

@Injectable({
	providedIn: 'root'
})
export class Web3Service {
	private web3!: Web3;


	constructor(private reservesService: ReservesService,
				private message: NzMessageService) {
		if (window.web3?.currentProvider) {
			const web3Provider = window.web3.currentProvider;
			window.web3 = new Web3(web3Provider);
			this.web3 = window.web3;
		}

	}

	getNetworkType(): Promise<string> {
		return this.web3?.eth.net.getNetworkType();
	}

	isWeb3Connected(): boolean {
		return Boolean(this.web3);
	}

	connectWallet(): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			if (!window.ethereum) {
				this.message.create('error', 'Please install Metamask to proceed');
				throw Error('Metamask not found');
			}
			window.ethereum.send('eth_requestAccounts').then((res: any) => {
				const account = res.result[0];
				if (account) {
					// this
					localStorage.removeItem('disconnected');
					this.reservesService.initUserReserveSocket(account);
				}
				resolve(res.result);
			}).catch((error: any) => {
				reject(error);
			});
		});
	}

	getWeb3(): Web3 {
		return this.web3;
	}

	disconnectWallet(): void {
		// this.web3.eth.accounts.wallet.clear()
		// this.web3.currentProvider.
		// window.ethereum
	}

	createContract(abi: AbiItem[], address: string): Contract {
		const contract = new this.web3.eth.Contract(abi, address);
		return contract;
	}


	getAllowanceByAsset(account: string, asset: string, pool: string = environment.lendingPoolAddress): Promise<string> {
		const contract = new this.web3.eth.Contract(ALLOWANCE_ABI, asset);
		return contract.methods.allowance(
			account,
			pool
		).call();
	}

  getBorrowAllowanceByAsset(account: string, asset: string, pool: string = environment.lendingPoolAddress): Promise<string> {
    const contract = new this.web3.eth.Contract(V_TOKEN_ABI, asset);
    return contract.methods.borrowAllowance(
      account,
      pool
    ).call();
  }

	getAllowanceByAssetUniswap(account: string, asset: string): Promise<string> {
		const contract = new this.web3.eth.Contract(ALLOWANCE_ABI, asset);
		return contract.methods.allowance(
			account,
			environment.uniswapRepayAdapter
		).call();
	}

	getAllowanceByAssetUniswapSwap(account: string, asset: string): Promise<string> {
		const contract = new this.web3.eth.Contract(ALLOWANCE_ABI, asset);
		return contract.methods.allowance(
			account,
			environment.uniswapLiquiditySwapAdapter
		).call();
	}


}
