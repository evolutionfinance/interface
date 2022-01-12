import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwapComponent} from './components/swap/swap.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../pipes/pipes.module';


const routes: Routes = [
	{
		path: '',
		component: SwapComponent
	}
];

@NgModule({
	declarations: [SwapComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        NgZorroModule,
        ReactiveFormsModule,
        FormsModule,
        PipesModule
    ]
})
export class SwapModule {
}
