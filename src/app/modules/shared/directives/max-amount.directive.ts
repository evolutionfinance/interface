import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {CalculationsUtil} from '../../../core/util/util-calculations.class';
import {AbstractControl, Form, FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

@Directive({
    selector: '[maxAmount]'
})
export class MaxAmountDirective implements OnInit, OnDestroy {
    util = CalculationsUtil;
    sub: Subscription;

    @Input() maxAvailable: any = 0 ;
    @Input() decimals: number | any;
    @Input() control: FormControl | AbstractControl | null;


    constructor() {
    }

    ngOnInit(): void {
        this.sub = (this.control as FormControl).valueChanges.subscribe((v: number) => {
            if (this.maxAvailable && !isNaN(Number(v) )) {
                const newValue = v;
                const max = this.util.getAsNumber(this.maxAvailable, this.decimals);
                if (newValue > max) {
                    (this.control as FormControl).patchValue(max.toString(), {emitEvent: false});
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }


}
