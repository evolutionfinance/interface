import {Component, Input, OnInit} from '@angular/core';

import {TransactionHistory} from '../../../../core/interfaces/transaction-history.interface';

@Component({
  selector: 'app-transaction-details-modal',
  templateUrl: './transaction-details-modal.component.html',
  styleUrls: ['./transaction-details-modal.component.scss']
})
export class TransactionDetailsModalComponent implements OnInit {
  transactionHash: string;

  @Input() transaction: TransactionHistory;

  constructor() { }

  ngOnInit(): void {
    this.transactionHash = this.transaction.id.substr(0, this.transaction.id.length - 2)
  }

}
