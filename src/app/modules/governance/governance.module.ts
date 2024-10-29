import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GovernanceComponent} from './components/governance/governance.component';
import {RouterModule, Routes} from '@angular/router';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';

const routes: Routes = [
    {
        path: '',
        component: GovernanceComponent,
    }
];


@NgModule({
    declarations: [GovernanceComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgZorroModule
    ]
})
export class GovernanceModule {
}
