import {Component, Input, OnInit} from '@angular/core';
import {INFO_MODAL, InfoModal, InfoModalBody} from '../../../../core/config/info-modal';

@Component({
	selector: 'app-liquidation-overview-modal',
	templateUrl: './liquidation-overview-modal.component.html',
	styleUrls: ['./liquidation-overview-modal.component.scss']
})
export class LiquidationOverviewModalComponent implements OnInit {

	// @Input() data: InfoModalBody;
	INFO: InfoModal = INFO_MODAL;

	@Input() currentLTV: number;

	constructor() {
	}

	ngOnInit(): void {
	}

}
