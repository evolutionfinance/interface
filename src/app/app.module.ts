import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import {NgZorroModule} from './modules/ng-zorro/ng-zorro.module';
import { GraphQLModule } from './graphql.module';
import {SharedModule} from './modules/shared/shared.module';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component';
import { MaxAmountDirective } from './modules/shared/directives/max-amount.directive';
import {BigNumPipe} from './modules/pipes/pipes/big-num.pipe';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { WrongNetworkComponent } from './components/wrong-network/wrong-network.component';

registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent,
        AppShellComponent,
        PrivacyPolicyComponent,
        TermsOfUseComponent,
        PageNotFoundComponent,
        WrongNetworkComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgZorroModule,
        SharedModule,
        GraphQLModule,

    ],
    providers: [{provide: NZ_I18N, useValue: en_US}, BigNumPipe],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
