import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://51.159.17.220:3000';

  constructor(private readonly httpClient: HttpClient) { }

  public getRequest(url: string, queryParams?: HttpParams): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/${url}`, {params: queryParams});
  }

  public postRequest(url: string, body: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/${url}`, body);
  }

  public deleteRequest(url: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${url}`);
  }

  public patchRequest(url: string, body: any): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/${url}`, body);
  }
}
