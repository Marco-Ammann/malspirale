import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent {
  
  workshops: Workshop[] = [];
  heroImage = 'assets/images/hero10.webp';
  artworks = [
    { src: 'assets/images/art3.webp', alt: 'Kunstwerk 1', title: 'Kreative Inspiration' },
    { src: 'assets/images/art2.webp', alt: 'Kunstwerk 2', title: 'Farben der Natur' },
    { src: 'assets/images/art1.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' },
  ];
  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.dataService.getWorkshops().subscribe((workshops) => {
      this.workshops = workshops;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
