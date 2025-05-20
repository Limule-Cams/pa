import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminManagementService {
  private readonly api: ApiService = inject(ApiService);
  companiesList: WritableSignal<any[]> = signal([]);
  companiesCount: WritableSignal<number> = signal(0);
  filteredList: WritableSignal<any[]> = signal([]);
  devisList: WritableSignal<any[]> = signal([]);

  companyDetails: WritableSignal<any> = signal(undefined);
  employeesList: WritableSignal<any[]> = signal([]);
  providersList: WritableSignal<any[]> = signal([]);
  events: WritableSignal<any[]> = signal([]);

  // Existing company methods
  getAllCompanies(): Observable<any[]> {
    return this.api.getRequest('admin/companies').pipe(
      tap((companies: any) => {
        this.companiesList.set(companies.data);
        this.filteredList.set(companies.data);
        this.companiesCount.set(companies.total);
      }),
    );
  }

  createCompany(payload: any): Observable<void> {
    return this.api.postRequest('admin/companies', payload);
  }

  getCompanyDetails(companyId: number): Observable<any> {
    return this.api.getRequest(`admin/companies/${companyId}`).pipe(
      tap((company: any) => this.companyDetails.set(company))
    );
  }

  updateCompany(payload: any, companyId: number): Observable<any> {
    return this.api.patchRequest(`admin/companies/${companyId}`, payload);
  }

  deleteCompany(companyId: number): Observable<any> {
    return this.api.deleteRequest(`admin/companies/${companyId}`);
  }

  getSubscriptions(companyId: number): Observable<any> {
    return this.api.getRequest('admin/subscriptions').pipe();
  }

  filterCompanies(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredList.set(this.companiesList());
      return;
    }
    const filtered = this.companiesList().filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    this.filteredList.set(filtered);
  }

  // Employee methods
  getEmployeesList(): Observable<any[]> {
    return this.api.getRequest('admin/employees/').pipe(
      tap((employees: any[]) => this.employeesList.set(employees))
    );
  }

  // Provider methods
  getProviders(): Observable<any[]> {
    return this.api.getRequest('admin/providers/').pipe(
      tap((employees: any) => this.providersList.set(employees.data))
    );
  }

  activateProvider(providerId: number): Observable<void> {
    return this.api.getRequest(`admin/providers/${providerId}/activate`);
  }

  // Event methods
  getEventsList(): Observable<any[]> {
    return this.api.getRequest('admin/events').pipe(
      tap(events => this.events.set(events))
    );
  }

  createEvent(payload: any): Observable<any> {
    return this.api.postRequest('admin/events', payload);
  }

  validateEvent(eventId: number): Observable<void> {
    return this.api.getRequest(`admin/events/${eventId}/validate`);
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.api.deleteRequest(`admin/events/${eventId}`);
  }

  // New Devis methods
  getAllDevis(): Observable<any[]> {
    return this.api.getRequest('admin/devis').pipe(
      tap((devis: any[]) => this.devisList.set(devis))
    );
  }

  getDevisById(id: string): Observable<any> {
    return this.api.getRequest(`admin/devis/${id}`);
  }

  createDevis(devis: any): Observable<any> {
    return this.api.postRequest('admin/devis', devis).pipe(
      tap((newDevis: any) => {
        this.devisList.update(list => [...list, newDevis]);
      })
    );
  }

  updateDevis(devis: any): Observable<any> {
    return this.api.patchRequest(`admin/devis/${devis.id}`, devis).pipe(
      tap((updatedDevis: any) => {
        this.devisList.update(list =>
          list.map(d => d.id === updatedDevis.id ? updatedDevis : d)
        );
      })
    );
  }

  deleteDevis(id: string): Observable<void> {
    return this.api.deleteRequest(`admin/devis/${id}`).pipe(
      tap(() => {
        this.devisList.update(list => list.filter(d => d.id !== id));
      })
    );
  }
}
