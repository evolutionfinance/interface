import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bigNum'
})
export class BigNumPipe implements PipeTransform {

    transform(value: any, decimalSizeFrom = 18, decimalSizeTo: number = 2): string {
        const divider = Math.pow(10, decimalSizeFrom);
        const num = Number(value);
        return (num / divider).toFixed(decimalSizeTo);
    }

}
