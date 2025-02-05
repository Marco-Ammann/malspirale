import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../../firebase-config';

interface Artwork {
  id: string;
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
  artworks_default: Artwork[] = [];

  constructor() {
    for (let i = 1; i <= 12; i++) {
      this.artworks_default.push({
        id: i.toString(),
        src: `assets/images/art${i}.webp`,
        alt: `Bild ${i}`,
        title: `Bild ${i}`,
      });
    }
  }

  private db = getFirestore(firebaseApp);

  async ngOnInit(): Promise<void> {
    await this.loadArtworks();
  }

  async loadArtworks(): Promise<void> {
    try {
      const artworksCollection = collection(this.db, 'gallery');
      const snapshot = await getDocs(artworksCollection);

      if (!snapshot.empty) {
        this.artworks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Artwork[];
      } else {
        console.warn('⚠️ Keine Bilder in Firestore.');
        this.artworks = [];
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Galerie:', error);
      this.errorMessage = 'Fehler beim Laden der Galerie.';
    } finally {
      this.loading = false;
    }
  }
}
