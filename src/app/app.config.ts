import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withDebugTracing, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHighlightOptions} from 'ngx-highlightjs';
import {provideHttpClient} from '@angular/common/http';
import {provideClientHydration} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes,
      withDebugTracing(),
      withComponentInputBinding(),
      withRouterConfig({paramsInheritanceStrategy: 'always'})), provideClientHydration(), provideAnimationsAsync(),
    provideHttpClient(),
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
    }),
  ]

};
