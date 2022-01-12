import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BorrowsListComponent} from './components/borrows-list/borrows-list.component';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {PipesModule} from '../pipes/pipes.module';
import {BorrowComponent} from './components/borrow/borrow.component';
import {ChartistModule} from 'ng-chartist';
import {DepositOverviewResolver} from '../../core/resolvers/deposit-overview.resolver';
import {SharedModule} from '../shared/shared.module';
import {ReserveResolver} from '../../core/resolvers/reserve.resolver';
import {RepayComponent} from './components/repay/repay.component';
import {RepayFromWalletComponent} from './components/repay-from-wallet/repay-from-wallet.component';
import {RepayFromCollateralComponent} from './components/repay-from-collateral/repay-from-collateral.component';
import {RepayChooseComponent} from './components/repay-choose/repay-choose.component';

const routes: Routes = [
	{
		path: ':symbol/:id',
		component: BorrowComponent,
		resolve: {
			reserve: ReserveResolver
		}
	},
	{
		path: ':symbol/:id/repay',
		component: RepayComponent,
		resolve: {
			reserve: ReserveResolver
		},
		children: [
			{
				path: 'choose',
				component: RepayChooseComponent
			},
			{
				path: 'wallet',
				component: RepayFromWalletComponent
			},
			{
				path: 'collateral',
				component: RepayFromCollateralComponent,
			},
			{
				path: '**',
				redirectTo: 'choose'
			}
		]
	},
	{
		path: '',
		component: BorrowsListComponent
	}
];


@NgModule({
	declarations: [
		BorrowsListComponent,
		BorrowComponent,
		RepayComponent,
		RepayChooseComponent,
		RepayFromWalletComponent,
		RepayFromCollateralComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NgZorroModule,
		PipesModule,
		RouterModule.forChild(routes),
		ChartistModule,
		SharedModule
	]
})
export class BorrowModule {
}
