import {Component, Input, OnInit} from '@angular/core';
import {Web3Service} from '../../../../services/web3.service';
import {AccountService} from '../../../../services/account.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-wallet-not-connected',
	templateUrl: './wallet-not-connected.component.html',
	styleUrls: ['./wallet-not-connected.component.scss']
})
export class WalletNotConnectedComponent implements OnInit {
    @Input() subTitle: string = 'Connection to Wallet is available from the Desktop version of the platform';
    @Input() route: string;

    public mobileView: boolean;
    public breakpoint: number;

    constructor(private web3: Web3Service,
                private accountService: AccountService,
                private router: Router,
                ) {
    }

	ngOnInit(): void {
      this.mobileView = false;
      this.breakpoint = 850;
	}

  onResize(event: any): void {
    const width = event.target.innerWidth;
    this.mobileView = width <= this.breakpoint;
  }

  redirectToHome(): void {
    this.router.navigate(['/']);
  }

  connectWallet(): void {
    this.web3.connectWallet().then((accounts: string[]) => {
    	const address = accounts[0];
    	if (address) {
    		this.accountService.setAccount(address);
    	}
    });
  }
}
