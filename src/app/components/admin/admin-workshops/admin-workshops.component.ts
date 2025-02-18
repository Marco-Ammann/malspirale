import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Workshop } from '../../../core/interfaces/interfaces';
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
  workshops: Workshop[] = [];
  selectedWorkshop: Workshop | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadWorkshops();
  }

  async loadWorkshops(): Promise<void> {
    try {
      this.workshops = await this.dataService.getAllWorkshops();
    } catch (error) {
      console.error('Error loading workshops:', error);
    }
  }

  editWorkshop(workshop: Workshop): void {
    this.selectedWorkshop = { ...workshop };
  }

  createWorkshop(): void {
    this.selectedWorkshop = {
      id: '',
      title: '',
      shortDescription: '',
      description: '',
      imageUrl: '',
      date: new Date(),
      location: '',
      price: 0
    };
  }

  async saveWorkshop(): Promise<void> {
    if (this.selectedWorkshop) {
      try {
        if (this.selectedWorkshop.id) {
          await this.dataService.updateWorkshop(this.selectedWorkshop.id, this.selectedWorkshop);
        } else {
          await this.dataService.addWorkshop(this.selectedWorkshop);
        }
        this.loadWorkshops();
        this.selectedWorkshop = null;
      } catch (error) {
        console.error('Error saving workshop:', error);
      }
    }
  }

  async deleteWorkshop(id: string): Promise<void> {
    try {
      await this.dataService.deleteWorkshop(id);
      this.loadWorkshops();
    } catch (error) {
      console.error('Error deleting workshop:', error);
    }
  }

  cancelEdit(): void {
    this.selectedWorkshop = null;
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (this.selectedWorkshop) {
          this.selectedWorkshop.imageUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}