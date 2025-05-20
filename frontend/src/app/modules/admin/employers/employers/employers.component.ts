import {Component, inject, OnInit, WritableSignal, signal, computed} from '@angular/core';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {MatDialog} from '@angular/material/dialog';
import {NgForOf, NgIf} from '@angular/common';
import {AdminManagementService} from '../../services/admin-management.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-employers',
  standalone: true,
  imports: [
    SidebarComponent,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.scss'
})
export class EmployersComponent implements OnInit {
  constructor(private readonly dialog: MatDialog) { }
  private readonly adminService = inject(AdminManagementService)

  employeesList: WritableSignal<any[]> = this.adminService.employeesList;

  searchTerm = signal('');

  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.employeesList();

    return this.employeesList().filter(employee =>
      (employee.name?.toLowerCase().includes(term) ||
        employee.lastName?.toLowerCase().includes(term) ||
        employee.user?.email?.toLowerCase().includes(term) ||
        employee.occupied_job?.toLowerCase().includes(term) ||
        employee.address?.toLowerCase().includes(term))
    );
  });

  ngOnInit() {
    this.adminService.getEmployeesList().subscribe(console.log)
  }

  updateSearchTerm(term: string) {
    this.searchTerm.set(term);
  }
}
