import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { 
  PreloadAllModules, 
  provideRouter, 
  withPreloading,
  withHashLocation, // Remove this if you're using PathLocationStrategy
  RouterStateSnapshot,
  withDebugTracing // Only for debugging
} from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      // Enable this for easier debugging if needed
      // withDebugTracing(),
      // Remove withDisabledInitialNavigation() as it may cause issues with routing
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};