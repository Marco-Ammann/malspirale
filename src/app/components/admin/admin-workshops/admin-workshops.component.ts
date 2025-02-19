import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../../../core/interfaces/interfaces';
import { DataService } from '../../../core/services/data.service';
import { StorageService } from '../../../core/services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-workshops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.scss']
})
export class AdminWorkshopsComponent implements OnInit {
  private dataService = inject(DataService);
  private router = inject(Router);
  private storageService = inject(StorageService);

  workshops: Workshop[] = [];
  selectedWorkshop: Workshop | null = null;
  errorMessage = '';

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.dataService.getWorkshops().subscribe({
      next: (data) => { this.workshops = data; },
      error: (err) => { console.error('Fehler beim Laden der Angebote', err); }
    });
  }

  createWorkshop(): void {
    this.selectedWorkshop = {
      title: '',
      shortDescription: '',
      description: '',
      location: '',
      date: '',
      price: 0,
      imageUrl: '',
      startTime: '',
      endTime: '',
      maxParticipants: undefined,
      availableSlots: undefined,
      frequency: '',
      contactEmail: '',
      type: 'workshop'
    };
  }

  editWorkshop(workshop: Workshop): void {
    this.selectedWorkshop = { ...workshop };
  }

  async deleteWorkshop(id?: string): Promise<void> {
    if (!id) return;
    try {
      await this.dataService.deleteWorkshop(id);
      this.loadWorkshops();
    } catch (error) {
      console.error('Fehler beim Löschen des Angebots', error);
    }
  }

  async saveWorkshop(): Promise<void> {
    if (!this.selectedWorkshop) return;
    try {
      if (this.selectedWorkshop.type === 'workshop' && !this.selectedWorkshop.date) {
        this.errorMessage = 'Bitte geben Sie ein Datum für den Workshop an.';
        return;
      }
      if (this.selectedWorkshop.type === 'malatelier' && !this.selectedWorkshop.frequency) {
        this.errorMessage = 'Bitte geben Sie an, wie oft das Malatelier stattfindet.';
        return;
      }
      if (this.selectedWorkshop.id) {
        await this.dataService.updateWorkshop(this.selectedWorkshop);
      } else {
        const newId = await this.dataService.saveWorkshop(this.selectedWorkshop);
        this.selectedWorkshop.id = newId;
      }
      this.selectedWorkshop = null;
      this.loadWorkshops();
    } catch (error) {
      console.error('Fehler beim Speichern des Angebots', error);
      this.errorMessage = 'Fehler beim Speichern des Angebots.';
    }
  }

  cancelEdit(): void {
    this.selectedWorkshop = null;
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.storageService.uploadFile(file).then(url => {
        if (this.selectedWorkshop) {
          this.selectedWorkshop.imageUrl = url;
        }
      }).catch(err => {
        console.error('Fehler beim Bild-Upload', err);
      });
    }
  }
}
