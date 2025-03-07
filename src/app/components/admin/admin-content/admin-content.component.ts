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
        lastUpdated: new Date().toISOString()
      };

      const contentJson = JSON.stringify(pageContent);

      await this.dataService.updateContent(this.selectedPage, { text: contentJson });

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
    const textarea = document.querySelector(
      '#editorTextarea'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'ul':
        // Für jede Zeile im ausgewählten Text
        formattedText = selectedText
          .split('\n')
          .map((line) => `- ${line}`)
          .join('\n');
        break;
      case 'ol':
        // Für jede Zeile im ausgewählten Text, nummerierte Liste
        formattedText = selectedText
          .split('\n')
          .map((line, index) => `${index + 1}. ${line}`)
          .join('\n');
        break;
    }

    // Ersetze den ausgewählten Text mit formatiertem Text
    textarea.setRangeText(formattedText, start, end, 'select');
    // Fokussiere zurück auf das Textarea
    textarea.focus();

    // Aktualisiere die Formulardaten
    if (this.currentSectionIndex !== -1) {
      this.contentSections[this.currentSectionIndex].content = textarea.value;
    }
  }

  // Formulare zurücksetzen nach dem Speichern
  resetFormsAfterSave(): void {
    // Optional: Formulare zurücksetzen
    this.contentSections = [];
    this.currentSectionIndex = -1;
    // Wenn wir komplettes Zurücksetzen wollen:
    // this.loadSelectedContent();

    // Oder nur eine Erfolgsmeldung zeigen, ohne Formulare zurückzusetzen
    this.saveSuccess = true;
    this.saveMessage = 'Inhalt erfolgreich gespeichert!';

    // Blende die Nachricht nach 3 Sekunden aus
    setTimeout(() => {
      this.saveMessage = '';
    }, 3000);
  }
}
