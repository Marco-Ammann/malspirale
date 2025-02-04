import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  aboutText: string = '';
  loading = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadContent();
  }

  async loadContent(): Promise<void> {
    try {
      this.aboutText = await this.dataService.getContent('about');
    } catch (error) {
      console.error('Fehler beim Laden des Inhalts:', error);
      this.aboutText = 'Fehler beim Laden des Inhalts.';
    } finally {
      this.loading = false;
    }
  }
}
