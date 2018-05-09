import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/toPromise';
import * as GlobalVars from './global-vars';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CslService {
  private apiUrl = 'http://192.168.1.114/ArisAPI/api/Values/';  // URL to web api
  globalVars = GlobalVars;
  constructor(private http: HttpClient) { }

  getCSLData(path: string, param?: any) {
    const url = this.apiUrl + path;
    this.globalVars.loading = true;
    if (!param) {
      param = {
        'token': localStorage.getItem('token')
      };
    }
    return this.http.post<any[]>(url, param, httpOptions).pipe(
      tap(obj => {
        console.log(`fetched data`);
        this.globalVars.loading = false;
    }),
      catchError(this.handleError('getCSLData', []))
    );
  }

  getToken() {
    this.globalVars.loading = true;
    return this.http.get<string>(this.apiUrl + 'token', httpOptions).pipe(
      tap(obj => {
        console.log(`fetched token`);
        this.globalVars.loading = false;
    }),
      catchError(this.handleError('getCSLData', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.globalVars.loading = false;
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
