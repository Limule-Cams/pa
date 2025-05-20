import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import {NavbareComponent} from '../shared/navbare/navbare.component';
import {RouterLink} from '@angular/router';
import {EmployeeService} from '../employee.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-advices',
  standalone: true,
  imports: [
    NavbareComponent,
    RouterLink,
    NgForOf
  ],
  templateUrl: './advices.component.html',
  styleUrl: './advices.component.scss'
})
export class AdvicesComponent implements OnInit{

  private readonly employeeService: EmployeeService = inject(EmployeeService);
  protected readonly advicesList: WritableSignal<any[]> = this.employeeService.advicesList;

  ngOnInit() {
    this.employeeService.getAdvicesList$().subscribe();
  }
}
