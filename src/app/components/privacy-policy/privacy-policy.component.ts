import { Component, OnInit } from '@angular/core';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.utilsService.mobileHeaderTitle.next('Privacy Policy');
  }

}
