import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-gallery.component.html',
  styleUrls: ['./home-gallery.component.scss']
})
export class HomeGalleryComponent {
  artworks = [
    { src: 'assets/images/art1.webp', alt: 'Kunstwerk 1', imageLoaded: false },
    { src: 'assets/images/art2.webp', alt: 'Kunstwerk 2', imageLoaded: false },
    { src: 'assets/images/art3.webp', alt: 'Kunstwerk 3', imageLoaded: false },
    { src: 'assets/images/art21.webp', alt: 'Kunstwerk 4', imageLoaded: false },
  ];

  constructor(private router: Router) {}

  navigateToGallery(): void {
    this.router.navigate(['/gallery']);
  }
  
  onImageLoad(artwork: any): void {
    artwork.imageLoaded = true;
  }
}