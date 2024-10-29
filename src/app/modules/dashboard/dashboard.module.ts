import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {SharedModule} from '../shared/shared.module';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {DashboardComponent} from './dashboard.component';
import {DashboardDepositsComponent} from './components/dashboard-deposits/dashboard-deposits.component';
import {DashboardBorrowingsComponent} from './components/dashboard-borrowings/dashboard-borrowings.component';
import {PipesModule} from '../pipes/pipes.module';
import { CollateralSwitchComponent } from './components/collateral-switch/collateral-switch.component';
import {ReserveResolver} from '../../core/resolvers/reserve.resolver';
import { LiquidationOverviewModalComponent } from './components/liquidation-overview-modal/liquidation-overview-modal.component';

const routes: Routes = [
    {
        path: ':symbol/:id/collateral',
        component: CollateralSwitchComponent,
        resolve: {
            reserve: ReserveResolver
        }
    },
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'deposits',
                component: DashboardDepositsComponent
            },
            {
                path: 'borrowings',
                component: DashboardBorrowingsComponent
            },
            {
                path: '',
                redirectTo: 'deposits'
            }
        ]
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardDepositsComponent,
        DashboardBorrowingsComponent,
        CollateralSwitchComponent,
        LiquidationOverviewModalComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        NgZorroModule,
        PipesModule,
        FormsModule
    ]
})
export class DashboardModule {
}
