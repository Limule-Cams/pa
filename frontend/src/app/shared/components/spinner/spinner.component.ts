import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {

  @Input() message?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() overlay = false;

  get sizeClass(): string {
    return `spinner-${this.size}`;
  }

}
