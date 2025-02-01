import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss']
})
export class AdminContentComponent implements OnInit {
  siteContent: string = '';
  loading: boolean = true;
  saveMessage: string = '';
  activeFormats: string[] = [];
  images: { url: string; description: string }[] = [];
  
  constructor(private dataService: DataService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.dataService.getContent('about').subscribe((content) => {
      this.siteContent = content || 'Kein Inhalt verfügbar.';
      this.loading = false;
    });
  }

  saveContent(): void {
    if (!this.siteContent.trim()) {
      this.saveMessage = '⚠️ Inhalt darf nicht leer sein.';
      return;
    }

    this.dataService.updateContent('about', this.siteContent)
      .then(() => {
        this.saveMessage = '✅ Änderungen gespeichert!';
      })
      .catch((error) => {
        console.error('Fehler beim Speichern:', error);
        this.saveMessage = '❌ Fehler beim Speichern.';
      });
  }

  updateContent(event: Event): void {
    const target = event.target as HTMLDivElement;
    this.siteContent = target.innerHTML;
  }

  formatText(command: string): void {
    document.execCommand(command, false, '');
    this.checkActiveFormats();
  }

  insertLink(): void {
    const url = prompt('Bitte geben Sie die URL ein:');
    if (url) {
      document.execCommand('createLink', false, url);
      this.checkActiveFormats();
    }
  }

  checkActiveFormats(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const parentTag = selection.getRangeAt(0).commonAncestorContainer.parentElement;
    if (!parentTag) return;

    this.activeFormats = [];
    if (parentTag.tagName === 'B' || parentTag.style.fontWeight === 'bold') this.activeFormats.push('bold');
    if (parentTag.tagName === 'I' || parentTag.style.fontStyle === 'italic') this.activeFormats.push('italic');
    if (parentTag.tagName === 'H1') this.activeFormats.push('h1');
    if (parentTag.tagName === 'H2') this.activeFormats.push('h2');
    if (parentTag.tagName === 'P') this.activeFormats.push('p');
    if (parentTag.tagName === 'UL') this.activeFormats.push('ul');
    if (parentTag.tagName === 'OL') this.activeFormats.push('ol');
    if (parentTag.tagName === 'A') this.activeFormats.push('a');
  }

  isActive(format: string): boolean {
    return this.activeFormats.includes(format);
  }
}
