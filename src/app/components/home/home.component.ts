import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';

interface WorkshopWithImage extends Workshop {
  imageLoaded: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  workshops: WorkshopWithImage[] = [];
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
    this.dataService.getAllWorkshops()
      .then((workshops) => {
        this.workshops = workshops.map((workshop) => ({
          ...workshop,
          imageLoaded: false,
        }));
      })
      .catch((error) => {
        console.error('Fehler beim Laden der Workshops:', error);
      });
  }

  onImageLoad(index: number, type: 'workshop' | 'artwork'): void {
    if (type === 'workshop') {
      this.workshops[index].imageLoaded = true;
    } else if (type === 'artwork') {
      this.artworks[index].imageLoaded = true;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
