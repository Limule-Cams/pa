import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../../../core/services/language.service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-navbare',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    TranslatePipe
  ],
  templateUrl: './navbare.component.html',
  styleUrl: './navbare.component.scss'
})
export class NavbareComponent implements OnInit {
  currentLanguage!: string;
  supportedLanguages!: string[];

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.supportedLanguages = this.languageService.getSupportedLanguages();
  }

  onLanguageChange(): void {
    this.languageService.switchLanguage(this.currentLanguage);
  }

}
