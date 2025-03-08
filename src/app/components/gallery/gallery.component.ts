import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../../firebase-config';
import { LightboxComponent, LightboxImage } from '../../shared/lightbox/lightbox.component';

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
  imports: [CommonModule, LightboxComponent],
})
export class GalleryComponent implements OnInit {
  artworks: Artwork[] = [];
  subArtworks: Artwork[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  artworks_default: Artwork[] = [];
  subArtworks_default: Artwork[] = [];
  
  // Lightbox-Eigenschaften
  showLightbox: boolean = false;
  lightboxImages: LightboxImage[] = [];
  currentLightboxIndex: number = 0;

  constructor() {
    for (let i = 1; i <= 21; i++) {
      this.artworks_default.push({
        id: i.toString(),
        src: `assets/images/art${i}.webp`,
        alt: `Beschreibung ${i}`,
        title: `Bild ${i}`,
      });
    }

    for (let i = 1; i <= 10; i++) {
      this.subArtworks_default.push({
        id: `sub${i}`,
        src: `assets/images/art${i}.webp`,
        alt: `Untergalerie Beschreibung ${i}`,
        title: `Untergalerie Bild ${i}`,
      });
    }
  }

  private db = getFirestore(firebaseApp);

  async ngOnInit(): Promise<void> {
    await this.loadArtworks();
    await this.loadSubArtworks();
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
        this.artworks = this.artworks_default;
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Galerie:', error);
      this.artworks = this.artworks_default;
    } finally {
      this.loading = false;
    }
  }

  async loadSubArtworks(): Promise<void> {
    try {
      const subArtworksCollection = collection(this.db, 'subGallery');
      const snapshot = await getDocs(subArtworksCollection);

      if (!snapshot.empty) {
        this.subArtworks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Artwork[];
      } else {
        console.warn('⚠️ Keine Untergalerie-Bilder in Firestore.');
        this.subArtworks = this.subArtworks_default;
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Untergalerie:', error);
      this.subArtworks = this.subArtworks_default;
    } finally {
      this.loading = false;
    }
  }

  scrollToSubGallery(event: Event): void {
    event.preventDefault();
    const target = document.getElementById('sub-gallery');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Lightbox-Methoden
  openLightbox(gallery: 'main' | 'sub', index: number): void {
    const source = gallery === 'main' ? this.artworks : this.subArtworks;
    
    // Konvertiere Artworks in Lightbox-Format
    this.lightboxImages = source.map(artwork => ({
      src: artwork.src,
      alt: artwork.alt,
      title: artwork.title,
      caption: artwork.alt // Wir verwenden alt als Bildunterschrift
    }));
    
    this.currentLightboxIndex = index;
    this.showLightbox = true;
  }
  
  closeLightbox(): void {
    this.showLightbox = false;
  }
}