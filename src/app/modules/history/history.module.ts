import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {HistoryComponent} from './history.component';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {TransactionDetailsModalComponent} from './components/transaction-details-modal/transaction-details-modal.component';
import {CollateralButtonsComponent} from './components/collateral-buttons/collateral-buttons.component';
import {PipesModule} from '../pipes/pipes.module';
import {SharedModule} from '../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: HistoryComponent
    }
];

@NgModule({
    declarations: [HistoryComponent, TransactionDetailsModalComponent, CollateralButtonsComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgZorroModule,
		PipesModule,
		SharedModule
	]
})
export class HistoryModule {
}
