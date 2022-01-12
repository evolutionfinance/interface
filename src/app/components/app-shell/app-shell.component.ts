import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Web3Service} from '../../services/web3.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {ReservesService} from '../../services/reserves.service';
import {AccountService} from '../../services/account.service';
import {filter, map, shareReplay, tap} from 'rxjs/operators';
import {UtilsService} from '../../services/utils.service';
import {THEMES} from '../../core/config/themes';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Component({
    selector: 'app-app-shell',
    templateUrl: './app-shell.component.html',
    styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements OnInit {
    account$: Observable<string | null>;
    isSidebarSmall: boolean = false;
    isDark: boolean = true;
    isDarkTheme$: Observable<boolean>;
    allThemes: any = THEMES;
    isMobileSidebarOpen: boolean = false;
    mobileTitle$: BehaviorSubject<string>;

    constructor(private web3: Web3Service,
                private cd: ChangeDetectorRef,
                private router: Router,
                private accountService: AccountService,
                public utilsService: UtilsService) {
    }

    ngOnInit(): void {
        this.mobileTitle$ = this.utilsService.mobileHeaderTitle;
        try {
            this.web3.getNetworkType().then((type) => {
                if (environment.production && type !== environment.network) {
                    this.router.navigate(['/wrong-network']);
                }
                // debugger
            });
        } catch (e) {
            console.error('Metamask is not detected');
        }


        this.isDarkTheme$ = this.utilsService.isDarkTheme$.pipe(
            map((item: boolean) => {
                this.isDark = item;
                return item;
            }),
            shareReplay()
        );

        this.changeTheme()

        this.account$ = this.accountService.getAccount()
            .pipe(
                map((address: any) => {
                    if (address) {
                        const formatted = `${address.substr(0, 4)}...${address.substr(address.length - 4)}`;
                        return formatted;
                    }
                    return address;
                }),
                tap(() => this.cd.detectChanges())
            );
    }

    connectWallet(): void {
        this.web3.connectWallet().then((accounts: string[]) => {
            const address = accounts[0];
            if (address) {
                this.accountService.setAccount(address);
            }
        });

    }

    disconnect(): void {
        this.accountService.disconnect();
    }

    toggleSidebar(): void {
        this.isSidebarSmall = !this.isSidebarSmall;
    }

    changeTheme(): void {
        this.utilsService.isDarkTheme$.next(this.isDark);
        if (this.isDark) {
            Object.keys(this.allThemes.DARK).map(item =>
                document.documentElement.style.setProperty(`--${item}`, this.allThemes.DARK[item])
            );
        } else {
            Object.keys(this.allThemes.DEFAULT).map(item =>
                document.documentElement.style.setProperty(`--${item}`, this.allThemes.DEFAULT[item])
            );
        }
    }

    toggleMobileSidebar(): void {
        this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    }
}
