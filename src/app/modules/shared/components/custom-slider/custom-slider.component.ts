import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {Slider} from '../../../../core/interfaces/utils';

@Component({
    selector: 'app-custom-slider',
    templateUrl: './custom-slider.component.html',
    styleUrls: ['./custom-slider.component.scss']
})
export class CustomSliderComponent implements OnInit, OnDestroy {

    @Input() data: Slider = {
        min: 0,
        max: 100,
        current: 0,
        title: 'Health factor'
    };
    @Output() sliderChanges = new EventEmitter<number>();

    sliderControl = new FormControl('');
    private destroyed$ = new Subject();

    constructor() {
    }

    ngOnInit(): void {
        this.sliderControl.patchValue(this.data.current);
        this.sliderControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(res => {
            this.sliderChanges.next(res);
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
