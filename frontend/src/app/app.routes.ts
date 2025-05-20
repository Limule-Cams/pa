import {Routes} from '@angular/router';
import {HomeComponent} from './modules/main-site/home/home.component';
import {DashbordComponent} from './modules/admin/dashbord/dashbord.component';
import {CompaniesComponent} from './modules/admin/companies/companies/companies.component';
import {CompanyDetailsComponent} from './modules/admin/companies/company-details/company-details.component';
import {authGuard} from './core/guard/auth.guard';
import {EmployersComponent} from './modules/admin/employers/employers/employers.component';
import {EventsComponent} from './modules/admin/events/events/events.component';
import {ProviderComponent} from './modules/admin/provider/provider/provider.component';
import {ContractPaymentComponent} from './modules/admin/C&P/contract-payment/contract-payment.component';
import {EventDetailsComponent} from './modules/admin/events/event-details/event-details.component';
import {EmployerDetailsComponent} from './modules/admin/employers/employer-details/employer-details.component';
import {ProviderDetailsComponent} from './modules/admin/provider/provider-details/provider-details.component';
import {DashboardComponent} from './modules/providers/dashboard/dashboard.component';
import {ProfilComponent} from './modules/providers/profil/profil.component';
import {ServicesComponent} from './modules/providers/services/services.component';
import {PlanningComponent} from './modules/providers/planning/planning.component';
import {PaymentsComponent} from './modules/providers/payments/payments.component';
import {EmployerHomeComponent} from './modules/employers/home/home.component';
import {EmployerServicesComponent} from './modules/employers/services/services.component';
import {EmployersEventsComponent} from './modules/employers/events/events.component';
import {AdvicesComponent} from './modules/employers/advices/advices.component';
import {BlogComponent} from './modules/employers/blog/blog.component';
import {EventsDetailsComponent} from './modules/employers/events/event-details/event-details.component';
import {ServiceDetailsComponent} from './modules/employers/services/service-details/service-details.component';
import {CollabComponent} from './modules/companies/collab/collab.component';
import {DevisFactComponent} from './modules/companies/devis-fact/devis-fact.component';
import {ContratsComponent} from './modules/companies/contrats/contrats.component';
import {CompniesPaymentsComponent} from './modules/companies/payments/payments.component';
import {CompaniesDashboardComponent} from './modules/companies/dashboard/dashboard.component';
import {CompanyProfilComponent} from './modules/companies/profil/profil.component';
import {ADevisComponent} from './modules/admin/devis/devis.component';
import {StripePaymentComponent} from './shared/components/payement/payement.component';
import {ProviderRegestrationComponent} from './modules/providers/provider-regestration/provider-regestration.component';
import {AdviceDetailsComponent} from './modules/employers/advices/advice-details/advice-details.component';
import {AdviceCreateComponent} from './modules/employers/advices/advice-create/advice-create.component';
import {ReservationComponent} from './modules/employers/home/reservation/reservation.component';
import {adminGuard} from './core/guard/admin.guard';
import {providerGuard} from './core/guard/provider.guard';
import {companyGuard} from './core/guard/company.guard';
import {clientGuard} from './core/guard/employee.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'auth', loadComponent: () => import('./modules/main-site/auth/auth.component').then(m => m.AuthComponent)},

  {path: 'admin/dashboard', component: DashbordComponent, canActivate: [authGuard, adminGuard]},
  {path: 'admin/companies', component: CompaniesComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/company/:id', component: CompanyDetailsComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/employers', component: EmployersComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/events', component: EventsComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/provider', component: ProviderComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/c&p', component: ContractPaymentComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/event/:id', component: EventDetailsComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/employer', component: EmployerDetailsComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/providers/:id', component: ProviderDetailsComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/devis', component: ADevisComponent, canActivate: [authGuard,adminGuard]},

  {path: 'provider/dashboard', component: DashboardComponent, canActivate: [authGuard,providerGuard]},
  {path: 'provider/profil', component: ProfilComponent, canActivate: [authGuard,providerGuard]},
  {path: 'provider/services', component: ServicesComponent, canActivate: [authGuard,providerGuard]},
  {path: 'provider/planing', component: PlanningComponent, canActivate: [authGuard,providerGuard]},
  {path: 'provider/payments', component: PaymentsComponent, canActivate: [authGuard,providerGuard]},
  {path: 'provider/registration/:id', component: ProviderRegestrationComponent},

  {path: 'employer/home', component: EmployerHomeComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/reservation', component: ReservationComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/services', component: EmployerServicesComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/events', component: EmployersEventsComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/advices', component: AdvicesComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/blog', component: BlogComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/event-details/:id', component: EventsDetailsComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/service-details/:id', component: ServiceDetailsComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/advice-details/:id', component: AdviceDetailsComponent, canActivate: [authGuard,clientGuard]},
  {path: 'employer/advice-create', component: AdviceCreateComponent, canActivate: [authGuard,clientGuard]},

  {path: 'companies/collab', component: CollabComponent, canActivate: [authGuard, companyGuard]},
  {path: 'companies/devis-fact', component: DevisFactComponent, canActivate: [authGuard,companyGuard]},
  {path: 'companies/contract', component: ContratsComponent, canActivate: [authGuard,companyGuard]},
  {path: 'companies/payments', component: CompniesPaymentsComponent, canActivate: [authGuard,companyGuard]},
  {path: 'companies/dashboard', component: CompaniesDashboardComponent, canActivate: [authGuard,companyGuard]},
  {path: 'companies/profil', component: CompanyProfilComponent, canActivate: [authGuard,companyGuard]},
  {path: 'payment', component: StripePaymentComponent, canActivate: [authGuard,companyGuard]},



  // TODO : 404 not found
  // { path: '**', component:  }
]
