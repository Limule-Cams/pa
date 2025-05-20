import {Component, computed, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {MatDialog} from '@angular/material/dialog';
import {AdminManagementService} from '../../services/admin-management.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-provider',
  standalone: true,
  imports: [
    SidebarComponent,
    NgForOf,
    NgClass,
    NgIf,
    RouterLink,
    FormsModule
  ],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss'
})
export class ProviderComponent implements OnInit {
  constructor(private readonly dialog: MatDialog) { }

  private readonly adminService = inject(AdminManagementService);
  readonly providersList: WritableSignal<any[]> = this.adminService.providersList;

  // Signals for filtering
  searchTerm = signal('');
  showActive = signal(true);
  showInactive = signal(true);

  filteredProviders = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const activeFilter = this.showActive();
    const inactiveFilter = this.showInactive();

    return this.providersList().filter(provider => {
      const matchesSearch = !term ||
        (provider.name?.toLowerCase().includes(term) ||
          (provider.lastName?.toLowerCase().includes(term)) ||
          (provider.user?.email?.toLowerCase().includes(term)) ||
          (provider.occupied_job?.toLowerCase().includes(term)) ||
          (provider.address?.toLowerCase().includes(term)))

      const isActive = provider.user?.isActive ?? true;
      const matchesActiveFilter =
        (isActive && activeFilter) || (!isActive && inactiveFilter);

      return matchesSearch && matchesActiveFilter;
    });
  });

  ngOnInit(): void {
    this.adminService.getProviders().subscribe(console.log);
  }

  updateSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  toggleActiveFilter(checked: boolean) {
    this.showActive.set(checked);
  }

  toggleInactiveFilter(checked: boolean) {
    this.showInactive.set(checked);
  }
}
