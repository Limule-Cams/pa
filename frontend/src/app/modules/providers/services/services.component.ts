import {Component, DestroyRef, inject, OnInit, WritableSignal} from '@angular/core';
import {SideBareComponent} from '../shared/side-bare/side-bare.component';
import {ProviderService} from '../provider.service';
import {NgClass, NgForOf} from '@angular/common';
import {FullCalendarModule} from '@fullcalendar/angular';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import {filter, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ServiceDialogComponent} from '../../../shared/dialog/service-dialog/service-dialog.component';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SideBareComponent,
    FullCalendarModule,
    NgForOf,
    NgClass
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  private readonly providerService = inject(ProviderService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef)

  readonly providedServicesList: WritableSignal<any[]> = this.providerService.providerServices;

  ngOnInit() {
    this.providerService.getProviderServices$().subscribe(console.log);
  }

  onDeleteService(serviceId: number): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {title: 'Supprimer le service', message: 'Voulez vous vraiment supprimer ce service ?'}
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(result => result === true),
      switchMap(() => this.providerService.deleteService$(serviceId)),
      switchMap(() => this.providerService.getProviderServices$())
    ).subscribe()
  }

  onUpdateService(service: any): void {
    this.dialog.open(ServiceDialogComponent, {
      width: '450px',
      data: {
        mode: 'edit',
        service: service
      }
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(result => result !== undefined),
      switchMap((payload: any) => this.providerService.updateProviderService$(service.id, payload)),
      switchMap(() => this.providerService.getProviderServices$())
    ).subscribe()
  }

  onCreateNewService(): void {
    this.dialog.open(ServiceDialogComponent, {
      width: '450px',
      data: {
        mode: 'create',
      }
    }).afterClosed().pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(result => result !== undefined),
      switchMap((payload: any) => this.providerService.createNewService$(payload)),
      switchMap(() => this.providerService.getProviderServices$())
    ).subscribe()
  }
}
