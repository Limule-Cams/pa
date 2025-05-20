import {Component, inject, OnInit, WritableSignal} from '@angular/core';
import {NavbareComponent} from '../shared/navbare/navbare.component';
import {EmployeeService} from '../employee.service';
import {DatePipe, NgForOf, NgIf, registerLocaleData, UpperCasePipe} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {ChatbotComponent} from '../chatbot/chatbot.component';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbareComponent,
    UpperCasePipe,
    NgForOf,
    DatePipe,
    NgIf,
    ChatbotComponent,
    TranslatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class EmployerHomeComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  protected readonly employeeDetails: WritableSignal<any> = this.employeeService.profile;
  protected readonly services = this.employeeService.serviceList;

  ngOnInit(): void {
    registerLocaleData(localeFr, 'fr')

    this.employeeService.getEmployeeDetails$().subscribe(console.log);
    this.employeeService.getServicesCatalogue$().subscribe();
  }

}

