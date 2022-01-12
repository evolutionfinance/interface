import {Component, Input, OnInit} from '@angular/core';

import {EmptyListBody} from '../../../../core/config/empty-list';

@Component({
    selector: 'app-empty-list',
    templateUrl: './empty-list.component.html',
    styleUrls: ['./empty-list.component.scss']
})
export class EmptyListComponent implements OnInit {

    @Input() config: EmptyListBody = {
        title: 'No deposits yet',
        content: 'There will be a list of all the assets you deposited and you are earning on. For now it’s empty until you start to deposit.',
        mainButton: {title: 'Deposit now', route: '/deposit'},
        secondButton: {title: 'Go back', route: '/markets'}
    };

    constructor() {
    }

    ngOnInit(): void {
    }

}
