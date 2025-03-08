import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Workshop } from '../../../core/interfaces/interfaces';
import { DataService } from '../../../core/services/data.service';
import { WorkshopWizardComponent } from './workshop-wizard/workshop-wizard.component';

@Component({
  selector: 'app-admin-workshops',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkshopWizardComponent],
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.scss'],
})
export class AdminWorkshopsComponent implements OnInit {
  workshops: Workshop[] = [];
  filteredWorkshops: Workshop[] = [];
  loading = true;
  searchTerm = '';
  typeFilter = 'all';
  sortBy = 'dateDesc';

  showWorkshopWizard = false;
  selectedWorkshopId: string | null = null;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Prüfe URL-Parameter
    this.route.queryParams.subscribe((params) => {
      if (params['action'] === 'new') {
        this.createWorkshop();
      } else if (params['id']) {
        this.editWorkshop({ id: params['id'] } as Workshop);
      } else {
        this.loadWorkshops();
      }
    });
  }

  loadWorkshops(): void {
    this.loading = true;
    this.dataService.getWorkshops().subscribe({
      next: (workshops: Workshop[]) => {
        this.workshops = workshops;
        this.filterWorkshops();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Fehler beim Laden der Workshops', err);
        this.loading = false;
      },
    });
  }

  filterWorkshops(): void {
    // Filtern nach Suchbegriff und Typ
    this.filteredWorkshops = this.workshops.filter((workshop) => {
      const matchesSearchTerm =
        this.searchTerm === '' ||
        workshop.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        workshop.shortDescription
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesType =
        this.typeFilter === 'all' || workshop.type === this.typeFilter;

      return matchesSearchTerm && matchesType;
    });

    // Sortieren
    this.filteredWorkshops.sort((a, b) => {
      if (this.sortBy === 'dateAsc') {
        return this.compareWorkshopDates(a, b);
      } else if (this.sortBy === 'dateDesc') {
        return this.compareWorkshopDates(b, a);
      } else if (this.sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });
  }

  compareWorkshopDates(a: Workshop, b: Workshop): number {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.typeFilter = 'all';
    this.sortBy = 'dateDesc';
    this.filterWorkshops();
  }

  createWorkshop(): void {
    this.selectedWorkshopId = null;
    this.showWorkshopWizard = true;
  }

  editWorkshop(workshop: Workshop): void {
    if (workshop.id) {
      this.selectedWorkshopId = workshop.id;
      this.showWorkshopWizard = true;
    }
  }

  duplicateWorkshop(workshop: Workshop): void {
    // Erstelle eine Kopie ohne ID
    const duplicatedWorkshop: Workshop = { ...workshop };
    delete duplicatedWorkshop.id;

    // Füge ein klares "(Kopie)" zum Titel hinzu
    const timestamp = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
    duplicatedWorkshop.title = `${duplicatedWorkshop.title} (Kopie ${timestamp})`;

    // Als Entwurf speichern
    duplicatedWorkshop.status = 'draft';

    // Speichere als neuen Workshop
    this.dataService.saveWorkshop(duplicatedWorkshop).then((newId) => {
      this.loadWorkshops();
    });
  }

  async deleteWorkshop(id?: string): Promise<void> {
    if (!id) return;

    if (confirm('Möchtest du diesen Workshop wirklich löschen?')) {
      try {
        await this.dataService.deleteWorkshop(id);
        this.workshops = this.workshops.filter((w) => w.id !== id);
        this.filterWorkshops();
      } catch (error) {
        console.error('Fehler beim Löschen des Workshops', error);
      }
    }
  }

  isWorkshopActive(workshop: Workshop): boolean {
    if (workshop.status === 'draft') return false;
    if (workshop.type !== 'workshop') return true; // Malateliers und Anfragen sind immer aktiv

    // Für Termine mit Datum: prüfen ob Datum in der Zukunft liegt
    if (workshop.date) {
      const workshopDate = new Date(workshop.date);
      const today = new Date();
      // Setze Zeit auf 00:00:00 für fairen Vergleich
      today.setHours(0, 0, 0, 0);
      return workshopDate >= today;
    }

    return true;
  }

  isWorkshopPast(workshop: Workshop): boolean {
    if (workshop.type !== 'workshop') return false; // Nur für Einzeltermine relevant
    if (!workshop.date) return false;

    const workshopDate = new Date(workshop.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return workshopDate < today;
  }

  closeWorkshopWizard(): void {
    this.showWorkshopWizard = false;
    this.selectedWorkshopId = null;
    this.loadWorkshops(); // Neu laden, um Änderungen zu sehen
  }
}
