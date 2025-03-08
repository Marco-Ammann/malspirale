import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { StorageService } from '../../../core/services/storage.service';

interface ContentSection {
  type: 'text' | 'image' | 'gallery' | 'quote';
  title?: string;
  content?: string;
  imageUrl?: string;
  imageCaption?: string;
  quoteAuthor?: string;
  galleryImages?: { url: string; caption?: string }[];
}

interface PageContent {
  sections: ContentSection[];
  lastUpdated: string;
}

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
})
export class AdminContentComponent implements OnInit {
  selectedPage = 'about';
  loading = true;
  saving = false;
  saveMessage = '';
  saveSuccess = false;

  contentSections: ContentSection[] = [];
  originalContent: string = '';
  currentSectionIndex = -1;

  constructor(
    private dataService: DataService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadSelectedContent();
  }

  loadSelectedContent(): void {
    this.loading = true;
    this.currentSectionIndex = -1;

    this.dataService
      .getContent(this.selectedPage)
      .then((content) => {
        this.originalContent = content;

        try {
          // Versuche, JSON zu parsen
          const pageContent: PageContent = JSON.parse(content);
          this.contentSections = pageContent.sections || [];
        } catch (error) {
          // Fallback: Behandle alten Inhalt als einzelnen Textabschnitt
          this.contentSections = [
            {
              type: 'text',
              title: 'Hauptinhalt',
              content: content,
            },
          ];
        }

        // Wähle den ersten Abschnitt, wenn vorhanden
        if (this.contentSections.length > 0) {
          this.selectSection(0);
        }

        this.loading = false;
      })
      .catch((error) => {
        console.error('Fehler beim Laden des Inhalts:', error);
        this.contentSections = [];
        this.loading = false;
      });
  }

  selectSection(index: number): void {
    this.currentSectionIndex = index;
  }

  addSection(): void {
    const newSection: ContentSection = {
      type: 'text',
      title: 'Neuer Abschnitt',
      content: '',
    };

    this.contentSections.push(newSection);
    this.selectSection(this.contentSections.length - 1);
  }

  deleteSection(index: number): void {
    if (confirm('Möchtest du diesen Abschnitt wirklich löschen?')) {
      this.contentSections.splice(index, 1);

      if (this.currentSectionIndex === index) {
        this.currentSectionIndex = Math.min(
          index,
          this.contentSections.length - 1
        );
      } else if (this.currentSectionIndex > index) {
        this.currentSectionIndex--;
      }
    }
  }

  moveSection(index: number, direction: number): void {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= this.contentSections.length) {
      return;
    }

    // Tausche Abschnitte
    [this.contentSections[index], this.contentSections[newIndex]] = [
      this.contentSections[newIndex],
      this.contentSections[index],
    ];

