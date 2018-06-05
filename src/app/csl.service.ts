import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/toPromise';
import { ToasterModule, ToasterService } from 'angular5-toaster';
// import * as GlobalVars from './global-vars';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CslService {
  toasterService: ToasterService;
    // private apiUrl = 'http://localhost:56272/api/Values/';  // URL to web api
   private apiUrl = 'http://192.168.1.114/ArisAPI/api/Values/';  // URL to web api
  // private apiUrl = 'http://10.10.20.65/ArisAPI/api/Values/';
  // private apiUrl = 'http://10.65.35.130/ArisApi/api/Values/';
  // globalVars = GlobalVars;
  constructor(private http: HttpClient, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  getCSLData(path: string, param?: any) {
    const url = this.apiUrl + path;
    // this.globalVars.loading = true;
    if (!param) {
      param = {
        'token': localStorage.getItem('token')
      };
    }
    return this.http.post<any[]>(url, param, httpOptions).pipe(
      tap(obj => {
        // this.globalVars.loading = false;
      }),
      catchError(this.handleError('getCSLData', []))
    );
  }

  getToken() {
    // this.globalVars.loading = true;
    return this.http.get<string>(this.apiUrl + 'token', httpOptions).pipe(
      tap(obj => {
        // this.globalVars.loading = false;
      }),
      catchError(this.handleError('getCSLData', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // this.globalVars.loading = false;
      this.toasterService.pop('error', 'Error!', `${operation} failed: ${error.message}`);
      console.error(error);
      return of(result as T);
    };
  }
}
