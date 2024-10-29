import { Component, OnInit } from '@angular/core';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss']
})
export class TermsOfUseComponent implements OnInit {

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.utilsService.mobileHeaderTitle.next('Terms of Use');
  }

}
