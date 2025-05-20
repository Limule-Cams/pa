import {Component, inject, OnInit} from '@angular/core';
import {SideBareComponent} from '../shared/side-bare/side-bare.component';
import {ProviderService} from '../provider.service';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarApi, CalendarOptions} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import {MatDialog} from '@angular/material/dialog';
import {BookingInfoDialogComponent} from '../../../shared/dialog/booking-info-dialog/booking-info-dialog.component';
import {filter, switchMap, tap} from 'rxjs';


@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [
    SideBareComponent,
    FullCalendarModule
  ],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss'
})
export class PlanningComponent implements OnInit {
  private readonly providerService = inject(ProviderService);
  private readonly dialog = inject(MatDialog);

  calendarApi?: CalendarApi;
  bookings: any[] = [];

  readonly calendarOptions: CalendarOptions = {

    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    nowIndicator: true,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    slotDuration: '01:00:00',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '08:00',
      endTime: '20:00',
    },
    buttonText: {
      today: 'Aujourd\'hui',
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      list: 'Liste'
    },
    allDaySlot: false,
    noEventsText: 'Aucun rendez-vous à afficher',
    weekText: 'Sem.',
    dayHeaderFormat: {weekday: 'long'},
    titleFormat: {year: 'numeric', month: 'long', day: 'numeric'},
    slotMinWidth: 120,
    expandRows: true,
    contentHeight: 120,
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    selectable: false,
    editable: false,
    selectMirror: false,
    dayMaxEvents: false,
    eventStartEditable: false,
    eventDurationEditable: false,
    eventOverlap: false,

    events: [],
    eventContent: this.renderEventContent.bind(this),
    eventDidMount: this.styleEvent.bind(this),

    datesSet: (arg) => {
      this.calendarApi = arg.view.calendar;
      this.updateCalendarEvents();
    },
    eventClick: (info) => this.handleEventClick(info)
  };

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    this.providerService.getBookings$().subscribe(bookings => {
      this.bookings = bookings;
      this.updateCalendarEvents();
    });
  }

  private updateCalendarEvents(): void {
    if (!this.calendarApi) return;

    const events = this.bookings.map(booking => ({
      id: booking.id.toString(),
      title: this.getEventTitle(booking),
      start: booking.bookingDate,
      end: this.calculateEndTime(booking.bookingDate),
      backgroundColor: this.getStatusColor(booking.status),
      borderColor: this.getStatusColor(booking.status),
      textColor: '#ffffff',
      extendedProps: {
        notes: booking.notes,
        status: booking.status,
        employee: booking.employee,
        service: booking.service
      }
    }));

    this.calendarApi.removeAllEvents();
    this.calendarApi.addEventSource(events);
  }

  private getEventTitle(booking: any): string {
    const serviceName = booking.service?.title || 'Service inconnu';
    const employeeName = booking.employee?.lastName || 'Employé inconnu';
    return `${serviceName} - ${employeeName}`;
  }

  private calculateEndTime(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    return endDate;
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'completed':
        return '#2196f3';
      case 'cancelled_employee':
      case 'cancelled_provider':
        return '#f44336';
      case 'no_show':
        return '#9e9e9e';
      default:
        return '#3f51b5';
    }
  }

  private renderEventContent(arg: any): { domNodes: HTMLElement[] } {
    const event = arg.event;
    const timeText = arg.timeText;
    const title = event.title;
    const status = event.extendedProps.status;
    const viewType = arg.view.type; // Get the current view type

    const container = document.createElement('div');
    container.className = 'event-container';

    const statusDot = document.createElement('div');
    statusDot.className = 'status-dot';
    statusDot.style.backgroundColor = this.getStatusColor(status);

    const titleElement = document.createElement('div');
    titleElement.className = 'event-title';

    if (viewType === 'timeGridWeek') {
      const serviceName = event.extendedProps.service?.title || 'Service inconnu';
      titleElement.textContent = serviceName;
      titleElement.style.whiteSpace = 'nowrap';
      titleElement.style.overflow = 'hidden';
      titleElement.style.textOverflow = 'ellipsis';
      titleElement.style.maxWidth = '100%';
    } else {
      titleElement.textContent = title;
    }

    const timeElement = document.createElement('div');
    timeElement.className = 'event-time';
    timeElement.textContent = timeText;

    container.appendChild(statusDot);
    container.appendChild(titleElement);
    container.appendChild(timeElement);

    return {domNodes: [container]};
  }

  private styleEvent(arg: any): void {
    const status = arg.event.extendedProps.status;
    if (status === 'no_show') {
      arg.el.style.textDecoration = 'line-through';
    }
  }

  private handleEventClick(info: any): void {
    const bookingId = info.event._def.publicId;
    this.dialog.open(BookingInfoDialogComponent, {
      width: '600px',
      data: {
        service: info.event._def,
        date: info.event.start
      }
    }).afterClosed().pipe(
      filter(result => result !== undefined),
      switchMap(action => this.providerService.updateBooking$(action, bookingId)),
      switchMap(() => this.providerService.getBookings$()),
      tap(bookings => {
        this.bookings = bookings;
        this.updateCalendarEvents();
      })
    ).subscribe();
  }
}
