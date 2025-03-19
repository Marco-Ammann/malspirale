import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin-guard.guard';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { ImpressumComponent } from './components/impressum/impressum.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    title: 'Malspirale - Ausdrucksmalen mit Isabel Kunz in Riggisberg'
  },
  {
    path: 'datenschutz',
    component: DatenschutzComponent,
    title: 'Datenschutzerklärung | Malspirale'
  },
  {
    path: 'impressum',
    component: ImpressumComponent,
    title: 'Impressum | Malspirale'
  },

  // ** Öffentliche Seiten **
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    title: 'Home | Malspirale'
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./components/gallery/gallery.component').then(
        (m) => m.GalleryComponent
      ),
    title: 'Galerie - Isabel\'s Kunstwelt | Malspirale'
  },
  {
    path: 'gallery/photographer',
    loadComponent: () =>
      import(
        './components/gallery/photographer-gallery/photographer-gallery.component'
      ).then((m) => m.PhotographerGalleryComponent),
    title: 'Fotografie von Shiva Ludi | Malspirale',
  },
  {
    path: 'workshops',
    loadComponent: () =>
      import('./components/workshop-list/workshop-list.component').then(
        (m) => m.WorkshopListComponent
      ),
    title: 'Workshops | Malspirale'
  },
  {
    path: 'workshop/:id',
    loadComponent: () =>
      import(
        './components/workshop-list/workshop-detail/workshop-detail.component'
      ).then((m) => m.WorkshopDetailComponent),
    title: 'Workshop Details | Malspirale'
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
    title: 'Kontakt | Malspirale'
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (m) => m.AboutComponent
      ),
    title: 'Über mich | Malspirale'
  },

  // ** Philosophie-Bereich **
  {
    path: 'philosophie',
    loadComponent: () =>
      import('./components/philosophie/philosophie.component').then(
        (m) => m.PhilosophieComponent
      ),
    title: 'Philosophie | Malspirale',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'farben' },
      {
        path: 'farben',
        loadComponent: () =>
          import('./components/philosophie/farben/farben.component').then(
            (m) => m.FarbenComponent
          ),
        title: 'Philosophie - Farben | Malspirale'
      },
      {
        path: 'geschichten',
        loadComponent: () =>
          import(
            './components/philosophie/geschichten/geschichten.component'
          ).then((m) => m.GeschichtenComponent),
        title: 'Philosophie - Geschichten | Malspirale'
      },
      {
        path: 'resonance-farben',
        loadComponent: () =>
          import(
            './components/philosophie/resonance-colors/resonance-colors.component'
          ).then((m) => m.ResonanceColorsComponent),
        title: 'Philosophie - Resonance Colors | Malspirale'
      },
    ],
  },

  // ** Auth & Registrierung **
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login | Malspirale',
    data: {
      reuse: false,
      skipLocationChange: false,
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Registrieren | Malspirale',
    data: {
      reuse: false,
      skipLocationChange: false,
    },
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
    title: 'Passwort vergessen | Malspirale',
    data: {
      reuse: false,
      skipLocationChange: false,
    },
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
    title: 'Passwort zurücksetzen | Malspirale',
    data: {
      reuse: false,
      skipLocationChange: false,
    },
  },
  {
    path: 'user-dashboard',
    loadComponent: () =>
      import('./components/user-dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
    title: 'Benutzer Dashboard | Malspirale',
    canActivate: [AuthGuard], // Schutz nur für eingeloggte Benutzer
  },

  // ** Admin-Bereich (Nur für Admins) **
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
    title: 'Admin Dashboard | Malspirale',
    canActivate: [AdminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/admin/admin-users/admin-users.component').then(
            (m) => m.AdminUsersComponent
          ),
        title: 'Admin - Benutzer | Malspirale'
      },
      {
        path: 'workshops',
        loadComponent: () =>
          import(
            './components/admin/admin-workshops/admin-workshops.component'
          ).then((m) => m.AdminWorkshopsComponent),
        title: 'Admin - Workshops | Malspirale'
      },
      {
        path: 'content',
        loadComponent: () =>
          import(
            './components/admin/admin-content/admin-content.component'
          ).then((m) => m.AdminContentComponent),
        title: 'Admin - Inhalte | Malspirale'
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import(
            './components/admin/admin-gallery/admin-gallery.component'
          ).then((m) => m.AdminGalleryComponent),
        title: 'Admin - Galerie | Malspirale'
      },
      {
        path: 'reports',
        loadComponent: () =>
          import(
            './components/admin/admin-reports/admin-reports.component'
          ).then((m) => m.AdminReportsComponent),
        title: 'Admin - Berichte | Malspirale'
      },
      { path: '**', redirectTo: 'users' },
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];
