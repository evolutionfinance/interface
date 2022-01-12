import {Component, Input, OnInit} from '@angular/core';
import {CompositionPart} from '../../../../core/interfaces/composition-config.interface';

@Component({
  selector: 'app-composition-bar',
  templateUrl: './composition-bar.component.html',
  styleUrls: ['./composition-bar.component.scss']
})
export class CompositionBarComponent implements OnInit {

  @Input() config: CompositionPart[];

  constructor() { }

  ngOnInit(): void {
  }

}
