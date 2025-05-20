import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private readonly apiService = inject(ApiService);

  readonly providerServices: WritableSignal<any[]> = signal([]);
  readonly providerBookings: WritableSignal<any[]> = signal([]);
  readonly providerInfos: WritableSignal<any> = signal(null);

  readonly payments: WritableSignal<any[]> = signal([]);

  registerNewProvider$(payload: FormData): Observable<any> {
    return  this.apiService.postRequest('provider/register', payload);
  }

  getProviderServices$(): Observable<any[]> {
    return this.apiService.getRequest('provider/services').pipe(
      tap(servicesList => this.providerServices.set(servicesList))
    );
  }

  deleteService$(serviceId: number): Observable<any> {
    return this.apiService.deleteRequest(`provider/service/${serviceId}`);
  }

  updateProviderService$(serviceId: number, payload: any): Observable<void> {
    return this.apiService.patchRequest(`provider/service/${serviceId}/update`, payload);
  }

  createNewService$(payload: any): Observable<void> {
    return this.apiService.postRequest('provider/service', payload);
  }

  getBookings$(): Observable<any[]> {
    return this.apiService.getRequest('provider/bookings').pipe(
      tap(bookings => this.providerBookings.set(bookings))
    );
  }

  updateBooking$(action: any, bookingId: number): Observable<void> {
    console.log(bookingId, action);
    return this.apiService.patchRequest(`provider/booking/${bookingId}/status`, action);
  }

  getProviderData(): Observable<any> {
    return this.apiService.getRequest('provider/me').pipe(
      tap(providerData => this.providerInfos.set(providerData))
    );
  }

  getPaymentsList$(): Observable<any[]> {
    return this.apiService.getRequest('provider/payments').pipe(
      tap(payments => this.payments.set(payments))
    );
  }
}
