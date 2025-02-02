import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Workshop } from '../../../core/interfaces/interfaces';
import { DataService } from '../../../core/services/data.service';
import { StorageService } from '../../../core/services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-workshops',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.scss'],
})
export class AdminWorkshopsComponent implements OnInit {
  workshopForm: FormGroup;
  workshops: Workshop[] = [];
  loading = false;
  errorMessage: string | null = null;
  editMode = false;
  editingWorkshopId: string | null = null;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  imagePositions = ['oben', 'unten', 'links', 'rechts', 'links oben', 'rechts oben', 'zentriert'];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private storageService: StorageService
  ) {
    this.workshopForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      shortDescription: ['', Validators.required],
      longDescription: [''],
      date: ['', Validators.required],
      startTime: [''],
      endTime: [''],
      price: ['', [Validators.pattern('^[0-9]+$')]],
      maxParticipants: ['', [Validators.pattern('^[0-9]+$')]],
      availableSlots: ['', Validators.required],
      image: [''],
      location: ['', Validators.required],
      recurring: [false],
      recurringWeek: [null],
      recurringDay: [null],
      imagePosition: ['zentriert'], // Standardwert
    });
  }

  ngOnInit() {
    this.loadWorkshops();
  }

  async loadWorkshops() {
    this.loading = true;
    try {
      this.workshops = await this.dataService.getAllWorkshops();
    } catch (error) {
      this.errorMessage = 'Fehler beim Laden der Workshops.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async saveWorkshop() {
    if (this.workshopForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;
    let workshopData = this.workshopForm.value as Workshop;

    try {
      if (this.imageFile) {
        const imageUrl = await this.storageService.uploadImage(this.imageFile);
        workshopData.image = imageUrl;
      }

      if (this.editMode && this.editingWorkshopId) {
        await this.dataService.updateWorkshop(this.editingWorkshopId, workshopData);
      } else {
        await this.dataService.addWorkshop(workshopData);
      }

      this.resetForm();
      this.loadWorkshops();
    } catch (error) {
      this.errorMessage = 'Fehler beim Speichern des Workshops.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.imageFile = target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  editWorkshop(workshop: Workshop) {
    this.workshopForm.patchValue({
      ...workshop,
      imagePosition: workshop.imagePosition || 'zentriert', // Standardwert setzen
    });
    this.editMode = true;
    this.editingWorkshopId = workshop.id!;
    this.imagePreview = workshop.image ?? null;
  }

  async deleteWorkshop(id: string) {
    if (!confirm('Möchtest du diesen Workshop wirklich löschen?')) return;
    this.loading = true;
    try {
      await this.dataService.deleteWorkshop(id);
      this.loadWorkshops();
    } catch (error) {
      this.errorMessage = 'Fehler beim Löschen des Workshops.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  resetForm() {
    this.workshopForm.reset();
    this.editMode = false;
    this.editingWorkshopId = null;
    this.imageFile = null;
    this.imagePreview = null;
  }
}
