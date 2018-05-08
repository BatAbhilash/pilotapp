import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// component imports
import { AppComponent } from './app.component';
import { CslDropdownsComponent } from './csl-dropdowns/csl-dropdowns.component';

// module imports
import { ToasterModule, ToasterService } from 'angular5-toaster';
import { ModalModule } from 'ngx-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgMultiSelectDropDownModule } from './ng-multiselect-dropdown/src';
import { LoadingModule } from 'ngx-loading';

// service imports
import { CslService } from './csl.service';

const routes: Routes = [
  { path: 'csl', component: CslDropdownsComponent },
  { path: '', redirectTo: '/csl', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AppComponent,
    CslDropdownsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    Ng2SmartTableModule,
    ToasterModule,
    LoadingModule
  ],
  providers: [CslService],
  bootstrap: [AppComponent]
})
export class AppModule { }
