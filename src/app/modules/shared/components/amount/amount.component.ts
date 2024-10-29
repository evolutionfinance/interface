import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-amount',
    templateUrl: './amount.component.html',
    styleUrls: ['./amount.component.scss']
})
export class AmountComponent implements OnInit {

    @Input() public coinName: string;
    @Input() public coinValue?: string;
    @Input() public usd?: string;
    @Input() public iconLink?: string = 'assets/icons/litecoin.svg';

    constructor() {
    }

    ngOnInit(): void {
    }

}
