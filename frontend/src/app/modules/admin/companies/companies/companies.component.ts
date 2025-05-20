import {Component, DestroyRef, inject, OnInit, WritableSignal} from '@angular/core';
import {SidebarComponent} from "../../shared/sidebar/sidebar.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {
  CreateCompanyDialogComponent
} from "../../../../shared/dialog/create-company-dialog/create-company-dialog.component";
import {AdminManagementService} from '../../services/admin-management.service';
import {JsonPipe, NgClass, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [
    SidebarComponent,
    CreateCompanyDialogComponent,
    MatDialogModule,
    NgForOf,
    JsonPipe,
    NgClass,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent implements OnInit {

  constructor(private readonly dialog: MatDialog) {}
  private readonly adminManagementService: AdminManagementService = inject(AdminManagementService);
  private readonly destroyRef = inject(DestroyRef);

  companiesList: WritableSignal<any[]> = this.adminManagementService.filteredList;
  searchFilter: string = '';

  ngOnInit(): void {
      this.loadData();
  }

  onCreateCompanyClick(): void {
    const dialogRef = this.dialog.open(CreateCompanyDialogComponent, {
      width: '600px',
      height: '650',
    });
    dialogRef.afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(payload => payload !== false),
      switchMap((payload) => this.adminManagementService.createCompany(payload)),
      tap((response) => {
        console.log(response);
        alert('Company created successfully.');
      })
    ).subscribe();
  }

  onSearchChange(): void {
    this.adminManagementService.filterCompanies(this.searchFilter);
  }

  loadData(): void {
      this.adminManagementService.getAllCompanies().subscribe();
  }

}
