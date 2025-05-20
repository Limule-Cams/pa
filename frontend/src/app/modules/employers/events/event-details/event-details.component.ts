import {Component, inject, OnInit} from '@angular/core';
import {NavbareComponent} from '../../shared/navbare/navbare.component';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../employee.service';
import {map, switchMap, tap} from 'rxjs';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    NavbareComponent,
    DatePipe,
    NgClass
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventsDetailsComponent implements OnInit {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly employeeService: EmployeeService = inject(EmployeeService);
  private readonly router = inject(Router)

  eventId!: number;
  selectedEvent!: any;
  employeeId!: number;

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      map(params => params['id']),
      switchMap((id) => {
        this.eventId = id;
        return this.employeeService.getEventsList$()
      }),
      switchMap(() => this.employeeService.getEmployeeDetails$()),
      tap(employee => {
        this.employeeId = employee.userId
      }),
    ).subscribe(() => {
      this.selectedEvent = this.employeeService.eventsList().find(event => event.id == this.eventId);
    });
  }

  getDuration(startDateStr: string, endDateStr: string): string {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const hours = diffInHours % 24;
    const minutes = diffInMinutes % 60;

    if (diffInDays > 0) {
      return `${diffInDays}j ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  getParticipants(): number {
    return (this.selectedEvent.employees.length);
  }

  isParticipated(): { participate: boolean, text: string } {
    const participation = (this.selectedEvent.employees.find((employee: any) => employee.user.id === this.employeeId) != undefined);
    let message = '';
    if (participation) {
      message = 'Vous avez déja participé'
    } else {
      message = 'participer'
    }
    return {
      participate: participation,
      text: message
    };
  }

  onParticipateClick(): void {
    this.employeeService.participateEvent$(this.employeeId, this.eventId).subscribe(() => {
      this.router.navigate(['/employer/events']);
    });
  }
}
