import { Component } from '@angular/core';

@Component({
  selector: 'app-c-navbare',
  standalone: true,
  imports: [],
  templateUrl: './c-navbare.component.html',
  styleUrl: './c-navbare.component.scss'
})
export class CNavbareComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
