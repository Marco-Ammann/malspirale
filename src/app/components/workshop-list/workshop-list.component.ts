import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-workshop-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss'],
})
export class WorkshopListComponent implements OnInit {
  private dataService = inject(DataService);
  public router = inject(Router);
  searchTerm = '';
  loading = false;
  errorMessage = '';

  regularWorkshops: Workshop[] = [];
  malateliers: Workshop[] = [];
  individuelleAnfragen: Workshop[] = [];

  imageRatios: {[id: string]: number} = {};
  
  constructor() {}

  ngOnInit(): void {
    this.loading = true;
    this.dataService.getWorkshops().subscribe({
      next: (workshops: Workshop[]) => {
        // Filter nur veröffentlichte Workshops
        const publishedWorkshops = workshops.filter(w => 
          w.status === 'published' || w.status === undefined);
        
        this.regularWorkshops = publishedWorkshops.filter((w) => w.type === 'workshop');
        this.malateliers = publishedWorkshops.filter((w) => w.type === 'malatelier');
        this.individuelleAnfragen = publishedWorkshops.filter(
          (w) => w.type === 'individuelleAnfrage'
        );
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Fehler beim Laden der Workshops.';
        this.loading = false;
      },
    });
  }

  filterWorkshops(): void {
    this.dataService.getWorkshops().subscribe((workshops: Workshop[]) => {
      // Filter nur veröffentlichte Workshops
      const publishedWorkshops = workshops.filter(w => 
        w.status === 'published' || w.status === undefined);
        
      const filtered = publishedWorkshops.filter(
        (w) =>
          w.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (w.shortDescription && w.shortDescription
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()))
      );
      
      this.regularWorkshops = filtered.filter((w) => w.type === 'workshop');
      this.malateliers = filtered.filter((w) => w.type === 'malatelier');
      this.individuelleAnfragen = filtered.filter(
        (w) => w.type === 'individuelleAnfrage'
      );
    });
  }

  goToDetail(workshop: Workshop): void {
    this.router.navigate(['/workshop', workshop.id]);
  }

  // Wird beim Laden des Bildes aufgerufen
  onImageLoad(workshop: Workshop, event: Event): void {
    workshop.imageLoaded = true;
    
    // Bildverhältnis speichern
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (workshop.id) {
        this.imageRatios[workshop.id] = ratio;
      }
    }
  }

  // Prüft, ob ein Bild im Portrait-Format ist
  isPortraitImage(workshop: Workshop): boolean {
    if (workshop.id && this.imageRatios[workshop.id]) {
      return this.imageRatios[workshop.id] < 0.8; // Ratio kleiner als 0.8 = Portrait
    }
    return false; // Standardmäßig Landscape annehmen
  }
}