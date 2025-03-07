import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firebaseApp } from '../../../../firebase-config';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';

interface Artwork {
  id: string;
  src: string;
  alt: string;
  title: string;
  type: string;
  photographer?: string;
  loaded?: boolean;
  width?: number;
  height?: number;
}

interface FileWithPreview {
  file: File;
  preview: string;
  title: string;
  description: string;
  name: string;
}

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-gallery.component.html',
  styleUrls: ['./admin-gallery.component.scss']
})
export class AdminGalleryComponent implements OnInit {
  // Galerie-Daten
  artworks: Artwork[] = [];
  filteredArtworks: Artwork[] = [];
  loading = true;
  
  // UI-Status
  selectedGalleryType = 'main';
  selectedPhotographer = '';
  photographers: string[] = ['Shiva Ludi', 'Isabel Kunz'];
  searchTerm = '';
  viewMode = 'grid';
  
  // Modal-Status
  showUploadModal = false;
  showEditModal = false;
  editingArtwork: Artwork | null = null;
  selectedFiles: FileWithPreview[] = [];
  isDragging = false;
  uploading = false;
  uploadProgress = 0;
  
  private db = getFirestore(firebaseApp);
  private storage = getStorage();

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadGallery();
  }

  async loadGallery(): Promise<void> {
    this.loading = true;
    let collectionPath = 'gallery';
    
    try {
      switch (this.selectedGalleryType) {
        case 'main':
          collectionPath = 'gallery';
          break;
        case 'subgallery':
          collectionPath = 'subGallery';
          break;
        case 'photographer':
          if (!this.selectedPhotographer) {
            if (this.photographers.length > 0) {
              this.selectedPhotographer = this.photographers[0];
            } else {
              this.artworks = [];
              this.filteredArtworks = [];
              this.loading = false;
              return;
            }
          }
          collectionPath = 'photographerGallery';
          break;
      }
      
      let snapshot;
      
      // Filter nach Fotograf, falls notwendig
      if (this.selectedGalleryType === 'photographer' && this.selectedPhotographer) {
        // Verwende query für gefiltertes Ergebnis
        const q = query(
          collection(this.db, collectionPath),
          where('photographer', '==', this.selectedPhotographer)
        );
        snapshot = await getDocs(q);
      } else {
        // Standard-Collection ohne Filter
        snapshot = await getDocs(collection(this.db, collectionPath));
      }
      
      this.artworks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: this.selectedGalleryType,
        loaded: false
      })) as Artwork[];
      
      this.filterImages();
    } catch (error) {
      console.error('Fehler beim Laden der Galerie:', error);
      this.artworks = [];
      this.filteredArtworks = [];
    } finally {
      this.loading = false;
    }
  }

  changeGalleryType(): void {
    this.searchTerm = '';
    this.loadGallery();
  }

  loadPhotographerGallery(): void {
    this.loadGallery();
  }
  
  filterImages(): void {
    if (!this.searchTerm.trim()) {
      this.filteredArtworks = [...this.artworks];
      return;
    }
    
    const search = this.searchTerm.toLowerCase();
    this.filteredArtworks = this.artworks.filter(artwork => 
      artwork.title.toLowerCase().includes(search) || 
      artwork.alt.toLowerCase().includes(search)
    );
  }
  
  onImageLoad(artwork: Artwork): void {
    artwork.loaded = true;
  }
  
  isPortrait(artwork: Artwork): boolean {
    // Falls Höhe/Breite bekannt sind, diese verwenden
    if (artwork.height && artwork.width) {
      return artwork.height > artwork.width;
    }
    
    // Sonst versuchen anhand des src zu schätzen (kann ungenau sein)
    return artwork.src.includes('portrait') || artwork.title.toLowerCase().includes('portrait');
  }
  
  addNewPhotographer(): void {
    const name = prompt('Name des Fotografen:');
    if (name && name.trim() && !this.photographers.includes(name.trim())) {
      this.photographers.push(name.trim());
      this.selectedPhotographer = name.trim();
      this.loadGallery();
    }
  }
  
  openUploadModal(): void {
    this.showUploadModal = true;
    this.selectedFiles = [];
  }
  
  closeModal(event: MouseEvent): void {
    // Schließe nur, wenn auf den Overlay-Hintergrund geklickt wurde
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showUploadModal = false;
      this.showEditModal = false;
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }
  
  handleFiles(files: FileList): void {
    // Konvertiere FileList zu Array und filtere nach Bildern
    Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .forEach(file => {
        // Erstelle File-Preview
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.selectedFiles.push({
              file,
              preview: e.target.result as string,
              title: this.getFileNameWithoutExtension(file.name),
              description: '',
              name: file.name
            });
          }
        };
        reader.readAsDataURL(file);
      });
  }
  
  getFileNameWithoutExtension(filename: string): string {
    return filename.replace(/\.[^/.]+$/, "");
  }
  
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
  
  async uploadFiles(): Promise<void> {
    if (this.selectedFiles.length === 0) return;
    
    this.uploading = true;
    const totalFiles = this.selectedFiles.length;
    let uploadedFiles = 0;
    
    try {
      const userRole = await this.authService.getUserRole();
      if (userRole !== 'admin') {
        alert('Keine Admin-Berechtigung für Upload!');
        this.uploading = false;
        return;
      }
      
      for (const fileData of this.selectedFiles) {
        // Eindeutigen Dateinamen generieren
        const timestamp = Date.now();
        const extension = fileData.file.name.split('.').pop();
        const fullFileName = `${timestamp}_${fileData.title.replace(/\s+/g, '_')}.${extension}`;
        
        // Bestimme den Ordner je nach Galerie-Typ
        let folder = 'gallery';
        if (this.selectedGalleryType === 'subgallery') {
          folder = 'subgallery';
        } else if (this.selectedGalleryType === 'photographer') {
          folder = `photographer/${this.selectedPhotographer.replace(/\s+/g, '_')}`;
        }
        
        // Bild hochladen
        const storageRef = ref(this.storage, `${folder}/${fullFileName}`);
        await uploadBytes(storageRef, fileData.file);
        const imageUrl = await getDownloadURL(storageRef);
        
        // Lade das Bild, um Dimensionen zu erhalten
        const img = new Image();
        img.src = imageUrl;
        await new Promise<void>((resolve) => {
          img.onload = () => {
            resolve();
          };
          // Fallback, falls das Laden fehlschlägt
          setTimeout(resolve, 1000);
        });
        
        // Metadaten in Firestore speichern
        let collectionPath = 'gallery';
        if (this.selectedGalleryType === 'subgallery') {
          collectionPath = 'subGallery';
        } else if (this.selectedGalleryType === 'photographer') {
          collectionPath = 'photographerGallery';
        }
        
        const docData = {
          title: fileData.title,
          alt: fileData.description,
          src: imageUrl,
          timestamp: timestamp,
          width: img.width,
          height: img.height
        };
        
        // Füge Fotografen hinzu, falls relevant
        if (this.selectedGalleryType === 'photographer') {
          Object.assign(docData, { photographer: this.selectedPhotographer });
        }
        
        await addDoc(collection(this.db, collectionPath), docData);
        
        // Aktualisiere Fortschritt
        uploadedFiles++;
        this.uploadProgress = Math.round((uploadedFiles / totalFiles) * 100);
      }
      
      // Lade Galerie neu nach erfolgreichen Uploads
      this.loadGallery();
      
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      alert('Fehler beim Hochladen der Bilder. Bitte versuche es erneut.');
    } finally {
      this.uploading = false;
      this.showUploadModal = false;
    }
  }
  
  editArtwork(artwork: Artwork): void {
    this.editingArtwork = { ...artwork };
    this.showEditModal = true;
  }
  
  async saveEditedArtwork(): Promise<void> {
    if (!this.editingArtwork || !this.editingArtwork.id) return;
    
    try {
      let collectionPath = 'gallery';
      if (this.editingArtwork.type === 'subgallery') {
        collectionPath = 'subGallery';
      } else if (this.editingArtwork.type === 'photographer') {
        collectionPath = 'photographerGallery';
      }
      
      const docRef = doc(this.db, collectionPath, this.editingArtwork.id);
      
      // Extrahiere nur relevante Daten zum Speichern
      const { id, type, loaded, ...updateData } = this.editingArtwork;
      
      await updateDoc(docRef, updateData);
      
      // Aktualisiere Lokale Daten
      const index = this.artworks.findIndex(a => a.id === this.editingArtwork!.id);
      if (index !== -1) {
        this.artworks[index] = { ...this.editingArtwork };
      }
      
      this.filterImages();
      
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern. Bitte versuche es erneut.');
    } finally {
      this.showEditModal = false;
      this.editingArtwork = null;
    }
  }
  
  async deleteArtwork(artwork: Artwork): Promise<void> {
    if (!confirm(`Möchtest du "${artwork.title}" wirklich löschen?`)) return;
    
    try {
      // Bestimme die Collection basierend auf dem Typ
      let collectionPath = 'gallery';
      if (artwork.type === 'subgallery') {
        collectionPath = 'subGallery';
      } else if (artwork.type === 'photographer') {
        collectionPath = 'photographerGallery';
      }
      
      // Lösche Dokument aus Firestore
      await deleteDoc(doc(this.db, collectionPath, artwork.id));
      
      // Versuche, die Bilddatei aus dem Storage zu löschen
      try {
        // Extrahiere Dateipfad aus URL
        const url = new URL(artwork.src);
        const pathname = url.pathname;
        const storageRef = ref(this.storage, decodeURIComponent(pathname.split('/o/')[1].split('?')[0]));
        await deleteObject(storageRef);
      } catch (storageError) {
        console.warn('Konnte Bilddatei nicht löschen:', storageError);
        // Fortfahren trotz Fehler beim Löschen des Bildes
      }
      
      // Aktualisiere lokale Arrays
      this.artworks = this.artworks.filter(a => a.id !== artwork.id);
      this.filterImages();
      
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen. Bitte versuche es erneut.');
    }
  }
}