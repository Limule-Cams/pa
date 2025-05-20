import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {Observable, tap} from 'rxjs';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiService = inject(ApiService);

  readonly serviceList: WritableSignal<any[]> = signal([]);
  readonly serviceDetails: WritableSignal<any> = signal(undefined);
  readonly advicesList: WritableSignal<any[]> = signal([]);
  readonly eventsList: WritableSignal<any[]> = signal([]);
  readonly commmunityPostsList: WritableSignal<any[]> = signal([]);
  readonly messagesList: WritableSignal<any[]> = signal([]);
  readonly profile: WritableSignal<any> = signal(undefined)

  getServicesCatalogue$(): Observable<any[]> {
    return this.apiService.getRequest('employees/services').pipe(
      tap(data => this.serviceList.set(data))
    );
  }

  getServiceDetails(id: number): Observable<any> {
    return this.apiService.getRequest('employees/service-details/' + id).pipe(
      tap(data => this.serviceDetails.set(data)),
    );
  }

  getBookings$(providerId: number): Observable<any> {
    return this.apiService.getRequest('employees/bookings/' + providerId)
  }

  createBooking$(payload: any): Observable<void> {
    return this.apiService.postRequest('employees/booking/create', payload);
  }

  getEmployeeDetails$(): Observable<any> {
    return this.apiService.getRequest('employees/profile').pipe(
      tap(data => this.profile.set(data)),
    )
  }

  createAdvice$(payload: any): Observable<void> {
    return this.apiService.postRequest('employees/advice/create', payload);
  }

  getAdvicesList$(): Observable<any> {
    return this.apiService.getRequest('employees/advice').pipe(
      tap(data => this.advicesList.set(data)),
    )
  }

  getEventsList$(): Observable<any[]> {
    return this.apiService.getRequest('employees/events').pipe(
      tap((events) => this.eventsList.set(events))
    );
  }

  participateEvent$(employeeId: number, eventId: number): Observable<any> {
    const httpParams = new HttpParams()
      .set('employeeId', employeeId)
      .set('eventId', eventId);
    return this.apiService.getRequest('employees/event/participate', httpParams).pipe()
  }

  submitPost$(payload: any): Observable<any> {
    return this.apiService.postRequest('employees/post', payload);
  }

  getCommunityPosts(): Observable<any[]> {
    return this.apiService.getRequest('employees/posts/all').pipe(
      tap((posts) => this.commmunityPostsList.set(posts))
    );
  }

  submitComment(payload: any): Observable<any> {
    return this.apiService.postRequest('employees/comments', payload);
  }

  sendMessage(payload: any) {
    return this.apiService.postRequest('employees/messages', payload);
  }

  getAllMessages(): Observable<any[]> {
    return this.apiService.getRequest('employees/messages').pipe(
      tap(messages => this.messagesList.set(messages))
    );
  }

  getMyEvaluation(providerId: number): Observable<any | null> {
    return this.apiService.getRequest(
      `employees/evaluation/${providerId}`
    );
  }

  setEvaluation(data: {
    providerId: number;
    isLike: boolean;
    employeeId: number;
    bookingId?: number;
    comment?: string;
  }): Observable<void> {
    return this.apiService.postRequest(
      `employees/evaluation/`,
      data
    );
  }
}
