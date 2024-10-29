import {NgModule} from '@angular/core';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzProgressModule} from 'ng-zorro-antd/progress';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzStatisticModule} from 'ng-zorro-antd/statistic';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzMessageModule} from 'ng-zorro-antd/message';
import { IconDefinition } from '@ant-design/icons-angular';
import { MenuOutline, AppstoreOutline, DownloadOutline, DollarOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzSliderModule} from 'ng-zorro-antd/slider';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzTabsModule} from 'ng-zorro-antd/tabs';

export const icons: IconDefinition[] = [ MenuOutline, AppstoreOutline, DownloadOutline, DollarOutline, SettingOutline];

@NgModule({
    declarations: [],
    imports: [
        NzIconModule.forChild(icons),
    ],
    exports: [
        NzGridModule,
        NzCardModule,
        NzProgressModule,
        NzButtonModule,
        NzSpaceModule,
        NzAlertModule,
        NzStatisticModule,
        NzTableModule,
        NzInputModule,
        NzIconModule,
        NzMessageModule,
        NzDropDownModule,
        NzSwitchModule,
        NzSliderModule,
        NzSelectModule,
        NzListModule,
        NzModalModule,
        NzCollapseModule,
        NzTabsModule
    ]
})
export class NgZorroModule {
}
