import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  aboutText: string = '';
  loading: boolean = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadAboutText();
  }

  // 🔹 Holt den aktuellen Inhalt aus Firestore
  loadAboutText(): void {
    this.dataService.getContent('about').subscribe((content) => {
      this.aboutText = content || 'Kein Inhalt verfügbar.';
      this.loading = false;
    });
  }
}
