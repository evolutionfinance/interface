import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    public isDarkTheme$ = new BehaviorSubject(true);
    public mobileHeaderTitle = new BehaviorSubject('');

    constructor() {
    }
}