    // Aktualisiere den ausgewählten Index
    this.currentSectionIndex = newIndex;
  }

  onSectionTypeChange(): void {
    const section = this.contentSections[this.currentSectionIndex];

    // Initialisiere Felder je nach Typ
    switch (section.type) {
      case 'image':
        section.imageUrl = section.imageUrl || '';
        section.imageCaption = section.imageCaption || '';
        break;
      case 'gallery':
        section.galleryImages = section.galleryImages || [];
        break;
      case 'quote':
        section.content = section.content || '';
        section.quoteAuthor = section.quoteAuthor || '';
        break;
    }
  }

  async handleImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    try {
      const url = await this.storageService.uploadFile(file);
      this.contentSections[this.currentSectionIndex].imageUrl = url;
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error);
      alert('Fehler beim Hochladen des Bildes. Bitte versuche es erneut.');
    }
  }

  removeImage(): void {
    this.contentSections[this.currentSectionIndex].imageUrl = '';
  }

  async handleGalleryImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    // Initialisiere Gallerie-Array, falls nicht vorhanden
    if (!this.contentSections[this.currentSectionIndex].galleryImages) {
      this.contentSections[this.currentSectionIndex].galleryImages = [];
    }

    // Hochladen mehrerer Bilder
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      try {
        const url = await this.storageService.uploadFile(file);
        this.contentSections[this.currentSectionIndex].galleryImages!.push({
          url,
          caption: '',
        });
      } catch (error) {
        console.error(`Fehler beim Hochladen von Bild ${i + 1}:`, error);
      }
    }
  }

  moveGalleryImage(index: number, direction: number): void {
    const galleryImages =
      this.contentSections[this.currentSectionIndex].galleryImages;
    if (!galleryImages) return;

    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= galleryImages.length) {
      return;
    }
    // Tausche Bilder
    [galleryImages[index], galleryImages[newIndex]] = [
      galleryImages[newIndex],
      galleryImages[index],
    ];
  }

  removeGalleryImage(index: number): void {
    const galleryImages =
      this.contentSections[this.currentSectionIndex].galleryImages;
    if (!galleryImages) return;

    galleryImages.splice(index, 1);
  }

  async saveContent(): Promise<void> {
    this.saving = true;
    this.saveMessage = '';

    try {
      // Erstelle strukturiertes JSON für den Inhalt
      const pageContent: PageContent = {
        sections: this.contentSections,
        lastUpdated: new Date().toISOString(),
      };

      const contentJson = JSON.stringify(pageContent);

      await this.dataService.updateContent(this.selectedPage, {
        text: contentJson,
      });

      this.resetFormsAfterSave();
      this.saveSuccess = true;
      this.saveMessage = 'Inhalt erfolgreich gespeichert!';
      this.originalContent = contentJson;
    } catch (error) {
      console.error('Fehler beim Speichern des Inhalts:', error);
      this.saveSuccess = false;
      this.saveMessage =
        'Fehler beim Speichern des Inhalts. Bitte versuche es erneut.';
    } finally {
      this.saving = false;

      // Blende die Nachricht nach 3 Sekunden aus
      setTimeout(() => {
        this.saveMessage = '';
      }, 3000);
    }
  }

  resetContent(): void {
    if (confirm('Möchtest du wirklich alle Änderungen verwerfen?')) {
      this.loadSelectedContent();
    }
  }

  applyFormat(format: string): void {
    const textarea = document.querySelector('#editorTextarea') as HTMLTextAreaElement;
    if (!textarea) return;
  
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';
    let cursorPos = 0;
  
    // Prüfen, ob bereits formatiert ist und ggf. Formatierung entfernen
    if (selectedText) {
      switch (format) {
        case 'bold':
          if (selectedText.startsWith('**') && selectedText.endsWith('**')) {
            // Formatierung entfernen
            formattedText = selectedText.substring(2, selectedText.length - 2);
            cursorPos = start + formattedText.length;
          } else {
            // Formatierung hinzufügen
            formattedText = `**${selectedText}**`;
            cursorPos = start + formattedText.length;
          }
          break;
        case 'italic':
          if (selectedText.startsWith('*') && selectedText.endsWith('*')) {
            // Formatierung entfernen
            formattedText = selectedText.substring(1, selectedText.length - 1);
            cursorPos = start + formattedText.length;
          } else {
            // Formatierung hinzufügen
            formattedText = `*${selectedText}*`;
            cursorPos = start + formattedText.length;
          }
          break;
        case 'underline':
          if (selectedText.startsWith('<u>') && selectedText.endsWith('</u>')) {
            // Formatierung entfernen
            formattedText = selectedText.substring(3, selectedText.length - 4);
            cursorPos = start + formattedText.length;
          } else {
            // Formatierung hinzufügen
            formattedText = `<u>${selectedText}</u>`;
            cursorPos = start + formattedText.length;
          }
          break;
        case 'h2':
          // Überprüfen, ob die Zeile bereits mit ## beginnt
          const beforeSelection = textarea.value.substring(0, start);
          const lineStart = beforeSelection.lastIndexOf('\n') + 1;
          const line = textarea.value.substring(lineStart, start) + selectedText;
          
          if (line.trim().startsWith('## ')) {
            // Formatierung entfernen
            const withoutH2 = line.replace(/^## /, '');
            formattedText = withoutH2;
            textarea.setRangeText(formattedText, lineStart, start + selectedText.length, 'select');
            return;
          } else {
            // Prüfen, ob am Anfang einer Zeile
            const isStartOfLine = start === 0 || beforeSelection.endsWith('\n');
            if (isStartOfLine) {
              formattedText = `## ${selectedText}`;
            } else {
              formattedText = `\n## ${selectedText}`;
            }
            cursorPos = start + formattedText.length;
          }
          break;
        case 'h3':
          // Ähnliche Logik wie für h2
          const beforeH3 = textarea.value.substring(0, start);
          const lineStartH3 = beforeH3.lastIndexOf('\n') + 1;
          const lineH3 = textarea.value.substring(lineStartH3, start) + selectedText;
          
          if (lineH3.trim().startsWith('### ')) {
            // Formatierung entfernen
            const withoutH3 = lineH3.replace(/^### /, '');
            formattedText = withoutH3;
            textarea.setRangeText(formattedText, lineStartH3, start + selectedText.length, 'select');
            return;
          } else {
            // Prüfen, ob am Anfang einer Zeile
            const isStartOfLineH3 = start === 0 || beforeH3.endsWith('\n');
            if (isStartOfLineH3) {
              formattedText = `### ${selectedText}`;
            } else {
              formattedText = `\n### ${selectedText}`;
            }
            cursorPos = start + formattedText.length;
          }
          break;
        case 'quote':
          // Prüfen, ob bereits ein Zitat
          const beforeQuote = textarea.value.substring(0, start);
          const lineStartQuote = beforeQuote.lastIndexOf('\n') + 1;
          const lineQuote = textarea.value.substring(lineStartQuote, start) + selectedText;
          
          if (lineQuote.trim().startsWith('> ')) {
            // Formatierung entfernen
            const withoutQuote = lineQuote.replace(/^> /, '');
            formattedText = withoutQuote;
            textarea.setRangeText(formattedText, lineStartQuote, start + selectedText.length, 'select');
            return;
          } else {
            // Zitat hinzufügen
            const isStartOfLineQuote = start === 0 || beforeQuote.endsWith('\n');
            if (isStartOfLineQuote) {
              formattedText = `> ${selectedText}`;
            } else {
              formattedText = `\n> ${selectedText}`;
            }
            cursorPos = start + formattedText.length;
          }
          break;
        case 'ul':
          // Aufzählungszeichen für jede Zeile
          const lines = selectedText.split('\n');
          const formattedLines = lines.map(line => {
            // Überprüfen, ob bereits eine Liste
            if (line.trim().startsWith('- ')) {
              return line.replace(/^(\s*)- /, '$1');
            } else if (line.trim()) {
              return `- ${line}`;
            }
            return line;
          });
          formattedText = formattedLines.join('\n');
          cursorPos = start + formattedText.length;
          break;
        case 'ol':
          // Nummerierte Liste
          const olLines = selectedText.split('\n');
          const formattedOlLines = olLines.map((line, index) => {
            // Entferne bestehende Nummerierung
            if (/^\d+\.\s/.test(line.trim())) {
              return line.replace(/^\s*\d+\.\s/, '');
            } else if (line.trim()) {
              return `${index + 1}. ${line}`;
            }
            return line;
          });
          formattedText = formattedOlLines.join('\n');
          cursorPos = start + formattedText.length;
          break;
      }
    } else {
      // Wenn kein Text ausgewählt ist, füge Platzhalter ein
      switch (format) {
        case 'bold':
          formattedText = '**Fettschrift**';
          cursorPos = start + 2; // Position nach ersten **
          break;
        case 'italic':
          formattedText = '*Kursiv*';
          cursorPos = start + 1; // Position nach erstem *
          break;
        case 'underline':
          formattedText = '<u>Unterstrichen</u>';
          cursorPos = start + 3; // Position nach <u>
          break;
        case 'h2':
          const beforeEmptyH2 = textarea.value.substring(0, start);
          const isStartOfLineEmptyH2 = start === 0 || beforeEmptyH2.endsWith('\n');
          if (isStartOfLineEmptyH2) {
            formattedText = '## Überschrift 2';
          } else {
            formattedText = '\n## Überschrift 2';
          }
          cursorPos = start + formattedText.length - 'Überschrift 2'.length;
          break;
        case 'h3':
          const beforeEmptyH3 = textarea.value.substring(0, start);
          const isStartOfLineEmptyH3 = start === 0 || beforeEmptyH3.endsWith('\n');
          if (isStartOfLineEmptyH3) {
            formattedText = '### Überschrift 3';
          } else {
            formattedText = '\n### Überschrift 3';
          }
          cursorPos = start + formattedText.length - 'Überschrift 3'.length;
          break;
        case 'quote':
          const beforeEmptyQuote = textarea.value.substring(0, start);
          const isStartOfLineEmptyQuote = start === 0 || beforeEmptyQuote.endsWith('\n');
          if (isStartOfLineEmptyQuote) {
            formattedText = '> Zitat';
          } else {
            formattedText = '\n> Zitat';
          }
          cursorPos = start + formattedText.length - 'Zitat'.length;
          break;
        case 'ul':
          formattedText = '- Listenpunkt';
          cursorPos = start + formattedText.length - 'Listenpunkt'.length;
          break;
        case 'ol':
          formattedText = '1. Nummerierter Punkt';
          cursorPos = start + formattedText.length - 'Nummerierter Punkt'.length;
          break;
      }
    }
  
    // Ersetze den ausgewählten Text mit dem formatierten Text
    textarea.setRangeText(formattedText, start, end, 'select');
    
    // Setze Cursor an die richtige Position
    textarea.setSelectionRange(cursorPos, cursorPos);
    
    // Fokussiere zurück auf das Textarea
    textarea.focus();
  
    // Aktualisiere die Formulardaten
    if (this.currentSectionIndex !== -1) {
      this.contentSections[this.currentSectionIndex].content = textarea.value;
    }
  }

  resetFormsAfterSave(): void {
    // Inhalte nach dem Speichern neu laden
    this.loadSelectedContent();

    // Erfolgsmeldung anzeigen
    this.saveSuccess = true;
    this.saveMessage = 'Inhalt erfolgreich gespeichert!';

    // Meldung nach 3 Sekunden ausblenden
    setTimeout(() => {
      this.saveMessage = '';
    }, 3000);
  }
}
