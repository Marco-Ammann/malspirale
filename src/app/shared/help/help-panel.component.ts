import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HelpService, HelpTopic } from '../../core/services/help.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-help-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.scss']
})
export class HelpPanelComponent implements OnInit, OnDestroy {
  showPanel = false;
  currentTopic: HelpTopic | undefined;
  allTopics: HelpTopic[] = [];
  
  private subscriptions = new Subscription();

  constructor(
    private helpService: HelpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Abonniere Änderungen am Hilfepanel-Status
    this.subscriptions.add(
      this.helpService.showHelpPanel$.subscribe(show => {
        this.showPanel = show;
      })
    );
    
    // Abonniere Änderungen am aktuellen Hilfethema
    this.subscriptions.add(
      this.helpService.currentTopic$.subscribe(topicId => {
        if (topicId) {
          this.currentTopic = this.helpService.getHelpTopic(topicId);
        } else {
          // Wenn kein spezifisches Thema, wähle basierend auf der aktuellen Route
          this.setTopicFromRoute(this.router.url);
        }
      })
    );
    
    // Überwache Routenwechsel für kontextsensitive Hilfe
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        if (this.showPanel) {
          this.setTopicFromRoute(event.url);
        }
      })
    );
    
    // Lade alle Hilfethemen
    this.allTopics = this.helpService.getAllTopics();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  closePanel(): void {
    this.helpService.closeHelpPanel();
  }
  
  setTopicFromRoute(url: string): void {
    // Extrahiere den Hauptpfad aus der URL
    const path = url.split('/')[1] || '';
    
    if (path === 'admin') {
      // Für Admin-Routen den nächsten Pfadteil verwenden oder 'dashboard' als Standard
      const subPath = url.split('/')[2] || 'dashboard';
      const topic = this.helpService.getHelpTopic(subPath);
      
      if (topic) {
        this.currentTopic = topic;
      } else {
        // Fallback auf Dashboard, wenn kein passender Eintrag gefunden wurde
        this.currentTopic = this.helpService.getHelpTopic('dashboard');
      }
    } else {
      // Fallback für nicht-Admin-Routen
      this.currentTopic = this.helpService.getHelpTopic('dashboard');
    }
  }
  
  selectTopic(topicId: string): void {
    this.helpService.setCurrentTopic(topicId);
  }
  
  playVideo(): void {
    // Hier könnte die Implementierung für das Abspielen eines Hilfvideos erfolgen
    alert('Video wird abgespielt: ' + this.currentTopic?.videoUrl);
  }
}