import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
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
}
