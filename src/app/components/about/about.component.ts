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
    this.loadContent();
  }

  // 🔹 Holt den aktuellen Inhalt aus Firestore
  loadContent(): void {
    this.dataService.getContent('about').subscribe((content) => {
      if (content) {
        this.aboutText = content.text || '';
      } else {
        this.aboutText = 'Inhalt nicht gefunden!';
      }
      this.loading = false;
    });
  }
}
