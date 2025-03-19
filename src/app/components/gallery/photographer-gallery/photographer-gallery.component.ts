import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { firebaseApp } from '../../../../firebase-config';
import { LightboxComponent, LightboxImage } from '../../../shared/lightbox/lightbox.component';
import { Router, RouterLink } from '@angular/router';

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
  imports: [CommonModule, LightboxComponent, RouterLink],
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
      src: 'assets/images/Shiva/picture1.jpg',
      alt: 'Berglandschaft mit See fotografiert von Shiva Ludi',
      title: 'Bergsee im Morgenlicht',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '2',
      src: 'assets/images/Shiva/picture2.jpg',
      alt: 'Portraitfotografie im natürlichen Licht von Shiva Ludi',
      title: 'Portraitstudie in Naturtönen',
      photographer: 'Shiva Ludi',
      category: 'portraits'
    },
    {
      id: '3',
      src: 'assets/images/Shiva/picture3.jpg',
      alt: 'Urbane Architektur bei Dämmerlicht von Shiva Ludi',
      title: 'Stadt im Zwielicht',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '4',
      src: 'assets/images/Shiva/picture4.jpg',
      alt: 'Detailaufnahme von Naturformen von Shiva Ludi',
      title: 'Naturdetail',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '5',
      src: 'assets/images/Shiva/picture5.jpg',
      alt: 'Portrait einer Person im natürlichen Umfeld von Shiva Ludi',
      title: 'Person im Dialog mit der Natur',
      photographer: 'Shiva Ludi',
      category: 'portraits'
    },
    {
      id: '6',
      src: 'assets/images/Shiva/picture6.jpg',
      alt: 'Kunstvolle Dokumentation einer Skulptur von Shiva Ludi',
      title: 'Skulptur im Licht',
      photographer: 'Shiva Ludi',
      category: 'kunst'
    },
    {
      id: '7',
      src: 'assets/images/Shiva/picture7.jpg',
      alt: 'Bergpanorama bei Sonnenuntergang von Shiva Ludi',
      title: 'Alpenpanorama in Gold',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '8',
      src: 'assets/images/Shiva/picture8.jpg',
      alt: 'Kunstinstallation mit natürlichen Materialien von Shiva Ludi',
      title: 'Natur als Kunst',
      photographer: 'Shiva Ludi',
      category: 'kunst'
    },
    {
      id: '9',
      src: 'assets/images/Shiva/picture9.jpg',
      alt: 'Reisefotografie aus einer fernen Stadt von Shiva Ludi',
      title: 'Fremde Welten',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '10',
      src: 'assets/images/Shiva/picture10.jpg',
      alt: 'Kunstwerk in Makroperspektive von Shiva Ludi',
      title: 'Kunst im Detail',
      photographer: 'Shiva Ludi',
      category: 'kunst'
    },
    {
      id: '11',
      src: 'assets/images/Shiva/picture11.jpg',
      alt: 'Portraitaufnahme in Schwarz-Weiß von Shiva Ludi',
      title: 'Charakterporträt',
      photographer: 'Shiva Ludi',
      category: 'portraits'
    },
    {
      id: '12',
      src: 'assets/images/Shiva/picture12.jpg',
      alt: 'Landschaftsaufnahme mit besonderem Lichteinfall von Shiva Ludi',
      title: 'Landschaft im Lichtspiel',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    // Additional images
    {
      id: '13',
      src: 'assets/images/Shiva/picture13.jpg',
      alt: 'Detailaufnahme einer Kunstinstallation von Shiva Ludi',
      title: 'Strukturen und Formen',
      photographer: 'Shiva Ludi',
      category: 'kunst'
    },
    {
      id: '14',
      src: 'assets/images/Shiva/picture14.jpg',
      alt: 'Reisefotografie aus einem Bergdorf von Shiva Ludi',
      title: 'Leben in den Bergen',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '15',
      src: 'assets/images/Shiva/picture15.jpg',
      alt: 'Nahaufnahme einer Blüte von Shiva Ludi',
      title: 'Blütentraum',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '16',
      src: 'assets/images/Shiva/picture16.jpg',
      alt: 'Emotionales Portrait eines Menschen von Shiva Ludi',
      title: 'Emotionen',
      photographer: 'Shiva Ludi',
      category: 'portraits'
    },
    {
      id: '17',
      src: 'assets/images/Shiva/picture17.jpg',
      alt: 'Kunstwerk in ungewöhnlicher Perspektive von Shiva Ludi',
      title: 'Kunst aus neuem Blickwinkel',
      photographer: 'Shiva Ludi',
      category: 'kunst'
    },
    {
      id: '18',
      src: 'assets/images/Shiva/picture18.jpg',
      alt: 'Reisefotografie von einer Küstenlandschaft von Shiva Ludi',
      title: 'Küstenträume',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '19',
      src: 'assets/images/Shiva/picture19.jpg',
      alt: 'Naturdetail im Makrobereich von Shiva Ludi',
      title: 'Kleine Welten',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '20',
      src: 'assets/images/Shiva/picture20.jpg',
      alt: 'Portrait eines älteren Menschen von Shiva Ludi',
      title: 'Lebenslinien',
      photographer: 'Shiva Ludi',
      category: 'portraits'
    },
    {
      id: '21',
      src: 'assets/images/Shiva/picture21.jpg',
      alt: 'Abstrakte Kunstfotografie von Shiva Ludi',
      title: 'Abstraktion des Alltags',
      photographer: 'Shiva Ludi',
      category: 'kunst'
    },
    {
      id: '22',
      src: 'assets/images/Shiva/picture22.jpg',
      alt: 'Reiseimpression aus einem fernen Land von Shiva Ludi',
      title: 'Reisemomente',
      photographer: 'Shiva Ludi',
      category: 'reisen'
    },
    {
      id: '23',
      src: 'assets/images/Shiva/picture23.jpg',
      alt: 'Landschaftsfotografie bei besonderen Wetterbedingungen von Shiva Ludi',
      title: 'Natur im Wandel',
      photographer: 'Shiva Ludi',
      category: 'natur'
    },
    {
      id: '24',
      src: 'assets/images/Shiva/picture24.jpg',
      alt: 'Dokumentation einer Kunstinstallation von Isabel Kunz von Shiva Ludi',
      title: 'Isabels Kunst im Fokus',
      photographer: 'Shiva Ludi',
      category: 'kunst'
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
  openLightbox(index: number): void {
    // Convert artworks to lightbox format using filtered artworks
    this.lightboxImages = this.filteredArtworks.map(artwork => ({
      src: artwork.src,
      alt: artwork.alt,
      title: artwork.title,
      caption: artwork.alt
    }));
    
    this.currentLightboxIndex = index;
    this.showLightbox = true;
  }
  
  closeLightbox(): void {
    this.showLightbox = false;
  }
}
