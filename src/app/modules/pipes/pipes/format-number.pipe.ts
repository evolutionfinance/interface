import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({
    name: 'fNumber'
})
export class FormatNumberPipe implements PipeTransform {

    constructor(private decimalPipe: DecimalPipe) {
    }

    transform(value: string | number | any): string {
        const num = Number(value);
        let formattedValue = num;
        let abbr = '';
        if (num > 1000000000000) {
            formattedValue = (num / 1000000000000);
            abbr = 'T';
        } else if (num > 1000000000) {
            formattedValue = (num / 1000000000);
            abbr = 'B';
        } else if (num > 1000000) {
            formattedValue = (num / 1000000);
            abbr = 'M';
        } else if (num > 1000) {
            formattedValue = (num / 1000);
            abbr = 'K';
        }
        // formattedValue.split('.')[0]
        // return  formattedValue
        return `${this.decimalPipe.transform(formattedValue, '1.1-2')} ${abbr}`;
    }

}
