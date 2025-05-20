import { Component } from '@angular/core';
import { MainHeaderComponent } from '../../../shared/ layout/header/main-header.component';
import { FooterComponent } from '../../../shared/ layout/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MainHeaderComponent, FooterComponent],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent { }
