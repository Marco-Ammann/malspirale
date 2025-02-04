import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DataService } from '../../../core/services/data.service';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { ContentData } from '../../../core/interfaces/interfaces';
import Quill from 'quill';


@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [FormsModule, CommonModule, QuillModule],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss']
})
export class AdminContentComponent implements OnInit {
  siteContent: string = '';
  loading: boolean = true;
  saveMessage: string = '';
  images: { url: string; description: string }[] = [];
  storage = getStorage();

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadContent();
  }

  async loadContent(): Promise<void> {
    try {
      this.siteContent = await this.dataService.getContent('about');
    } catch (error) {
      console.error('Fehler beim Laden des Inhalts:', error);
      this.siteContent = 'Fehler beim Laden des Inhalts.';
    } finally {
      this.loading = false;
    }
  }

  
  async saveContent(): Promise<void> {
    try {
      await this.dataService.updateContent('about', { text: this.siteContent });
      this.saveMessage = '✅ Inhalt erfolgreich gespeichert!';
    } catch (error) {
      console.error('Fehler beim Speichern des Inhalts:', error);
      this.saveMessage = '⚠ Fehler beim Speichern.';
    }
  }

  async uploadImage(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const file = target.files[0];

    if (!file.type.startsWith('image/')) {
      this.saveMessage = '❌ Nur Bilder erlaubt!';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.saveMessage = '❌ Datei zu groß (max. 5MB erlaubt)!';
      return;
    }

    try {
      const filePath = `images/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);

      this.images.push({ url, description: '' });
      this.saveMessage = '✅ Bild erfolgreich hochgeladen!';
    } catch (error) {
      console.error('Fehler beim Upload:', error);
      this.saveMessage = '❌ Fehler beim Hochladen!';
    }
  }

  async deleteImage(index: number): Promise<void> {
    const image = this.images[index];

    try {
      const imagePath = this.extractFilePath(image.url);
      const storageRef = ref(this.storage, imagePath);

      await deleteObject(storageRef);
      this.images.splice(index, 1);
      this.saveMessage = '✅ Bild erfolgreich gelöscht!';
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      this.saveMessage = '❌ Fehler beim Löschen des Bildes!';
    }
  }

  private extractFilePath(url: string): string {
    const matches = url.match(/images%2F(.*?)\?alt/);
    return matches && matches.length > 1 ? `images/${decodeURIComponent(matches[1])}` : '';
  }
}
