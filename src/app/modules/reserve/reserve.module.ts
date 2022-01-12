import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReserveOverviewComponent} from './reserve-overview/reserve-overview.component';
import {RouterModule, Routes} from '@angular/router';
import {ChartistModule} from 'ng-chartist';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {PipesModule} from '../pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {ReserveResolver} from '../../core/resolvers/reserve.resolver';
import {SharedModule} from '../shared/shared.module';

const routes: Routes = [
    {
        path: ':symbol/:id',
        component: ReserveOverviewComponent,
        resolve: {
            reserve: ReserveResolver
        }
    }
];


@NgModule({
    declarations: [ReserveOverviewComponent],
	imports: [
		CommonModule,
		ChartistModule,
		PipesModule,
		NgZorroModule,
		RouterModule.forChild(routes),
		FormsModule,
		SharedModule
	]
})
export class ReserveModule {
}
