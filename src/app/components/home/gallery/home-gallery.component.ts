import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseApp } from '../../../../firebase-config';
import { Artwork } from './artwork.model';

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

  // Default featured artworks if none are found in Firestore
  defaultFeaturedArtworks: Artwork[] = [
    { id: '1', src: 'assets/images/art1.webp', alt: 'Featured Kunstwerk 1', title: 'Featured 1', displayOrder: 1, isPublic: true, isFeatured: true },
    { id: '2', src: 'assets/images/art2.webp', alt: 'Featured Kunstwerk 2', title: 'Featured 2', displayOrder: 2, isPublic: true, isFeatured: true },
    { id: '3', src: 'assets/images/art3.webp', alt: 'Featured Kunstwerk 3', title: 'Featured 3', displayOrder: 3, isPublic: true, isFeatured: true },
    { id: '4', src: 'assets/images/art21.webp', alt: 'Featured Kunstwerk 4', title: 'Featured 4', displayOrder: 4, isPublic: true, isFeatured: true },
  ];

  featuredArtworks: Artwork[] = [];
  loading = true;

  private db = getFirestore(firebaseApp);

  constructor(private router: Router) {
    this.loadFeaturedArtworks();
  }

  navigateToGallery(): void {
    this.router.navigate(['/gallery']);
  }

  onImageLoad(artwork: any): void {
    artwork.imageLoaded = true;
  }

  loadFeaturedArtworks(): void {
    this.loading = true;

    try {
      const artworksRef = collection(this.db, 'gallery');
      const featuredQuery = query(
        artworksRef,
        where("isPublic", "==", true),
        where("isFeatured", "==", true)
      );

      getDocs(featuredQuery).then((snapshot: any) => {
        if (snapshot.docs.length > 0) {
          this.featuredArtworks = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data
            } as Artwork;
          });

          this.featuredArtworks.sort((a, b) => {
            const orderA = a.displayOrder !== undefined ? a.displayOrder : Number.MAX_SAFE_INTEGER;
            const orderB = b.displayOrder !== undefined ? b.displayOrder : Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
          });
        } else {
          console.warn('⚠️ Keine Featured-Bilder in Firestore.');
          this.featuredArtworks = this.defaultFeaturedArtworks;
        }

        this.featuredArtworks = this.featuredArtworks.slice(0, 8);
        this.loading = false;
      }).catch((error: any) => {
        console.error('Error loading featured artworks:', error);
        this.featuredArtworks = this.defaultFeaturedArtworks;
        this.loading = false;
      });
    } catch (error) {
      console.error('Error setting up featured artworks query:', error);
      this.featuredArtworks = this.defaultFeaturedArtworks;
      this.loading = false;
    }
  }
}
