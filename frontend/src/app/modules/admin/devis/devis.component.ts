import { Component, inject, OnInit, signal } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminManagementService } from '../services/admin-management.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-devis',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SidebarComponent,
    NgForOf
  ],
  templateUrl: './devis.component.html',
  styleUrl: './devis.component.scss'
})
export class ADevisComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminManagementService);
  private router = inject(Router);

  devisList = this.adminService.devisList;
  isEditing = signal(false);
  currentDevisId = signal<string | null>(null);

  devisForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    maxEmployees: [0, [Validators.required, Validators.min(1)]],
    includedActivities: [0, [Validators.required, Validators.min(0)]],
    includedAppointments: [0, [Validators.required, Validators.min(0)]],
    additionalAppointmentPrice: [0, [Validators.required, Validators.min(0)]],
    chatbotAccess: ['limited', Validators.required],
    chatbotQuestions: [0, [Validators.required, Validators.min(0)]],
    weeklyAdvice: [false],
    personalizedAdvice: [false],
    active: [true]
  });

  ngOnInit(): void {
    this.loadDevis();
  }

  loadDevis(): void {
    this.adminService.getAllDevis().subscribe();
  }

  onSubmit(): void {
    if (this.devisForm.invalid) return;

    const devisData = {
      ...this.devisForm.value,
      id: this.currentDevisId() || undefined
    };

    const operation = this.isEditing()
      ? this.adminService.updateDevis(devisData)
      : this.adminService.createDevis(devisData);

    operation.subscribe({
      next: () => {
        this.loadDevis();
        this.resetForm();
      },
      error: (err) => console.error('Error saving devis:', err)
    });
  }

  editDevis(devis: any): void {
    this.currentDevisId.set(devis.id);
    this.isEditing.set(true);
    this.devisForm.patchValue({
      ...devis,
      chatbotAccess: devis.chatbotAccess === 'unlimited' ? 'unlimited' : 'limited'
    });
  }

  deleteDevis(devisId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      this.adminService.deleteDevis(devisId).subscribe({
        next: () => this.loadDevis(),
        error: (err) => console.error('Error deleting devis:', err)
      });
    }
  }

  resetForm(): void {
    this.devisForm.reset({
      price: 0,
      maxEmployees: 0,
      includedActivities: 0,
      includedAppointments: 0,
      additionalAppointmentPrice: 0,
      chatbotAccess: 'limited',
      chatbotQuestions: 0,
      weeklyAdvice: false,
      personalizedAdvice: false,
      active: true
    });
    this.isEditing.set(false);
    this.currentDevisId.set(null);
  }

  useDevis(devis: any): void {
    this.router.navigate(['/pricing'], { state: { devis } });
  }
}
