import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import {provideAnimations} from '@angular/platform-browser/animations';
import {httpErrorInterceptor} from './core/interceptors/http-error.interceptor';
import {provideMarkdown} from 'ngx-markdown';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'fr'
      })
    ),
    provideMarkdown(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authInterceptor, httpErrorInterceptor,
    ]))
  ]
};
