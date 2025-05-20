import {Component, inject, OnInit} from '@angular/core';
import {NavbareComponent} from '../../shared/navbare/navbare.component';
import {EmployeeService} from '../../employee.service';
import {ActivatedRoute} from '@angular/router';
import {DecimalPipe, NgClass, NgForOf} from '@angular/common';
import {map, switchMap, tap} from 'rxjs';
import {
  CalendarReservceDialogComponent
} from '../../../../shared/dialog/calendar-reservce-dialog/calendar-reservce-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    NavbareComponent,
    NgClass,
    DecimalPipe,
    NgForOf
  ],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss'
})
export class ServiceDetailsComponent implements OnInit {
  private readonly employeeService: EmployeeService = inject(EmployeeService);
  private readonly activateRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  serviceDetails = this.employeeService.serviceDetails;
  providerId!: number;
  serviceId!: number;
  employeeId!: number;

  currentEvaluation: { isLike: boolean | null } = { isLike: null };

  ngOnInit() {
    this.activateRoute.params.pipe(
      map((params) => params['id']),
      switchMap((id) => this.employeeService.getServiceDetails(id)),
      tap(service => {
        this.providerId = service.provider.id;
        this.serviceId = service.id;
      }),
      switchMap(() => this.employeeService.getEmployeeDetails$()),
      tap((employee) => {
        this.employeeId = employee.userId;
        this.loadCurrentEvaluation();
      })
    ).subscribe();
  }

  loadCurrentEvaluation(): void {
    this.employeeService.getMyEvaluation(this.providerId).subscribe(evaluation => {
      this.currentEvaluation.isLike = evaluation?.isLike ?? null;
    });
  }

  setEvaluation(isLike: boolean): void {
    this.employeeService.setEvaluation({
      providerId: this.providerId,
      isLike,
      employeeId: this.employeeId
    }).subscribe(() => {
      this.currentEvaluation.isLike = isLike;
      // Optional: reload service details to update rating
      this.employeeService.getServiceDetails(this.serviceId).subscribe();
    });
  }

  onReserveClick(): void {
    this.dialog.open(CalendarReservceDialogComponent, {
      width: '900px',
      data: {
        providerId: this.providerId,
        serviceId: this.serviceId,
        employeeId: this.employeeId,
      },
    })
  }
}
