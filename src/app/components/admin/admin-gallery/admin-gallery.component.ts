import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { firebaseApp } from '../../../../firebase-config';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

interface Artwork {
  id: string;
  src: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-gallery.component.html',
  styleUrls: ['./admin-gallery.component.scss'],
})
export class AdminGalleryComponent implements OnInit {
  artworks: Artwork[] = [];
  galleryForm: FormGroup;
  editingArtwork: Artwork | null = null;
  loading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  selectedImagePreview: string | null = null;

  private db = getFirestore(firebaseApp);
  private storage = getStorage();

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.galleryForm = this.fb.group({
      title: ['', Validators.required],
      alt: ['', Validators.required],
      filename: ['', Validators.required], // Nutzerdefinierter Dateiname
      image: [null, Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadArtworks();
  }

  async loadArtworks(): Promise<void> {
    try {
      const artworksCollection = collection(this.db, 'gallery');
      const snapshot = await getDocs(artworksCollection);
      this.artworks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Artwork[];
    } catch (error) {
      console.error('❌ Fehler beim Laden der Galerie:', error);
      this.errorMessage = 'Fehler beim Laden der Galerie';
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFile = file;

    // Vorschau-Bild setzen
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedFile) return null;

    try {
      const userRole = await this.authService.getUserRole();
      if (userRole !== 'admin') {
        console.error('❌ Keine Admin-Berechtigung für Upload!');
        return null;
      }

      const filename = this.galleryForm.value.filename.trim();
      const extension = this.selectedFile.name.split('.').pop(); // Dateiendung beibehalten
      const fullFileName = `${filename}.${extension}`;

      console.log(`🔄 Hochladen: ${fullFileName}`);

      const storageRef = ref(this.storage, `images/${fullFileName}`);
      await uploadBytes(storageRef, this.selectedFile);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('❌ Fehler beim Hochladen:', error);
      return null;
    }
  }

  async addArtwork() {
    if (this.galleryForm.invalid || !this.selectedFile) {
      console.warn('⚠️ Kein Bild ausgewählt oder Formular ungültig.');
      return;
    }

    this.loading = true;
    const { title, alt } = this.galleryForm.value;
    console.log('🖼️ Bild hinzufügen:', title, alt);

    try {
      const imageUrl = await this.uploadImage();

      console.log('🔗 Bild-URL:', imageUrl);
      if (!imageUrl) {
        throw new Error('Bild-Upload fehlgeschlagen');
      }

      const docRef = await addDoc(collection(this.db, 'gallery'), {
        title,
        alt,
        src: imageUrl,
        timestamp: new Date().toISOString(),
      });

      console.log('✅ Bild hinzugefügt:', docRef.id);

      this.artworks.push({ id: docRef.id, title, alt, src: imageUrl });
      this.galleryForm.reset();
      this.selectedImagePreview = null;
      this.selectedFile = null;
      console.log('🖼️ Bild hinzugefügt:', title, alt);
    } catch (error) {
      console.error('❌ Fehler beim Hinzufügen:', error);
    } finally {
      console.log('🏁 Fertig!');
      this.loading = false;
    }
  }

  async deleteArtwork(artwork: Artwork) {
    if (!confirm('Bist du sicher, dass du dieses Bild löschen möchtest?'))
      return;

    this.loading = true;
    try {
      if (artwork.src) {
        const imageRef = ref(this.storage, artwork.src);
        await deleteObject(imageRef);
      }
      if (artwork.id) {
        await deleteDoc(doc(this.db, 'gallery', artwork.id));
        this.artworks = this.artworks.filter((a) => a.id !== artwork.id);
      }
    } catch (error) {
      console.error('❌ Fehler beim Löschen:', error);
    } finally {
      this.loading = false;
    }
  }

  editArtwork(artwork: Artwork) {
    this.editingArtwork = artwork;
    this.galleryForm.patchValue({
      title: artwork.title,
      alt: artwork.alt,
      filename: artwork.src.split('/').pop()?.split('?')[0] || '',
    });
  }

  cancelEdit() {
    this.editingArtwork = null;
    this.galleryForm.reset();
    this.selectedImagePreview = null;
    this.selectedFile = null;
  }
}
