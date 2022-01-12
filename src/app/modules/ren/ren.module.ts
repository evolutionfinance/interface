import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';

import {RenComponent} from './ren.component';
import {SharedModule} from '../shared/shared.module';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';

const routes: Routes = [
    {
        path: '',
        component: RenComponent
    }
];

@NgModule({
    declarations: [RenComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        NgZorroModule,
        ReactiveFormsModule,
        FormsModule,
        ClipboardModule
    ]
})
export class RenModule {
}
