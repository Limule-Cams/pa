import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly defaultLanguage = 'fr';
  private readonly supportedLanguages = ['en', 'fr'];

  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    this.translate.setDefaultLang(this.defaultLanguage);

    const browserLang = this.translate.getBrowserLang();
    const savedLanguage = localStorage.getItem('language');

    if (browserLang != null) {
      const languageToUse = savedLanguage ||
        (this.supportedLanguages.includes(browserLang) ? browserLang : this.defaultLanguage);
      this.translate.use(languageToUse);
    }
  }

  switchLanguage(language: string): void {
    if (this.supportedLanguages.includes(language)) {
      this.translate.use(language);
      localStorage.setItem('language', language);
    }
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }
}
