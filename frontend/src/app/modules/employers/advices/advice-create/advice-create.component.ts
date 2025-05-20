import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbareComponent } from '../../shared/navbare/navbare.component';
import {EmployeeService} from '../../employee.service';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-advice-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MarkdownModule,
    NavbareComponent,
    NgIf
  ],
  providers: [provideMarkdown()],
  templateUrl: './advice-create.component.html',
  styleUrl: './advice-create.component.scss'
})
export class AdviceCreateComponent {
  adviceForm: FormGroup;
  previewMode = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
  ) {
    this.adviceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  get title() { return this.adviceForm.get('title'); }
  get content() { return this.adviceForm.get('content'); }

  togglePreview() {
    this.previewMode = !this.previewMode;
  }

  onSubmit() {
    if (this.adviceForm.valid) {
      const data = this.adviceForm.value;
      const payload = {
        title: data.title,
        summary: data.content,
      }
      this.employeeService.createAdvice$(payload).subscribe(() => {
        this.router.navigateByUrl('/employer/advices');
      });
    } else {
      this.adviceForm.markAllAsTouched();
    }
  }

}
