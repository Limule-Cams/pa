import { Component } from '@angular/core';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";



export enum DashboardScreens {
  CONTRACTS = 'CONTRACTS',
   PAYMENTS= 'PAYMENTS',
}


@Component({
  selector: 'app-contract-payment',
  standalone: true,
    imports: [
        SidebarComponent,
        FormsModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './contract-payment.component.html',
  styleUrl: './contract-payment.component.scss'
})
export class ContractPaymentComponent {

  defaultForm = DashboardScreens.CONTRACTS;
  submitted = false;


  onScreenChange(screen: DashboardScreens) {
    this.defaultForm = screen;
  }

  protected readonly DashboardScreens = DashboardScreens;


}
