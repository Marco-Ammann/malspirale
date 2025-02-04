import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workshop } from '../../../core/interfaces/interfaces';
import { DataService } from '../../../core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workshop-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss'],
})
export class WorkshopDetailComponent implements OnInit {
  workshop: Workshop | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWorkshop();
  }

  async loadWorkshop(): Promise<void> {
    const workshopId = this.route.snapshot.paramMap.get('id');
    if (!workshopId) {
      this.errorMessage = 'Workshop-ID nicht gefunden.';
      return;
    }

    try {
      this.workshop = await this.dataService.getWorkshopById(workshopId);
      this.loading = false;
    } catch (error) {
      this.errorMessage = 'Fehler beim Laden des Workshops.';
      this.loading = false;
    }
  }

  registerForWorkshop(): void {
    // Implementiere später eine Firebase-Funktion für Workshop-Anmeldungen
    alert('Anmeldefunktion folgt bald.');
  }
}
