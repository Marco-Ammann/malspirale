import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { Workshop } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'app-admin-workshops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.scss'],
})
export class AdminWorkshopsComponent implements OnInit {
  workshops: Workshop[] = [];
  title: string = '';
  description: string = '';
  date: string = '';
  maxParticipants: number = 10;
  availableSlots: number = 10;
  location: string = '';
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
    if (!this.title || !this.description || !this.date || !this.maxParticipants || !this.availableSlots || !this.location) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    const workshopData: Omit<Workshop, 'id'> = {
      title: this.title,
      description: this.description,
      date: this.date,
      maxParticipants: this.maxParticipants,
      availableSlots: this.availableSlots,
      location: this.location,
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
    this.maxParticipants = workshop.maxParticipants;
    this.availableSlots = workshop.availableSlots;
    this.location = workshop.location;
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
    this.maxParticipants = 10;
    this.availableSlots = 10;
    this.location = '';
  }
}
