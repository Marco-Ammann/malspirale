import { Component, OnInit } from '@angular/core';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workshop-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss'],
})
export class WorkshopListComponent implements OnInit {
  workshops: Workshop[] = [];
  filteredWorkshops: Workshop[] = [];
  loading = false;
  errorMessage: string | null = null;
  searchTerm = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.loadWorkshops();
  }

  async loadWorkshops() {
    this.loading = true;
    try {
      this.workshops = await this.dataService.getAllWorkshops();
      this.filteredWorkshops = this.workshops;
    } catch (error) {
      this.errorMessage = 'Fehler beim Laden der Workshops.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  filterWorkshops() {
    this.filteredWorkshops = this.workshops.filter((workshop) =>
      workshop.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getRecurringLabel(workshop: Workshop): string {
    return workshop.recurring && workshop.recurringDay !== undefined ? `Wöchentlich am ${this.getWeekday(workshop.recurringDay)}` : 'Einmalig';
  }

  getWeekday(day: number): string {
    const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    return weekdays[day] ?? 'Unbekannt';
  }

  goToDetail(workshop: Workshop) {
    this.router.navigate(['/workshop', workshop.id]);
  }
}
