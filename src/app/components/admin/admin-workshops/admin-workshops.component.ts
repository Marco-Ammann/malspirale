import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { Workshop } from '../../../core/interfaces/interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-admin-workshops',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.scss']
})
export class AdminWorkshopsComponent implements OnInit {
  workshops: Workshop[] = [];
  selectedWorkshop: Workshop | null = null;
  errorMessage: string = '';

  // Konfiguration für den Quill-Editor
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean']
    ]
  };

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.dataService.getWorkshops().subscribe({
      next: (data: Workshop[]) => { this.workshops = data; },
      error: (err: any) => { console.error('Fehler beim Laden der Workshops', err); }
    });
  }

  createWorkshop(): void {
    this.selectedWorkshop = {
      type: 'workshop',
      title: '',
      shortDescription: '',
      description: '',
      location: '',
      date: '',
      price: 0,
      startTime: '',
      endTime: '',
      maxParticipants: undefined,
      availableSlots: undefined,
      frequency: '',
      contactEmail: '',
      imageUrl: ''
    };
  }

  editWorkshop(workshop: Workshop): void {
    this.selectedWorkshop = { ...workshop };
  }

  async deleteWorkshop(id?: string): Promise<void> {
    if (!id) return;
    if (confirm('Möchtest du diesen Workshop wirklich löschen?')) {
      try {
        await this.dataService.deleteWorkshop(id);
        this.workshops = this.workshops.filter(w => w.id !== id);
      } catch (error) {
        console.error('Fehler beim Löschen des Workshops', error);
      }
    }
  }

  async saveWorkshop(): Promise<void> {
    if (!this.selectedWorkshop) return;
    
    // Bereinige Texte, um nicht-brechende Leerzeichen zu entfernen
    this.selectedWorkshop.shortDescription = this.selectedWorkshop.shortDescription.replace(/&nbsp;/g, ' ');
    this.selectedWorkshop.description = this.selectedWorkshop.description.replace(/&nbsp;/g, ' ');
    
    try {
      if (this.selectedWorkshop.id) {
        await this.dataService.updateWorkshop(this.selectedWorkshop);
      } else {
        const newId = await this.dataService.saveWorkshop(this.selectedWorkshop);
        this.selectedWorkshop.id = newId;
      }
      this.selectedWorkshop = null;
      this.loadWorkshops();
    } catch (error) {
      console.error('Fehler beim Speichern des Workshops', error);
      this.errorMessage = 'Fehler beim Speichern des Workshops.';
    }
  }

  cancelEdit(): void {
    this.selectedWorkshop = null;
  }

  async handleImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    try {
      const url = await this.storageService.uploadFile(file);
      if (this.selectedWorkshop) {
        this.selectedWorkshop.imageUrl = url;
      }
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes', error);
    }
  }
}
