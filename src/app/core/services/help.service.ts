import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface HelpTopic {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  steps?: { title: string; description: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private showHelpPanelSubject = new BehaviorSubject<boolean>(false);
  private currentTopicSubject = new BehaviorSubject<string>('');
  private firstVisitSubject = new BehaviorSubject<boolean>(true);
  
  showHelpPanel$ = this.showHelpPanelSubject.asObservable();
  currentTopic$ = this.currentTopicSubject.asObservable();
  firstVisit$ = this.firstVisitSubject.asObservable();
  
  private helpTopics: Record<string, HelpTopic> = {
    'dashboard': {
      id: 'dashboard',
      title: 'Admin Dashboard',
      content: 'Hier findest du eine Übersicht deiner Website. Du kannst auf die Kacheln klicken, um zu den verschiedenen Bereichen zu gelangen.',
      steps: [
        {
          title: 'Schnellzugriff',
          description: 'Verwende die Schnellzugriff-Buttons für häufige Aufgaben wie das Erstellen eines neuen Workshops.'
        },
        {
          title: 'Statistiken',
          description: 'Hier siehst du aktuelle Zahlen wie Besucher, Workshops und neueste Aktivitäten.'
        }
      ]
    },
    'workshops': {
      id: 'workshops',
      title: 'Workshop-Verwaltung',
      content: 'Hier kannst du deine Workshops erstellen, bearbeiten und verwalten.',
      steps: [
        {
          title: 'Neuen Workshop erstellen',
          description: 'Klicke auf "Neuer Workshop" und folge dem Assistenten, der dich durch alle notwendigen Schritte führt.'
        },
        {
          title: 'Bestehende Workshops bearbeiten',
          description: 'Klicke auf den "Bearbeiten"-Button bei einem Workshop, um dessen Details zu ändern.'
        },
        {
          title: 'Workshop duplizieren',
          description: 'Du kannst einen bestehenden Workshop als Vorlage verwenden, indem du auf "Duplizieren" klickst.'
        }
      ],
      videoUrl: 'https://example.com/help/workshops'
    },
    'gallery': {
      id: 'gallery',
      title: 'Galerie-Verwaltung',
      content: 'Hier kannst du Bilder hochladen, organisieren und verschiedene Galerien verwalten.',
      steps: [
        {
          title: 'Bilder hochladen',
          description: 'Klicke auf "Bilder hinzufügen" und wähle die Bilder aus, die du hochladen möchtest. Du kannst auch Bilder per Drag & Drop in den Upload-Bereich ziehen.'
        },
        {
          title: 'Galerien wechseln',
          description: 'Wähle im Dropdown-Menü "Galerie" aus, welche Art von Galerie du bearbeiten möchtest: Hauptgalerie, Untergalerie oder Fotografen-Galerie.'
        },
        {
          title: 'Bilder bearbeiten',
          description: 'Klicke auf ein Bild und dann auf das Bearbeiten-Symbol, um Titel und Beschreibung zu ändern.'
        }
      ],
      videoUrl: 'https://example.com/help/gallery'
    },
    'content': {
      id: 'content',
      title: 'Inhalte bearbeiten',
      content: 'Hier kannst du die Texte und Inhalte deiner Website bearbeiten.',
      steps: [
        {
          title: 'Seite auswählen',
          description: 'Wähle zunächst die Seite aus, die du bearbeiten möchtest (z.B. "Über mich").'
        },
        {
          title: 'Abschnitte verwalten',
          description: 'Du kannst Abschnitte hinzufügen, löschen oder ihre Reihenfolge ändern.'
        },
        {
          title: 'Text formatieren',
          description: 'Verwende die Formatierungswerkzeuge, um deinen Text zu gestalten (fett, kursiv, Überschriften, usw.).'
        }
      ]
    }
  };

  constructor() {
    // Prüfe, ob der Nutzer die Seite zum ersten Mal besucht
    const hasVisited = localStorage.getItem('hasVisitedAdmin');
    if (hasVisited) {
      this.firstVisitSubject.next(false);
    } else {
      localStorage.setItem('hasVisitedAdmin', 'true');
    }
  }

  toggleHelpPanel(): void {
    this.showHelpPanelSubject.next(!this.showHelpPanelSubject.value);
  }

  openHelpPanel(): void {
    this.showHelpPanelSubject.next(true);
  }

  closeHelpPanel(): void {
    this.showHelpPanelSubject.next(false);
  }

  setCurrentTopic(topicId: string): void {
    this.currentTopicSubject.next(topicId);
    this.openHelpPanel();
  }

  getHelpTopic(topicId: string): HelpTopic | undefined {
    return this.helpTopics[topicId];
  }

  getAllTopics(): HelpTopic[] {
    return Object.values(this.helpTopics);
  }

  markFirstVisitComplete(): void {
    this.firstVisitSubject.next(false);
  }
}