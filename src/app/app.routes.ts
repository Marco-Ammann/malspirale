import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin-guard.guard';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ImpressumComponent } from './components/impressum/impressum.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'impressum', component: ImpressumComponent },

  // ** Öffentliche Seiten **
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./components/gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'workshops',
    loadComponent: () =>
      import('./components/workshop-list/workshop-list.component').then((m) => m.WorkshopListComponent),
  },
  {
    path: 'workshop/:id',  // ⬅️ Hier von 'workshops/:id' zu 'workshop/:id' ändern
    loadComponent: () =>
      import('./components/workshop-list/workshop-detail/workshop-detail.component')
        .then((m) => m.WorkshopDetailComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then((m) => m.AboutComponent),
  },

  // ** Philosophie-Bereich **
  {
    path: 'philosophie',
    loadComponent: () =>
      import('./components/philosophie/philosophie.component').then((m) => m.PhilosophieComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'farben' }, // Standardseite setzen
      {
        path: 'farben',
        loadComponent: () =>
          import('./components/philosophie/farben/farben.component').then((m) => m.FarbenComponent),
      },
      {
        path: 'geschichten',
        loadComponent: () =>
          import('./components/philosophie/geschichten/geschichten.component').then((m) => m.GeschichtenComponent),
      },
      {
        path: 'resonance-farben',
        loadComponent: () =>
          import('./components/philosophie/resonance-colors/resonance-colors.component').then((m) => m.ResonanceColorsComponent),
      },
    ],
  },

  // ** Auth & Registrierung **
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'user-dashboard',
    loadComponent: () =>
      import('./components/user-dashboard/user-dashboard.component').then((m) => m.UserDashboardComponent),
    canActivate: [AuthGuard], // Schutz nur für eingeloggte Benutzer
  },

  // ** Admin-Bereich (Nur für Admins) **
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [AdminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: '' },
      { path: 'users', loadComponent: () => import('./components/admin/admin-users/admin-users.component').then((m) => m.AdminUsersComponent) },
      { path: 'workshops', loadComponent: () => import('./components/admin/admin-workshops/admin-workshops.component').then((m) => m.AdminWorkshopsComponent) },
      { path: 'content', loadComponent: () => import('./components/admin/admin-content/admin-content.component').then((m) => m.AdminContentComponent) },
      { path: 'gallery', loadComponent: () => import('./components/admin/admin-gallery/admin-gallery.component').then((m) => m.AdminGalleryComponent) },
      { path: 'reports', loadComponent: () => import('./components/admin/admin-reports/admin-reports.component').then((m) => m.AdminReportsComponent) },
      { path: '**', redirectTo: 'users' },
    ],
  },
];
