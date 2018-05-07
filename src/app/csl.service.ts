import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/toPromise';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CslService {
  private apiUrl = 'http://192.168.1.114/ArisAPI/api/Values/';  // URL to web api
  constructor(private http: HttpClient) { }

   getCSLData(path: string) {
    const url = this.apiUrl + path;
    return this.http.get(url, httpOptions);
    // .pipe(
    //   tap(obj => console.log(`fetched data`)),
    //   catchError(this.handleError('getCSLData', []))
    // );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
