import { Component, OnInit } from '@angular/core';
import { CslService } from '../app/csl.service';
// import * as GlobalVars from './global-vars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  today = Date.now();
  cslService: CslService;
  // globalVars = GlobalVars;
  loading = false;
  constructor(cslService: CslService) {
    const self = this;
    this.loading = true;
    this.cslService = cslService;
    this.cslService.getToken().subscribe(obj => {
      self.loading = false;
      localStorage.setItem('token', obj.toString());
    }, err => {
      self.loading = false;
      console.log(err);
    });
  }

  ngOnInit(): void {
  }
}
