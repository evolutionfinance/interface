import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MarketsComponent} from './components/markets/markets.component';
import {RouterModule, Routes} from '@angular/router';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {PipesModule} from '../pipes/pipes.module';

const routes: Routes = [
    {
        path: '',
        component: MarketsComponent
    }
];

@NgModule({
    declarations: [MarketsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgZorroModule,
        PipesModule
    ]
})
export class MarketsModule {
}
