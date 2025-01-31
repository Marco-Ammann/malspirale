import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./components/gallery/gallery.component').then(
        (m) => m.GalleryComponent
      ),
  },
  {
    path: 'workshops',
    loadComponent: () =>
      import('./components/workshop-list/workshop-list.component').then(
        (m) => m.WorkshopListComponent
      ),
  },
  {
    path: 'workshops/:id',
    loadComponent: () =>
      import(
        './components/workshop-list/workshop-detail/workshop-detail.component'
      ).then((m) => m.WorkshopDetailComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
  {
    path: 'philosophie',
    children: [
      {
        path: 'farben',
        loadComponent: () =>
          import('./components/philosophie/farben/farben.component').then(
            (m) => m.FarbenComponent
          ),
      },
      {
        path: 'geschichten',
        loadComponent: () =>
          import(
            './components/philosophie/geschichten/geschichten.component'
          ).then((m) => m.GeschichtenComponent),
      },
      {
        path: 'resonance-farben',
        loadComponent: () =>
          import(
            './components/philosophie/resonance-colors/resonance-colors.component'
          ).then((m) => m.ResonanceColorsComponent),
      },
      {
        path: 'malgeschichten',
        loadComponent: () =>
          import(
            './components/philosophie/malgeschichten/malgeschichten.component'
          ).then((m) => m.MalgeschichtenComponent),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
