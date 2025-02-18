import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AboutComponent implements OnInit {
  aboutText: string = '';
  loading: boolean = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAboutText();
  }

  async loadAboutText(): Promise<void> {
    try {
      this.aboutText = await this.dataService.getContent('about');
    } catch (error) {
      console.error('Error loading about content:', error);
      this.aboutText = 'Error loading content.';
    } finally {
      this.loading = false;
    }
  }
}