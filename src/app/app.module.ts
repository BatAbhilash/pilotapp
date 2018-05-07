import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from 'angular2-datatable';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToasterModule, ToasterService } from 'angular5-toaster';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CslService } from './csl.service';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { RouterModule, Routes } from '@angular/router';
// import { MultiSelectComponent } from './ng-multiselect-dropdown/src/multiselect.component';
import { NgMultiSelectDropDownModule } from './ng-multiselect-dropdown/src';

const routes: Routes = [
  { path: 'app', component: AppComponent },
  { path: '', redirectTo: '/app', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    DataTableModule,
    BrowserAnimationsModule,
    Ng2SmartTableModule,
    ToasterModule,
  ],
  providers: [CslService],
  bootstrap: [AppComponent]
})
export class AppModule { }
