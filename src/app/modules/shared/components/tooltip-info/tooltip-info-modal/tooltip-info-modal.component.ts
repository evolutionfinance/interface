import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';

import {InfoModalBody} from '../../../../../core/config/info-modal';

@Component({
    selector: 'app-tooltip-info-modal',
    templateUrl: './tooltip-info-modal.component.html',
    styleUrls: ['./tooltip-info-modal.component.scss']
})
export class TooltipInfoModalComponent implements OnInit {

    @Input() data: InfoModalBody;

    constructor(public modal: NzModalRef) {
    }

    ngOnInit(): void {
    }

}
