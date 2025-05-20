import {Component, inject, OnInit} from '@angular/core';
import {NavbareComponent} from '../shared/navbare/navbare.component';
import {EmployeeService} from '../employee.service';
import {NgClass, NgForOf, NgStyle} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  CalendarReservceDialogComponent
} from '../../../shared/dialog/calendar-reservce-dialog/calendar-reservce-dialog.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    NavbareComponent,
    NgForOf,
    NgClass,
    NgStyle,
    RouterLink
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class EmployerServicesComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly serviceList = this.employeeService.serviceList;

  ngOnInit(): void {
    this.employeeService.getServicesCatalogue$().subscribe();
  }


  getRandomDarkGradient(): string {
    const darkGradients = [
      'linear-gradient(135deg, #f3f0ff 0%, #d9d2f2 50%, #5A4A7B 100%)', // Doux à intense
      'linear-gradient(135deg, #f8f5ff 0%, #b8aed6 50%, #5A4A7B 100%)', // Très léger à foncé
      'linear-gradient(to right, #e6e1ff, #c5b8eb, #5A4A7B)', // Dégradé horizontal doux
      'linear-gradient(to bottom, #f9f7ff, #d4c8f0, #5A4A7B)', // Vertical élégant
      'linear-gradient(145deg, #fffaff 0%, #e2d8f8 30%, #5A4A7B 90%)', // Angle moderne
      'linear-gradient(to right, #f0ebff, #a899d4, #5A4A7B)', // Contrasté mais harmonieux
      'linear-gradient(135deg, #5A4A7B 0%, #b5a4d9 50%, #f5f2ff 100%)'  // Inverse sophistiqué
    ];

    return darkGradients[Math.floor(Math.random() * darkGradients.length)];
  }

  redirectToService(id: number): void {
    const service = this.serviceList().find(service => service.id === id);
    this.employeeService.serviceDetails.set(service);

    this.router.navigate(['/employer/service-details', id]);
  }
}
