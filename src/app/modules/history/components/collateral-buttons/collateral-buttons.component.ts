import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-collateral-buttons',
  templateUrl: './collateral-buttons.component.html',
  styleUrls: ['./collateral-buttons.component.scss']
})
export class CollateralButtonsComponent implements OnInit {

  @Input() fromState: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
