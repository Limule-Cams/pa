import {Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {SidebarComponent} from '../shared/sidebar/sidebar.component';
import {AdminManagementService} from '../services/admin-management.service';
import {DatePipe, JsonPipe, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';



@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [SidebarComponent, NgForOf, JsonPipe, DatePipe, RouterLink],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.scss'
})
export class DashbordComponent implements OnInit {
  private readonly adminManagementService = inject(AdminManagementService);
  private readonly destroyRef = inject(DestroyRef);

  companiesList: WritableSignal<any[]> = this.adminManagementService.companiesList;
  employeesList: WritableSignal<any[]> = this.adminManagementService.employeesList;
  providersList: WritableSignal<any[]> = this.adminManagementService.providersList;
  eventsList: WritableSignal<any[]> = this.adminManagementService.events;

  ngOnInit(): void {
    this.adminManagementService.getAllCompanies().subscribe();
    this.adminManagementService.getEmployeesList().subscribe();
    this.adminManagementService.getProviders().subscribe();
    this.adminManagementService.getEventsList().subscribe()
  }

  getBiggestCompanies() {
    const sortedCompanies = [...this.companiesList()].sort((a, b) =>
      (b.employeeCount || 0) - (a.employeeCount || 0)
    );

    const top5Companies = sortedCompanies.slice(0, 5);

    return top5Companies;
  }

  getUpcomingEvents() {
    const now = new Date();

    return this.eventsList()
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);
  }
}
