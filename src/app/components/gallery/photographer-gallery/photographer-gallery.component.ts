import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { firebaseApp } from '../../../../firebase-config';
import { LightboxComponent, LightboxImage } from '../../../shared/lightbox/lightbox.component';
import { Router, RouterLink } from '@angular/router';
import { MasonryGridComponent, MasonryItem } from '../../../shared/masonry-grid/masonry-grid.component';

interface PhotographerArtwork {
  id: string;
  src: string;
  alt: string;
  title: string;
  photographer?: string;
  category?: string;
}

@Component({
  selector: 'app-photographer-gallery',
  templateUrl: './photographer-gallery.component.html',
  styleUrls: ['./photographer-gallery.component.scss'],
  standalone: true,
  imports: [CommonModule, LightboxComponent, RouterLink, MasonryGridComponent],
})
export class PhotographerGalleryComponent implements OnInit {
  photographerArtworks: PhotographerArtwork[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  photographer: string = 'Shiva Ludi';

  // Display settings
  activeCategory: string = 'all';
  categories = ['all', 'natur', 'portraits', 'reisen', 'kunst'];

  // Lightbox properties
  showLightbox: boolean = false;
  lightboxImages: LightboxImage[] = [];
  currentLightboxIndex: number = 0;

  // Default images using the actual picture1.jpg through picture24.jpg
  private defaultArtworks: PhotographerArtwork[] = [
    {
      id: '1',
      src: 'assets/images/Shiva/picture1.webp',
      alt: 'Stadt in Röte fotografiert von Shiva Ludi',
      title: 'Stadtstrasse im Morgenlicht',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '2',
      src: 'assets/images/Shiva/picture2.webp',
      alt: 'Schneelandschaft im Nordlicht Licht von Shiva Ludi',
      title: 'Schneelandschaft mit Polarlichter',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '3',
      src: 'assets/images/Shiva/picture3.webp',
      alt: 'Polarlichter über dem Himmel von Shiva Ludi',
      title: 'Polarlichter',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '4',
      src: 'assets/images/Shiva/picture4.webp',
      alt: 'Haus beleuchtet am Abend von Shiva Ludi',
      title: 'Haus im Schnee',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '5',
      src: 'assets/images/Shiva/picture5.webp',
      alt: 'Waldlandschaft mit Polarlichter von Shiva Ludi',
      title: 'Schritt durch den Wald',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '6',
      src: 'assets/images/Shiva/picture6.webp',
      alt: 'Schnee und Tannen von Shiva Ludi',
      title: 'Tannen bedeckt mit Schnee',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '7',
      src: 'assets/images/Shiva/picture7.webp',
      alt: 'Polarlichter zirkelnd von Shiva Ludi',
      title: 'Zirkelndes Polarlicht',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '8',
      src: 'assets/images/Shiva/picture8.webp',
      alt: 'Wasserfälle an ruhigem Waldsee von Shiva Ludi',
      title: 'Natur als Kunst',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '9',
      src: 'assets/images/Shiva/picture9.webp',
      alt: 'Kolibri an Blüte von Shiva Ludi',
      title: 'Kolibri im Flug',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '10',
      src: 'assets/images/Shiva/picture10.webp',
      alt: 'Strasse mit Bewölktem Himmel von Shiva Ludi',
      title: 'Strasse und Himmel',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '11',
      src: 'assets/images/Shiva/picture11.webp',
      alt: 'Makroaufnahe von Pflanze von Shiva Ludi',
      title: 'Pflanzenwelt',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '12',
      src: 'assets/images/Shiva/picture12.webp',
      alt: 'Meeresschildkröte von Shiva Ludi',
      title: 'Meeresschildkröte',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    // Additional images
    {
      id: '13',
      src: 'assets/images/Shiva/picture13.webp',
      alt: 'Milchsstrasse in der Nacht von Shiva Ludi',
      title: 'Milchstrasse',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '14',
      src: 'assets/images/Shiva/picture14.webp',
      alt: 'Einzelner Baum Ragt aus dem See von Shiva Ludi',
      title: 'Baum im See',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '15',
      src: 'assets/images/Shiva/picture15.webp',
      alt: 'Regenbogen über Bauernhaus von Shiva Ludi',
      title: 'Regenbogen',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '16',
      src: 'assets/images/Shiva/picture16.webp',
      alt: 'Strasse entlang der Küste von Shiva Ludi',
      title: 'Küstenstrasse',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '17',
      src: 'assets/images/Shiva/picture17.webp',
      alt: 'Eisvogel auf Ästen von Shiva Ludi',
      title: 'Eisvogel',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '18',
      src: 'assets/images/Shiva/picture18.webp',
      alt: 'Eisvogel auf Ast von Shiva Ludi',
      title: 'Eisvogel auf Ast',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '19',
      src: 'assets/images/Shiva/picture19.webp',
      alt: 'Eisvogel auf Ast in der Nacht von Shiva Ludi',
      title: 'Eisvogel in der Nacht',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '20',
      src: 'assets/images/Shiva/picture20.webp',
      alt: 'Am Strand unterm Baum mit Meeresblick von Shiva Ludi',
      title: 'Strandblick',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '21',
      src: 'assets/images/Shiva/picture21.webp',
      alt: 'Grosser Vogel auf Rasen von Shiva Ludi',
      title: 'Vogel im Garten',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '22',
      src: 'assets/images/Shiva/picture22.webp',
      alt: 'Wasserfall in Bucht über Höhle von Shiva Ludi',
      title: 'Wasserfall in Bucht',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '23',
      src: 'assets/images/Shiva/picture23.webp',
      alt: 'Wasserfall im Wald von Shiva Ludi',
      title: 'Wasserfall im Wald',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '24',
      src: 'assets/images/Shiva/picture24.webp',
      alt: 'Küstenkette hinaus ins Meer zu einem Haus von Shiva Ludi',
      title: 'Küstenkette',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    }
  ];

  // Filtered artworks based on category
  get filteredArtworks(): PhotographerArtwork[] {
    if (this.activeCategory === 'all') {
      return this.photographerArtworks;
    }
    return this.photographerArtworks.filter(artwork => artwork.category === this.activeCategory);
  }

  constructor(private router: Router) {}

  private db = getFirestore(firebaseApp);

  async ngOnInit(): Promise<void> {
    await this.loadPhotographerArtworks();
  }

  async loadPhotographerArtworks(): Promise<void> {
    try {
      // First try to get from photographerGallery collection
      let artworksCollection = collection(this.db, 'photographerGallery');
      let q = query(artworksCollection, where('photographer', '==', this.photographer));
      let snapshot = await getDocs(q);

      if (!snapshot.empty) {
        this.photographerArtworks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PhotographerArtwork[];
      } else {
        console.warn(`⚠️ Keine Bilder von ${this.photographer} in Firestore.`);
        this.photographerArtworks = this.defaultArtworks;
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Fotografen-Galerie:', error);
      this.photographerArtworks = this.defaultArtworks;
    } finally {
      this.loading = false;
    }
  }

  navigateToMainGallery(): void {
    this.router.navigate(['/gallery']);
  }

  setCategory(category: string): void {
    this.activeCategory = category;
  }

  // Lightbox methods
  openLightbox(event: {item: MasonryItem, index: number}): void {
    // Convert artworks to lightbox format
    this.lightboxImages = this.photographerArtworks.map(artwork => ({
      src: artwork.src,
      alt: artwork.alt,
      title: artwork.title,
      caption: artwork.alt
    }));

    this.currentLightboxIndex = event.index;
    this.showLightbox = true;
  }

  closeLightbox(): void {
    this.showLightbox = false;
  }
}
