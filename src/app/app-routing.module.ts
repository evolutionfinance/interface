import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppShellComponent} from './components/app-shell/app-shell.component';
import {PrivacyPolicyComponent} from './components/privacy-policy/privacy-policy.component';
import {TermsOfUseComponent} from './components/terms-of-use/terms-of-use.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {WrongNetworkComponent} from './components/wrong-network/wrong-network.component';

const routes: Routes = [
    {
        path: 'connect-wallet',
        loadChildren: () => import('./modules/connect-wallet/connect-wallet.module').then(m => m.ConnectWalletModule)
    },
    {
        path: 'wrong-network',
        component: WrongNetworkComponent,
    },
    {
        path: '404',
        component: PageNotFoundComponent,
    },
    {
        path: '',
        component: AppShellComponent,
        children: [
            {
                path: 'markets',
                loadChildren: () => import('./modules/markets/markets.module').then(m => m.MarketsModule)
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'deposit',
                loadChildren: () => import('./modules/deposit/deposit.module').then(m => m.DepositModule)
            },
            {
                path: 'borrow',
                loadChildren: () => import('./modules/borrow/borrow.module').then(m => m.BorrowModule)
            },
            {
                path: 'swap',
                loadChildren: () => import('./modules/swap/swap.module').then(m => m.SwapModule)
            },
            {
                path: 'ren-project',
                loadChildren: () => import('./modules/ren/ren.module').then(m => m.RenModule)
            },
            {
                path: 'history',
                loadChildren: () => import('./modules/history/history.module').then(m => m.HistoryModule)
            },
            {
                path: 'liquidation',
                loadChildren: () => import('./modules/liquidation/liquidation.module').then(m => m.LiquidationModule)
            },
            // {
            //     path: 'governance',
            //     loadChildren: () => import('./modules/governance/governance.module').then(m => m.GovernanceModule)
            // },
            {
                path: 'reserve',
                loadChildren: () => import('./modules/reserve/reserve.module').then(m => m.ReserveModule)
            },
            {
                path: 'privacy-policy',
                component: PrivacyPolicyComponent,
            },
            {
                path: 'terms-of-use',
                component: TermsOfUseComponent
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/markets'
            },
            {
                path: '**',
                redirectTo: '/404'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
