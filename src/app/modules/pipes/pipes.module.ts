import { NgModule } from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {BigNumPipe} from './pipes/big-num.pipe';
import {FormatNumberPipe} from './pipes/format-number.pipe';
import { IndexToPercentPipe } from './pipes/index-to-percent.pipe';



@NgModule({
  declarations: [
    BigNumPipe,
    FormatNumberPipe,
    IndexToPercentPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BigNumPipe,
    FormatNumberPipe,
    IndexToPercentPipe
  ],
  providers: [
    DecimalPipe
  ]
})
export class PipesModule { }
