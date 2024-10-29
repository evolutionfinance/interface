import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {DashboardViewMode} from '../../core/enums/enums';
import {AccountService} from '../../services/account.service';
import {BehaviorSubject} from 'rxjs';
import {UtilsService} from '../../services/utils.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    public viewModes = DashboardViewMode;
    public activeViewMode: string | undefined;
    account$: BehaviorSubject<string>;

    constructor(
        private route: ActivatedRoute,
        private accountService: AccountService,
        private router: Router,
        private utilsService: UtilsService
    ) {
    }

    ngOnInit(): void {
        this.utilsService.mobileHeaderTitle.next('Dashboard');
        this.activeViewMode = this.route.snapshot.firstChild?.routeConfig?.path;
        this.account$ = this.accountService.getAccount() as BehaviorSubject<string>;
    }

    public changeViewMode(mode: DashboardViewMode): void {
        this.activeViewMode = mode;
        this.router.navigate([`/dashboard/${mode}`]);
    }
}
