import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {ApiService} from '../../core/services/api.service';
import {AuthService} from '../main-site/auth/auth.service';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly apiService = inject(ApiService);
  companyDetails: WritableSignal<any> = signal(undefined);
  companyContracts: WritableSignal<any> = signal([]);
  companyPayment: WritableSignal<any> = signal([]);
  employeesList: WritableSignal<any[]> = signal([]);

  getCompanyInfo$() {
    return this.apiService.getRequest('company/me').pipe(
      tap(company => this.companyDetails.set(company))
    );
  }

  getCompanyContracts$() {
    return this.apiService.getRequest('company/contracts').pipe(
      tap(contracts => this.companyContracts.set(contracts))
    );
  }

  getCompanyPayment$() {
    return this.apiService.getRequest('company/payments').pipe(
      tap(payment => this.companyPayment.set(payment))
    );
  }

  getEmployeesList$(): Observable<any[]> {
    return this.apiService.getRequest('company/employees').pipe(
      tap((employees: any[]) => this.employeesList.set(employees)),
    );
  }

  importEmployees(employees: any[]): Observable<any> {
    return this.apiService.postRequest(`company/employees/import`, employees);
  }

  validateContract$() {
    return this.apiService.getRequest('company/validate-contract');
  }

  deleteEmployee(employeeId: number): Observable<any> {
    console.log(employeeId);
    return this.apiService.deleteRequest('company/employee/' + employeeId);
  }

  editCompanyProfile(payload: any) {
    return this.apiService.patchRequest('company/edit', payload);
  }
}
