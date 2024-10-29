import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectWalletComponent} from './components/connect-wallet/connect-wallet.component';
import {RouterModule, Routes} from '@angular/router';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {BigNumPipe} from '../pipes/pipes/big-num.pipe';


const routes: Routes = [
    {
        path: '',
        component: ConnectWalletComponent
    }
];


@NgModule({
    declarations: [ConnectWalletComponent],
    exports: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgZorroModule
    ]
})
export class ConnectWalletModule {
}
