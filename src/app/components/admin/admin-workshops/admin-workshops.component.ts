import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Workshop } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'app-admin-workshops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.scss'],
})
export class AdminWorkshopsComponent implements OnInit {
  workshops: any[] = [];
  title: string = '';
  description: string = '';
  date: string = '';
  selectedWorkshopId: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.dataService.getWorkshops().subscribe((workshops) => {
      this.workshops = workshops;
    });
  }

  createWorkshop(): void {
    if (!this.title || !this.description || !this.date) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    const workshopData: Omit<Workshop, 'id'> = {
      title: this.title,
      description: this.description,
      date: this.date,
      maxParticipants: 10,
      availableSlots: 10,
      location: 'Noch nicht festgelegt',
      participants: []
    };

    if (this.selectedWorkshopId) {
      this.dataService.updateWorkshop(this.selectedWorkshopId, workshopData).then(() => {
        alert('Workshop erfolgreich aktualisiert!');
        this.resetForm();
      });
    } else {
      this.dataService.createWorkshop(workshopData).then(() => {
        alert('Workshop erfolgreich erstellt!');
        this.resetForm();
      });
    }
  }

  editWorkshop(workshop: Workshop): void {
    this.selectedWorkshopId = workshop.id;
    this.title = workshop.title;
    this.description = workshop.description;
    this.date = workshop.date;
  }

  deleteWorkshop(id: string): void {
    if (confirm('Möchtest du diesen Workshop wirklich löschen?')) {
      this.dataService.deleteWorkshop(id);
    }
  }

  resetForm(): void {
    this.selectedWorkshopId = null;
    this.title = '';
    this.description = '';
    this.date = '';
  }
}