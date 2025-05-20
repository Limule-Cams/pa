import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {
  CreateCompanyDialogComponent
} from '../../../../shared/dialog/create-company-dialog/create-company-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CreateEventDialogComponent} from '../../../../shared/dialog/create-event-dialog/create-event-dialog.component';
import {AdminManagementService} from '../../services/admin-management.service';
import {DatePipe, NgForOf} from '@angular/common';
import {filter, switchMap} from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    SidebarComponent,
    NgForOf,
    DatePipe

  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {

  constructor(private readonly dialog: MatDialog) { }

  private readonly adminService = inject(AdminManagementService);
  eventsList: WritableSignal<any[]> = this.adminService.events;

  ngOnInit() {
    this.adminService.getEventsList().subscribe(console.log);
  }

  OnCreateEvent(): void {
    this.dialog.open(CreateEventDialogComponent, {
      width: '600px',
      height: '670px',
    }).afterClosed().pipe(
      filter(data => data !== undefined),
      switchMap(data => this.adminService.createEvent(data)),
      switchMap(() => this.adminService.getEventsList())
    ).subscribe();
  }

}
