import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {LiquidationsListComponent} from './components/liquidations-list/liquidations-list.component';
import {PipesModule} from '../pipes/pipes.module';
import {SharedModule} from '../shared/shared.module';
import { LiquidationItemComponent } from './components/liquidation-item/liquidation-item.component';
import { LiquidationConfirmationComponent } from './components/liquidation-confirmation/liquidation-confirmation.component';

const routes: Routes = [
    {
        path: '',
        component: LiquidationsListComponent
    },
    {
        path: 'confirm',
        component: LiquidationConfirmationComponent
    }
];

@NgModule({
    declarations: [LiquidationsListComponent, LiquidationItemComponent, LiquidationConfirmationComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgZorroModule,
        ReactiveFormsModule,
        PipesModule,
        FormsModule,
        SharedModule
    ]
})
export class LiquidationModule {
}
