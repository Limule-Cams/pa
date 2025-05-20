import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CNavbareComponent} from '../shared/c-navbare/c-navbare.component';
import {CFooterComponent} from '../shared/c-footer/c-footer.component';
import {CompanyService} from '../company.service';
import {filter, switchMap, tap} from 'rxjs';
import {UsersRoles} from '../../../shared/enum/user-roles.enum';
import {ContractType} from '../../../shared/enum/contract-type.enum';
import {SpinnerComponent} from '../../../shared/components/spinner/spinner.component';
import {NgIf} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-collab',
  standalone: true,
  imports: [
    CNavbareComponent,
    CFooterComponent,
    SpinnerComponent,
    NgIf,
    FormsModule
  ],
  templateUrl: './collab.component.html',
  styleUrl: './collab.component.scss'
})
export class CollabComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  private readonly dialog = inject(MatDialog);

  isLoading = false;
  private readonly expectedHeaders = [
    'firstName',
    'lastName',
    'email',
    'address',
    'occupiedJob',
    'startingDate',
    'endDate',
    'contractType'
  ];
  readonly employeesList: WritableSignal<any[]> = this.companyService.employeesList;

  searchTerm = signal('');
  filteredEmployees = signal<any[]>([]);

  ngOnInit(): void {
    this.companyService.getEmployeesList$().pipe(
      tap(employees => {
        this.employeesList.set(employees);
        this.filteredEmployees.set(employees);
      })
    ).subscribe();
  }

  applyFilter(): void {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      this.filteredEmployees.set(this.employeesList());
      return;
    }

    this.filteredEmployees.set(
      this.employeesList().filter(employee =>
        (employee.firstName + ' ' + employee.lastName).toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.occupied_job.toLowerCase().includes(term)
      )
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.importCsvFile(file);
    input.value = '';
  }

  onEmployeeDelete(employeeId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'Etes vous sure de vouloir supprimer cet salariée', title: 'Supprimer un salariée'},
    });
    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(() => this.companyService.deleteEmployee(employeeId)),
      switchMap(() => this.companyService.getEmployeesList$()),
    ).subscribe((newList: any[]) => this.filteredEmployees.set(newList));
  }

  getNewEmployeesCount(): number {
    if (!this.employeesList() || this.employeesList().length === 0) {
      return 0;
    }

    const currentYear = new Date().getFullYear();

    return this.employeesList().filter(employee => {
      if (!employee.startingDate) return false;

      if (typeof employee.startingDate === 'string') {
        return employee.startingDate.startsWith(`${currentYear}`);
      }
      const employeeDate = new Date(employee.startingDate);
      return employeeDate.getFullYear() === currentYear;
    }).length;
  }

  private importCsvFile(file: File): void {
    this.isLoading = true;

    const reader = new FileReader();
    reader.onload = (e) => this.processCsv(e.target?.result as string);
    reader.onerror = () => {
      this.isLoading = false;
    };
    reader.readAsText(file);
  }

  private processCsv(csvData: string): void {
    try {
      const { headers, data } = this.parseCsv(csvData);
      this.validateHeaders(headers);

      const employees = this.mapCsvToEmployees(data);
      this.sendToBackend(employees);
    } catch (error) {
      this.isLoading = false;
    }
  }

  private parseCsv(csvData: string): { headers: string[], data: any[] } {
    const lines = csvData.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('Le fichier CSV est vide ou incomplet');

    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index]?.trim() || null;
        return obj;
      }, {} as any);
    });

    return { headers, data };
  }

  private validateHeaders(headers: string[]): void {
    const missingHeaders = this.expectedHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length) {
      throw new Error(`En-têtes manquants: ${missingHeaders.join(', ')}`);
    }
  }

  private mapCsvToEmployees(csvData: any[]): any[] {
    return csvData.map(row => {
      const formatDateForMySQL = (dateString: string | undefined): string | null => {
        if (!dateString) return null;

        const cleanString = dateString.toString().trim().replace(/^"|"$/g, '');

        if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanString)) {
          console.warn(`Invalid date format: ${cleanString}`);
          return null;
        }

        return cleanString;
      };

      const firstNamePart = row.firstName.slice(0, 3).toLowerCase();
      const lastNamePart = row.lastName.slice(0, 2).toUpperCase();
      const jobPart = row.occupiedJob.charAt(0).toUpperCase();
      const tempPassword = `${firstNamePart}${lastNamePart}${jobPart}`;

      const user: Partial<any> = {
        email: row.email,
        password: tempPassword,
        role: UsersRoles.CLIENT,
        isActive: true
      };

      const employee: Partial<any> = {
        name: row.firstName,
        lastName: row.lastName,
        address: row.address,
        occupied_job: row.occupiedJob,
        startingDate: formatDateForMySQL(row.startingDate),
        endDate: formatDateForMySQL(row.endDate),
        contractType: row.contractType || ContractType.CDI
      };

      console.log('Processed employee:', employee);
      return { user, employee };
    });
  }

  private sendToBackend(employees: any[]): void {
    this.companyService.importEmployees(employees)
      .pipe(
        tap(() => setTimeout(() => this.isLoading = false, 3000)),
      )
      .subscribe(() => this.companyService.getEmployeesList$().subscribe(list => this.filteredEmployees.set(list)));
  }
}
