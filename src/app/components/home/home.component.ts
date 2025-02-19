import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  workshops: Workshop[] = [];
  regularWorkshops: Workshop[] = [];
  malateliers: Workshop[] = [];
  individuelleAnfragen: Workshop[] = [];
  artworks = [
    { src: 'assets/images/art1.webp', alt: 'Kunstwerk 1', imageLoaded: false },
    { src: 'assets/images/art2.webp', alt: 'Kunstwerk 2', imageLoaded: false },
    { src: 'assets/images/art3.webp', alt: 'Kunstwerk 3', imageLoaded: false },
  ];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.dataService.getWorkshops().subscribe({
      next: (workshops: Workshop[]) => {
        this.workshops = workshops;
        this.regularWorkshops = workshops.filter(w => w.type === 'workshop');
        this.malateliers = workshops.filter(w => w.type === 'malatelier');
        this.individuelleAnfragen = workshops.filter(w => w.type === 'individuelleAnfrage');
      },
      error: (error: any) => {
        console.error('Fehler beim Laden der Workshops:', error);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
