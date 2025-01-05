import { Routes } from '@angular/router';
import { GalleryComponent } from './components/gallery/gallery.component';
import { WorkshopListComponent } from './components/workshop-list/workshop-list.component';
import { ContactComponent } from './components/contact/contact.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { WorkshopDetailComponent } from './components/workshop-list/workshop-detail/workshop-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/workshops', pathMatch: 'full' },
  { path: 'workshops', component: WorkshopListComponent },
  { path: 'workshops/:id', component: WorkshopDetailComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: NotFoundComponent },
];