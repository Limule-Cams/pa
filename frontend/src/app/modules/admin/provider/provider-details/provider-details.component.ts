import {Component, inject, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {AdminManagementService} from '../../services/admin-management.service';
import {ActivatedRoute} from '@angular/router';
import {filter, map, switchMap, tap} from 'rxjs';


export enum DashboardScreens {
  INFOS = 'INFOS',
  VERIVICATIONS = 'VERIVICATIONS',
  SERVICES = 'SERVICES',

}

@Component({
  selector: 'app-provider-details',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    SidebarComponent,
    NgClass,
    NgForOf
  ],
  templateUrl: './provider-details.component.html',
  styleUrl: './provider-details.component.scss'
})
export class ProviderDetailsComponent implements OnInit {
  defaultForm = DashboardScreens.INFOS;
  submitted = false;

  selectedProvider!: any;
  private readonly adminService = inject(AdminManagementService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  providerId!: number


  ngOnInit() {
    this.activatedRoute.params.pipe(
      filter((params) => params['id']),
      map((params) => params['id']),
      switchMap(id => {
        this.providerId = id
        return this.adminService.getProviders()
      }),
      map((p: any) => p.data),
      tap((providers: any[]) => this.selectedProvider = providers.find(provider => provider.user.id == this.providerId))
    ).subscribe(() => console.log(this.selectedProvider));
  }

  onScreenChange(screen: DashboardScreens) {
    this.defaultForm = screen;
  }

  getProviderTypeLabel(type: string): string {
    const types: any = {
      'therapeute': 'Thérapeute',
      'coach': 'Coach',
      'formateur': 'Formateur',
      'intervenant': 'Intervenant spécialisé',
      'autre': 'Autre'
    };
    return types[type] || type;
  }


  onDowloadClick(fileUrl: string): void {
    console.log(fileUrl);
    try {
      if (!fileUrl || typeof fileUrl !== 'string') {
        console.error('Invalid file URL provided');
        return;
      }
      fileUrl = `http://localhost:3000/${fileUrl}`;
      const link = document.createElement('a');
      link.href = fileUrl;

      const fileName = fileUrl.split('/').pop() || `contract_${new Date().getTime()}.pdf`;
      link.download = fileName;

      link.rel = 'noopener noreferrer';
      link.target = '_blank';
      link.setAttribute('aria-label', `Download contract PDF`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading contract:', error);
    }
  }

  validateProvider(): void {
    this.adminService.activateProvider(this.providerId).pipe(
      (tap(() => this.selectedProvider.user.isActive = true)
      )).subscribe()
  }

  protected readonly DashboardScreens = DashboardScreens;


}
