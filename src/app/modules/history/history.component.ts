import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';

import {TransactionDetailsModalComponent} from './components/transaction-details-modal/transaction-details-modal.component';
import {TransactionHistory} from '../../core/interfaces/transaction-history.interface';
import {AccountService} from '../../services/account.service';
import {HistoryService} from '../../services/history.service';
import {CalculationsUtil} from '../../core/util/util-calculations.class';
import {EMPTY_LIST, EmptyListBody} from '../../core/config/empty-list';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    public historyList: TransactionHistory[] = [];
    util = CalculationsUtil;
    emptyListConfig: EmptyListBody = EMPTY_LIST.HISTORY;

	constructor(
		private historyService: HistoryService,
		private accountService: AccountService,
		private modal: NzModalService,
	) {
	}

	ngOnInit(): void {

		this.accountService.getAccount()
			.subscribe(acc => {
				if (acc) {
					this.historyService.getTransactionHistory(acc, 50, 0).subscribe(list => {
						this.historyList = list.map(x => {
							if (x.amount) {
								const amount = this.util.getAsNumber(x.amount, x.reserve.decimals);
								x.totalInUsd = amount * +(x.reserve.priceInUsd);
							}
							return x;
						});
					});
				}
			});
	}

	public showDetailsModal(item: TransactionHistory): void {
		this.modal.create({
			nzContent: TransactionDetailsModalComponent,
			nzComponentParams: {
				transaction: item
			},
			nzCentered: true,
			nzFooter: null
		});
	}

}
