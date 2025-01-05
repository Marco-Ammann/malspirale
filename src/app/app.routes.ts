import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
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
    path: 'gallery',
    loadComponent: () =>
      import('./components/gallery/gallery.component').then(
        (m) => m.GalleryComponent
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
