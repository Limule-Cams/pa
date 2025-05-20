import {Component, inject, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarApi, CalendarOptions, DateSelectArg} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import {EmployeeService} from '../../../modules/employers/employee.service';
import {NgIf} from '@angular/common';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {filter, switchMap} from 'rxjs';

@Component({
  selector: 'app-calendar-reservce-dialog',
  standalone: true,
  imports: [
    FullCalendarModule,
    NgIf
  ],
  templateUrl: './calendar-reservce-dialog.component.html',
  styleUrl: './calendar-reservce-dialog.component.scss'
})
export class CalendarReservceDialogComponent implements OnInit {
  constructor(
    protected readonly dialogRef: MatDialogRef<CalendarReservceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  private readonly employeeService: EmployeeService = inject(EmployeeService);
  private readonly dialog = inject(MatDialog);

  calendarApi?: CalendarApi;
  bookings: any[] = [];

  currentUserId!: number;

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
    selectable: true,  // Enable selection of empty slots
    editable: false,
    selectMirror: true,
    dayMaxEvents: false,
    eventStartEditable: false,
    eventDurationEditable: false,
    eventOverlap: false,

    events: [],
    eventContent: this.renderEventContent.bind(this),
    eventDidMount: this.styleEvent.bind(this),

    select: this.handleDateSelect.bind(this),

    datesSet: (arg) => {
      this.calendarApi = arg.view.calendar;
      this.updateCalendarEvents();
    },
  };

  ngOnInit(): void {
    this.loadBookings();
    this.employeeService.getEmployeeDetails$().subscribe((employee) => this.currentUserId = employee.employeeId);
  }

  private handleDateSelect(selectInfo: DateSelectArg): void {
    const startDate = selectInfo.start;

    const payload = {
      employeeId: this.data.employeeId,
      providerId: this.data.providerId,
      serviceId: this.data.serviceId,
      bookingDate: startDate,
    }

    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Voulez-vous prendre ce rendez-vous ?
          ${startDate}`,
        title: 'Confirmation RDV'
      }
    }).afterClosed().pipe(
      filter(res => res),
      switchMap(() => this.employeeService.createBooking$(payload)),
      switchMap(() => this.employeeService.getBookings$(this.data.providerId))
    ).subscribe(() => this.dialogRef.close())
    this.calendarApi?.unselect();
  }

  private loadBookings(): void {
    setTimeout(() => {
      this.employeeService.getBookings$(this.data.providerId).subscribe(bookings => {
        this.bookings = bookings;
        this.updateCalendarEvents();
      });
    }, 100)
  }

  private updateCalendarEvents(): void {
    if (!this.calendarApi) return;

    const events = this.bookings.map(booking => ({
      id: booking.id.toString(),
      title: this.getEventTitle(booking),
      start: booking.bookingDate,
      end: this.calculateEndTime(booking.bookingDate),
      backgroundColor: this.getStatusColor(booking.status, booking),
      borderColor: this.getStatusColor(booking.status, booking),
      textColor: '#ffffff',
      extendedProps: {
        notes: booking.notes,
        status: booking.status,
        employee: booking.employee,
        service: booking.service,
        isMyBooking: booking.employeeId === this.currentUserId
      }
    }));

    this.calendarApi.removeAllEvents();
    this.calendarApi.addEventSource(events);
  }

  private getEventTitle(booking: any): string {
    const serviceName = booking.service?.title
    const employeeName = booking.employee?.lastName
    return `${serviceName} - ${employeeName}`;
  }

  private calculateEndTime(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    return endDate;
  }

  private getStatusColor(status: string, booking: any): string {
    const isMyBooking = booking?.employeeId === this.currentUserId;

    if (!isMyBooking) {
      return '#9e9e9e';
    }

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
    const viewType = arg.view.type;

    const booking = this.bookings.find(b => b.id.toString() === event.id);

    const container = document.createElement('div');
    container.className = 'event-container';

    const statusDot = document.createElement('div');
    statusDot.className = 'status-dot';
    statusDot.style.backgroundColor = this.getStatusColor(status, booking);
    return {domNodes: [container]};
  }

  private styleEvent(arg: any): void {
    const status = arg.event.extendedProps.status;
    if (status === 'no_show') {
      arg.el.style.textDecoration = 'line-through';
    }
  }
}
