import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workshop-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss']
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

  ngOnInit(): void {
    this.loading = true;
    this.dataService.getWorkshops().subscribe({
      next: (workshops) => {
        this.regularWorkshops = workshops.filter(w => w.type === 'workshop');
        this.malateliers = workshops.filter(w => w.type === 'malatelier');
        this.individuelleAnfragen = workshops.filter(w => w.type === 'individuelleAnfrage');
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Fehler beim Laden der Workshops.';
        this.loading = false;
      }
    });
  }

  filterWorkshops(): void {
    this.dataService.getWorkshops().subscribe(workshops => {
      const filtered = workshops.filter(w =>
        w.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        w.shortDescription.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.regularWorkshops = filtered.filter(w => w.type === 'workshop');
      this.malateliers = filtered.filter(w => w.type === 'malatelier');
      this.individuelleAnfragen = filtered.filter(w => w.type === 'individuelleAnfrage');
    });
  }

  goToDetail(workshop: Workshop): void {
    if (workshop.type === 'individuelleAnfrage') {
      this.router.navigate(['/contact']);
    } else {
      this.router.navigate(['/workshop', workshop.id]);
    }
  }
}
