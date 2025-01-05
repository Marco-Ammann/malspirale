import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent {
  heroImage = '/assets/images/hero1.webp';
  artworks = [
    { src: 'assets/images/art1.webp', alt: 'Kunstwerk 1', title: 'Kreative Inspiration' },
    { src: 'assets/images/art2.webp', alt: 'Kunstwerk 2', title: 'Farben der Natur' },
    { src: 'assets/images/art3.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' },
  ];
}
