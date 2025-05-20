import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';



@Component({
  selector: 'app-main-header',
  standalone: true,
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  imports: [CommonModule, RouterLink]
})
export class MainHeaderComponent {
  isScrolled = false;
  lastScrollPosition = 0;

  // Utiliser HostListener pour écouter l'événement de scroll
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > 50) {
      this.isScrolled = true;  // pour cacher la navbar
    }
    else if (currentScrollPosition < this.lastScrollPosition) {
      this.isScrolled = false;  // pour afficher la navbar
    }

    this.lastScrollPosition = currentScrollPosition;
  }
}
