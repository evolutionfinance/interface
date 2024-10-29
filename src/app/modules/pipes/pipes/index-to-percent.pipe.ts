import { Pipe, PipeTransform } from '@angular/core';
import Big from 'big.js';

@Pipe({
  name: 'indexToPercent'
})
export class IndexToPercentPipe implements PipeTransform {


  transform(value: any, decimalSizeFrom = 5, decimalSizeTo: number = 2): string {
    const divider = Math.pow(10, decimalSizeFrom);
    const num = Number(value);
    const res = (num / divider).toFixed(decimalSizeTo);
    return Big(res).minus(1).toString()
  }


}
