import { Injectable } from '@angular/core';
import {ApiService} from '../../../core/services/api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly apiService: ApiService) { }

  login$(payload: {email: string, password: string}): Observable<any> {
    return this.apiService.postRequest('auth/login', payload);
  }

  register(payload: any): Observable<void> {
    return this.apiService.postRequest('auth/register', payload);
  }

  saveAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  clearTokens(): void {
    localStorage.clear();
  }
}
