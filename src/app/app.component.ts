import { Component, OnInit } from '@angular/core';
import { CslService } from '../app/csl.service';
import * as GlobalVars from './global-vars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  today = Date.now();
  cslService: CslService;
  globalVars = GlobalVars;

  constructor(cslService: CslService) {
    this.cslService = cslService;
    this.cslService.getToken().subscribe(obj => {
      localStorage.setItem('token', obj.toString());
     }, err => {
       console.log(err);
     });
  }

  ngOnInit(): void {
  }
}
