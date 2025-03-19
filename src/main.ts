import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Ensure we're importing routes from app.routes.ts, not routes.ts
import { routes } from './app/app.routes';

// Update appConfig if necessary to use the correct routes

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

