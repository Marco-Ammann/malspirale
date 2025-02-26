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
  imports: [CommonModule, ReactiveFormsModule],
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
      console.error('Fehler beim Laden der Galerie:', error);
      this.errorMessage = 'Fehler beim Laden der Galerie';
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedFile = file;
    this.galleryForm.patchValue({ image: file });
    // Bildvorschau erstellen
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
        console.error('Keine Admin-Berechtigung für Upload!');
        return null;
      }
      const filenameInput = this.galleryForm.value.filename.trim();
      const extension = this.selectedFile.name.split('.').pop();
      const fullFileName = `${Date.now()}_${filenameInput}.${extension}`;
      // Verwende den Ordner "gallery" statt "images/workshops"
      const storageRef = ref(this.storage, `gallery/${fullFileName}`);
      await uploadBytes(storageRef, this.selectedFile);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error);
      return null;
    }
  }

  async addArtwork() {
    if (this.galleryForm.invalid || !this.selectedFile) {
      console.warn('Kein Bild ausgewählt oder Formular ungültig.');
      return;
    }
    this.loading = true;
    const { title, alt } = this.galleryForm.value;
    try {
      const imageUrl = await this.uploadImage();
      if (!imageUrl) throw new Error('Bild-Upload fehlgeschlagen');

      const docRef = await addDoc(collection(this.db, 'gallery'), {
        title,
        alt,
        src: imageUrl,
        timestamp: new Date().toISOString(),
      });
      this.artworks.push({ id: docRef.id, title, alt, src: imageUrl });
      this.galleryForm.reset();
      this.selectedFile = null;
      this.selectedImagePreview = null;
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
      this.errorMessage = 'Fehler beim Hinzufügen des Bildes.';
    } finally {
      this.loading = false;
    }
  }

  async deleteArtwork(artwork: Artwork) {
    if (!confirm('Bist du sicher, dass du dieses Bild löschen möchtest?')) return;
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
      console.error('Fehler beim Löschen:', error);
      this.errorMessage = 'Fehler beim Löschen des Bildes.';
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
    // Bei Edit wird evtl. kein neues Bild benötigt – daher nicht resetten
  }

  cancelEdit() {
    this.editingArtwork = null;
    this.galleryForm.reset();
    this.selectedFile = null;
    this.selectedImagePreview = null;
  }
}
