import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  loading = false;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit() {
    this.loadWorkshop();
  }

  async loadWorkshop() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Kein Workshop gefunden.';
      this.loading = false;
      return;
    }

    try {
      this.workshop = await this.dataService.getWorkshop(id);
      if (!this.workshop) this.errorMessage = 'Workshop nicht gefunden.';
    } catch (error) {
      this.errorMessage = 'Fehler beim Laden des Workshops.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  getWeekday(day: number): string {
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return weekdays[day] ?? 'Unbekannt';
  }
}
