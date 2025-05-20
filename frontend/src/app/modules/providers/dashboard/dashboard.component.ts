import {Component, inject, OnInit} from '@angular/core';
import {SidebarComponent} from '../../admin/shared/sidebar/sidebar.component';
import {SideBareComponent} from '../shared/side-bare/side-bare.component';
import {ProviderService} from '../provider.service';
import {DatePipe, JsonPipe, NgClass, NgForOf, NgIf, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    SideBareComponent,
    NgClass,
    DatePipe,
    NgForOf,
    NgIf,
    JsonPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private readonly providerService = inject(ProviderService);
  providesDetail = this.providerService.providerInfos;

  ngOnInit() {
    this.providerService.getProviderData().subscribe(console.log);
    registerLocaleData(localeFr, 'fr')
  }

  getLastMonthBookings(): number {
    if (!this.providesDetail()?.bookings) return 0;

    const today = new Date();
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    return this.providesDetail().bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.bookingDate);
      return (
        booking.status === 'completed' &&
        bookingDate >= firstDayOfLastMonth &&
        bookingDate <= lastDayOfLastMonth
      );
    }).length;
  }

  getUpcomingBookings(): number {
    if (!this.providesDetail()?.bookings) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // Last day of next month

    return this.providesDetail().bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.bookingDate);
      return (
        (booking.status === 'confirmed' || booking.status === 'pending') &&
        bookingDate >= today &&
        bookingDate <= endOfNextMonth
      );
    }).length;
  }

  getPendingInvoices(): number {
    if (!this.providesDetail()?.invoices) return 0;
    return this.providesDetail().invoices.filter((invoice: any) =>
      invoice.status === 'pending'
    ).length;
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'confirmed': 'Confirmé',
      'pending': 'En attente',
      'cancelled': 'Annulé',
      'no_show': 'Non présenté',
      'completed': 'Terminé'
    };
    return statusMap[status] || status;
  }
}
