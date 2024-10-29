import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../../../services/web3.service';
import Web3 from 'web3';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ReservesService} from '../../../../services/reserves.service';
const Big = require('big.js');

declare global {
    interface Window {
        ethereum: any;
        web3: Web3;
    }
}


@Component({
    selector: 'app-connect-wallet',
    templateUrl: './connect-wallet.component.html',
    styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit {
    balance: string;

    constructor(private web3: Web3Service,
                private reservesService: ReservesService,
                private message: NzMessageService,
                private router: Router) {
    }

    ngOnInit(): void {

    }

    connect(): void {
        this.web3.connectWallet().then((walletsArray: string[]) => {
            this.router.navigateByUrl('/markets');
        }).catch(() => {
            this.message.create('error', 'Error during connection to MetaMask')
        });

    }


}
