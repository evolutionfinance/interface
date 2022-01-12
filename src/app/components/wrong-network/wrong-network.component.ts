import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Web3Service} from '../../services/web3.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-wrong-network',
	templateUrl: './wrong-network.component.html',
	styleUrls: ['./wrong-network.component.scss']
})
export class WrongNetworkComponent implements OnInit {
	network: string = environment.network;

	constructor(private web3: Web3Service,
				private router: Router) {
	}

	ngOnInit(): void {
	}

	checkNetwork(): void {
		this.web3.getNetworkType().then((type) => {
			if (type === this.network) {
				this.router.navigate(['/markets']);
			}
		});
	}

}
