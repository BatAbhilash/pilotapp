import { Component, OnInit } from '@angular/core';
import { CslService } from '../app/csl.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  today = Date.now();
  cslService: any;

  constructor(cslService: CslService) {
    this.cslService = cslService;
  }

  ngOnInit(): void {
      localStorage.setItem('token', 'sample token');
  }
}
