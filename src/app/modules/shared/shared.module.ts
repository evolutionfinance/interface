import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WalletNotConnectedComponent} from './components/wallet-not-connected/wallet-not-connected.component';
import {TransactionComponent} from './components/transaction-block/transaction.component';
import {RouterModule} from '@angular/router';
import {MaxAmountDirective} from './directives/max-amount.directive';
import {CompositionBarComponent} from './components/composition-bar/composition-bar.component';
import {TooltipInfoComponent} from './components/tooltip-info/tooltip-info.component';
import {TooltipInfoModalComponent} from './components/tooltip-info/tooltip-info-modal/tooltip-info-modal.component';
import {EmptyListComponent} from './components/empty-list/empty-list.component';
import { CustomSliderComponent } from './components/custom-slider/custom-slider.component';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
	declarations: [
	    WalletNotConnectedComponent,
        TransactionComponent,
        MaxAmountDirective,
        CompositionBarComponent,
        TooltipInfoComponent,
        TooltipInfoModalComponent,
        EmptyListComponent,
        CustomSliderComponent],
	imports: [
		CommonModule,
		RouterModule,
		NgZorroModule,
		ReactiveFormsModule
	],
	exports: [
		WalletNotConnectedComponent,
		TransactionComponent,
		MaxAmountDirective,
		CompositionBarComponent,
		TooltipInfoComponent,
		EmptyListComponent,
		CustomSliderComponent,
	]
})
export class SharedModule {
}
