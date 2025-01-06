import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  images = [
    { imageUrl: 'assets/images/art1.webp', title: 'Kunstwerk 1', description: 'Ein inspirierendes Kunstwerk.' },
    { imageUrl: 'assets/images/art2.webp', title: 'Kunstwerk 2', description: 'Eine Hommage an die Natur.' },
    { imageUrl: 'assets/images/art3.webp', title: 'Kunstwerk 3', description: 'Farbenfrohe Komposition.' },
    { imageUrl: 'assets/images/art4.webp', title: 'Kunstwerk 4', description: 'Abstrakte Formen.' },
    { imageUrl: 'assets/images/art5.webp', title: 'Kunstwerk 5', description: 'Schlichte Eleganz.' },
    { imageUrl: 'assets/images/art6.webp', title: 'Kunstwerk 6', description: 'Kreative Techniken.' },
    { imageUrl: 'assets/images/art7.webp', title: 'Kunstwerk 7', description: 'Ein Spiel aus Licht und Schatten.' },
    { imageUrl: 'assets/images/art8.webp', title: 'Kunstwerk 8', description: 'Die Schönheit der Symmetrie.' },
    { imageUrl: 'assets/images/art9.webp', title: 'Kunstwerk 9', description: 'Harmonische Texturen.' },
    { imageUrl: 'assets/images/art10.webp', title: 'Kunstwerk 10', description: 'Faszinierende Details.' },
  ];

  selectedImage: { imageUrl: string; title: string; description: string } | null = null;

  openModal(image: { imageUrl: string; title: string; description: string }) {
    this.selectedImage = image;
  }

  closeModal() {
    this.selectedImage = null;
  }
}
