import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DepositsListComponent} from './components/deposits-list/deposits-list.component';
import {RouterModule, Routes} from '@angular/router';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {PipesModule} from '../pipes/pipes.module';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {DepositComponent} from './components/deposit/deposit.component';
import {ChartistModule} from 'ng-chartist';
import {DepositOverviewResolver} from '../../core/resolvers/deposit-overview.resolver';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import {ReserveResolver} from '../../core/resolvers/reserve.resolver';

const routes: Routes = [
    {
        path: ':symbol/:id',
        component: DepositComponent,
        resolve: {
            reserve: ReserveResolver
        }
    },
    {
        path: ':symbol/:id/withdraw',
        component: WithdrawComponent,
        resolve: {
            reserve: ReserveResolver
        }
    },
    {
        path: '',
        component: DepositsListComponent,
    }
];

@NgModule({
    declarations: [DepositsListComponent, DepositComponent, WithdrawComponent],
    imports: [
        CommonModule,
        NgZorroModule,
        PipesModule,
        RouterModule.forChild(routes),
        SharedModule,
        ChartistModule,
        ReactiveFormsModule
    ]
})
export class DepositModule {
}
