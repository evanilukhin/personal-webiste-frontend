import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMarkdown, MarkdownService, MARKED_OPTIONS } from 'ngx-markdown';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    provideMarkdown(),
    {
      provide: MARKED_OPTIONS,
      useValue: {
        gfm: true,
        breaks: true,
        pedantic: false
      }
    },
    MarkdownService
  ]
};
