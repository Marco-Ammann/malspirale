import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class GalleryComponent {
  artworks = [
    { src: 'assets/images/art1.webp', alt: 'Kunstwerk 1', title: 'Kreative Inspiration' },
    { src: 'assets/images/art2.webp', alt: 'Kunstwerk 2', title: 'Farben der Natur' },
    { src: 'assets/images/art3.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' },
    { src: 'assets/images/art4.webp', alt: 'Kunstwerk 1', title: 'Kreative Inspiration' },
    { src: 'assets/images/art5.webp', alt: 'Kunstwerk 2', title: 'Farben der Natur' },
    { src: 'assets/images/art6.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' }, 
    { src: 'assets/images/art7.webp', alt: 'Kunstwerk 1', title: 'Kreative Inspiration' },
    { src: 'assets/images/art8.webp', alt: 'Kunstwerk 2', title: 'Farben der Natur' },
    { src: 'assets/images/art9.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' },
    { src: 'assets/images/art10.webp', alt: 'Kunstwerk 1', title: 'Kreative Inspiration' },
    { src: 'assets/images/art11.webp', alt: 'Kunstwerk 2', title: 'Farben der Natur' },
    { src: 'assets/images/art12.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' },
    { src: 'assets/images/art13.webp', alt: 'Kunstwerk 1', title: 'Kreative Inspiration' },
    { src: 'assets/images/art14.webp', alt: 'Kunstwerk 2', title: 'Farben der Natur' },
    { src: 'assets/images/art15.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' },
    { src: 'assets/images/art16.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' },
   ];
}
