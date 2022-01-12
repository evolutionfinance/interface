import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';

import {TooltipInfoModalComponent} from './tooltip-info-modal/tooltip-info-modal.component';
import {InfoModalBody} from '../../../../core/config/info-modal';

@Component({
    selector: 'app-tooltip-info',
    templateUrl: './tooltip-info.component.html',
    styleUrls: ['./tooltip-info.component.scss']
})
export class TooltipInfoComponent implements OnInit {

    @Input() data: InfoModalBody;

    constructor(private modal: NzModalService) {
    }

    ngOnInit(): void {
    }

    openModal(event: any): void {
        event.stopPropagation();

        this.modal.create({
            nzContent: TooltipInfoModalComponent,
            nzComponentParams: {
                data: this.data
            },
            nzClosable: false,
            nzCentered: true,
            nzFooter: null
        });
    }

}
