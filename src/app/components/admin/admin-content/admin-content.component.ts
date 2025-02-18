import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DataService } from '../../../core/services/data.service';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminContentComponent implements OnInit {
  siteContent: string = '';
  loading = true;
  saveMessage: string = '';
  images: { url: string; description: string }[] = [];
  storage = getStorage();
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: [1, 2, false] }],
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
      console.error('Error loading content:', error);
      this.siteContent = 'Error loading content.';
    } finally {
      this.loading = false;
    }
  }

  private fixEmptyParagraphs(html: string): string {
    // Replaces <p></p> and <p>&nbsp;</p> (or similar) with <p><br/></p>
    return html.replace(/<p>(\s|&nbsp;)*<\/p>/g, '<p><br/></p>');
  }

  async saveContent(): Promise<void> {
    try {
      let cleanedContent = this.siteContent.replace(/&nbsp;/g, ' ');
      cleanedContent = this.fixEmptyParagraphs(cleanedContent);
      await this.dataService.updateContent('about', { text: cleanedContent });
      this.saveMessage = '✅ Content saved successfully!';
    } catch (error) {
      console.error('Error saving content:', error);
      this.saveMessage = '⚠ Error saving content.';
    }
  }

  async uploadImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const filePath = `images/${file.name}`;
    try {
      const storageRef = ref(this.storage, filePath);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      this.images.push({ url, description: '' });
      this.saveMessage = '✅ Image uploaded successfully!';
    } catch (error) {
      console.error('Upload error:', error);
      this.saveMessage = '❌ Error uploading image!';
    }
  }

  async deleteImage(index: number): Promise<void> {
    const image = this.images[index];
    try {
      const imagePath = this.extractFilePath(image.url);
      const storageRef = ref(this.storage, imagePath);
      await deleteObject(storageRef);
      this.images.splice(index, 1);
      this.saveMessage = '✅ Image deleted successfully!';
    } catch (error) {
      console.error('Delete error:', error);
      this.saveMessage = '❌ Error deleting image!';
    }
  }

  private extractFilePath(url: string): string {
    const matches = url.match(/images%2F(.*?)\?alt/);
    return matches && matches.length > 1 ? `images/${decodeURIComponent(matches[1])}` : '';
  }
}