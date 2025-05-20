import {Component, inject, OnInit} from '@angular/core';
import {NavbareComponent} from '../../shared/navbare/navbare.component';
import {EmployeeService} from '../../employee.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap, tap} from 'rxjs';
import {MarkdownModule} from 'ngx-markdown';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-advice-details',
  standalone: true,
  imports: [
    NavbareComponent,
    MarkdownModule,
    DatePipe
  ],
  templateUrl: './advice-details.component.html',
  styleUrl: './advice-details.component.scss'
})
export class AdviceDetailsComponent implements OnInit {
  private readonly employeeService: EmployeeService = inject(EmployeeService);
  private readonly activatedRoute = inject(ActivatedRoute);
  id!: number
  selectedAdvice!: any;

  ngOnInit() {
    this.activatedRoute.params.pipe(
      map(params => this.id = params['id']),
      switchMap(() => this.employeeService.getAdvicesList$()),
      tap((adviceId) => {
        this.selectedAdvice = this.employeeService.advicesList().find(advice => advice.id == this.id);
      })
    ).subscribe();
  }
}
