import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Workshop } from '../../../core/interfaces/interfaces';
import { DataService } from '../../../core/services/data.service';
import { StorageService } from '../../../core/services/storage.service';


@Component({
  selector: 'app-admin-workshops',
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AdminWorkshopsComponent implements OnInit {
  workshops: Workshop[] = [];
  loading = false;
  errorMessage = '';
  workshopForm: FormGroup;
  editMode = false;
  selectedWorkshop: Workshop | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(private dataService: DataService, private storageService: StorageService, private fb: FormBuilder) {
    this.workshopForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      shortDescription: [''],
      date: ['', Validators.required],
      startTime: [''],
      endTime: [''],
      price: [''],
      maxParticipants: [''],
      availableSlots: ['', Validators.required],
      location: ['', Validators.required],
      image: [''],
    });
  }

  ngOnInit(): void {
    this.loadWorkshops();
  }

  async loadWorkshops(): Promise<void> {
    this.loading = true;
    try {
      this.workshops = await this.dataService.getAllWorkshops();
    } catch (error) {
      this.errorMessage = 'Fehler beim Laden der Workshops.';
    } finally {
      this.loading = false;
    }
  }

  async saveWorkshop(): Promise<void> {
    if (this.workshopForm.invalid) return;

    let workshopData: Workshop = { ...this.workshopForm.value };

    // Bild hochladen falls vorhanden
    if (this.selectedFile) {
      const imageUrl = await this.storageService.uploadImage(this.selectedFile);
      workshopData.image = imageUrl;
    }

    try {
      if (this.editMode && this.selectedWorkshop) {
        await this.dataService.updateWorkshop(this.selectedWorkshop.id!, workshopData);
      } else {
        await this.dataService.addWorkshop(workshopData);
      }

      this.resetForm();
      this.loadWorkshops();
    } catch (error) {
      this.errorMessage = 'Fehler beim Speichern des Workshops.';
    }
  }

  editWorkshop(workshop: Workshop): void {
    this.editMode = true;
    this.selectedWorkshop = workshop;
    this.workshopForm.patchValue(workshop);
    this.imagePreview = workshop.image || null;
  }

  async deleteWorkshop(id: string): Promise<void> {
    if (confirm('Workshop wirklich löschen?')) {
      await this.dataService.deleteWorkshop(id);
      this.loadWorkshops();
    }
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => this.imagePreview = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  resetForm(): void {
    this.workshopForm.reset();
    this.editMode = false;
    this.selectedWorkshop = null;
    this.imagePreview = null;
    this.selectedFile = null;
  }
}
