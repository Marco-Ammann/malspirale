import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../../firebase-config';

interface Artwork {
  src: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class GalleryComponent implements OnInit {
  artworks: Artwork[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  private db = getFirestore(firebaseApp);

  async ngOnInit(): Promise<void> {
    await this.loadArtworks();
  }

  async loadArtworks(): Promise<void> {
    try {
      const artworksCollection = collection(this.db, 'gallery');
      const snapshot = await getDocs(artworksCollection);

      if (!snapshot.empty) {
        this.artworks = snapshot.docs.map((doc) => doc.data() as Artwork);
      } else {
        console.warn('⚠️ Keine Bilder in Firestore – Lade Platzhalter.');
        this.artworks = this.getPlaceholderArtworks();
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Galerie:', error);
      this.errorMessage = 'Lokale Bilder wurden geladen';
      this.artworks = this.getPlaceholderArtworks();
    } finally {
      this.loading = false;
    }
  }

  getPlaceholderArtworks(): Artwork[] {
    return [
      { src: 'assets/images/art1.webp', alt: 'Kunstwerk 1', title: 'Kreative Inspiration' },
      { src: 'assets/images/art2.webp', alt: 'Kunstwerk 2', title: 'Farben der Natur' },
      { src: 'assets/images/art3.webp', alt: 'Kunstwerk 3', title: 'Lebendige Formen' },
      { src: 'assets/images/art4.webp', alt: 'Kunstwerk 4', title: 'Künstlerische Freiheit' },
      { src: 'assets/images/art5.webp', alt: 'Kunstwerk 5', title: 'Abstrakte Schönheit' },
      { src: 'assets/images/art6.webp', alt: 'Kunstwerk 6', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art7.webp', alt: 'Kunstwerk 7', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art8.webp', alt: 'Kunstwerk 8', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art9.webp', alt: 'Kunstwerk 9', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art10.webp', alt: 'Kunstwerk 10', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art11.webp', alt: 'Kunstwerk 11', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art12.webp', alt: 'Kunstwerk 12', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art13.webp', alt: 'Kunstwerk 13', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art14.webp', alt: 'Kunstwerk 14', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art15.webp', alt: 'Kunstwerk 15', title: 'Natürliche Harmonie' },
      { src: 'assets/images/art16.webp', alt: 'Kunstwerk 16', title: 'Natürliche Harmonie' },
    ];
  }
}
