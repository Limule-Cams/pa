import {Component, inject, OnInit} from '@angular/core';
import {SidebarComponent} from '../../admin/shared/sidebar/sidebar.component';
import {NavbareComponent} from '../shared/navbare/navbare.component';
import {EmployeeService} from '../employee.service';
import {DatePipe, NgClass, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbareComponent,
    NgForOf,
    NgClass,
    DatePipe,
    RouterLink
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EmployersEventsComponent implements OnInit {
  private readonly employeeService: EmployeeService = inject(EmployeeService);

  protected readonly events = this.employeeService.eventsList;

  ngOnInit() {
    this.employeeService.getEventsList$().subscribe();
  }

}
