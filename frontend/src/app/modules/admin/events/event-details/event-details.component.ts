import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {AdminManagementService} from '../../services/admin-management.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap, tap} from 'rxjs';


export enum DashboardScreens {
  INFOS = 'INFOS',
  PLANIFICATION = 'PLANIFICATION',
  INSCRIPTION = 'INSCRIPTION',

}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    SidebarComponent,
    DatePipe,
    NgClass,
    NgForOf
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {

  defaultForm = DashboardScreens.INFOS;
  submitted = false;

  private readonly adminService = inject(AdminManagementService);
  protected readonly activatedRoute = inject(ActivatedRoute)
  protected readonly router = inject(Router);

  eventsList: WritableSignal<any[]> = this.adminService.events;

  eventId!: number;
  currentEvent!: any

  ngOnInit() {
    this.activatedRoute.params.pipe(
      map(param => param['id']),
      switchMap((eventId) => {
        this.eventId = eventId;
        return this.adminService.getEventsList()
      }),
      tap(() => this.currentEvent = this.eventsList().find((e) => e.id == this.eventId))
    ).subscribe(() => console.log(this.currentEvent));
  }

  onScreenChange(screen: DashboardScreens) {
    this.defaultForm = screen;
  }

  onDeleteEvent(): void {
    this.adminService.deleteEvent(this.eventId).subscribe(() => {
      this.router.navigate(['/admin/events'])
    })
  }

  onValidateEvent(): void {
    this.adminService.validateEvent(this.eventId).subscribe(() => this.currentEvent.isActive = false)
  }

  protected readonly DashboardScreens = DashboardScreens;


}
