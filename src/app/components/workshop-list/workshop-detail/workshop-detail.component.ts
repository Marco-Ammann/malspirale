import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService } from '../../../core/services/data.service';
import { WorkshopRequestService } from '../../../core/services/workshop-request.service';
import { Workshop } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'app-workshop-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss'],
})
export class WorkshopDetailComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private workshopRequestService = inject(WorkshopRequestService);
  
  imageLoaded = false;
  isPortraitImage = false;
  workshop!: Workshop;
  parsedDescription: SafeHtml = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.getWorkshop(id).subscribe({
        next: (data: Workshop) => {
          // Prüfen, ob der Workshop veröffentlicht ist
          if (data.status === 'draft') {
            // Wenn es ein Entwurf ist, zur Liste zurückleiten
            this.router.navigate(['/workshops']);
            return;
          }
          
          this.workshop = data;
          // Markdown in HTML konvertieren
          if (this.workshop.description) {
            let html = this.workshop.description
              // Überschriften
              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
              // Fettschrift
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              // Kursiv
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              // Zitate
              .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
              // Listen (verbessert für mehrere Einträge)
              .replace(/^\- (.*$)/gim, '<li>$1</li>')
              .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
              // Unterstrichen (bereits als HTML)
              // Absätze
              .replace(/\n\s*\n/g, '</p><p>')
              // Listen zusammenfassen
              .replace(/<li>(.*?)<\/li>/g, function(match) {
                return match.replace(/\n/g, '');
              })
              // Listen mit entsprechenden ul/ol-Tags umgeben
              .replace(/(<li>.*?<\/li>)(?!\s*<li>)/gs, '<ul>$1</ul>')
              // Umschließe alles in Absätze
              .replace(/^(.+)$/gim, function(match) {
                if (!match.startsWith('<h') && !match.startsWith('<ul') && 
                    !match.startsWith('<li>') && !match.startsWith('<blockquote')) {
                  return '<p>' + match + '</p>';
                }
                return match;
              })
              // Bereinige überzählige Tags
              .replace(/<\/p><p><\/p><p>/g, '</p><p>')
              .replace(/<\/ul><p>/g, '</ul>')
              .replace(/<p><ul>/g, '<ul>');

            // Als sicheren HTML-Inhalt markieren
            this.parsedDescription =
              this.sanitizer.bypassSecurityTrustHtml(html);
          }
        },
        error: (err: any) => {
          console.error('Workshop nicht gefunden', err);
          this.router.navigate(['/workshops']);
        },
      });
    }
  }

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    this.imageLoaded = true;
    
    // Bildformat bestimmen
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      this.isPortraitImage = ratio < 0.8; // Ratio kleiner als 0.8 = Portrait
    }
  }

  registerForWorkshop(): void {
    if (!this.workshop) return;
    
    if (this.workshop.type === 'individuelleAnfrage') {
      // Für individuelle Anfragen: zum Kontaktformular weiterleiten
      const requestMessage = this.workshopRequestService.createRequestMessage(this.workshop);
      
      this.workshopRequestService.setRequestData({
        workshopId: this.workshop.id,
        workshopTitle: this.workshop.title,
        workshopType: this.workshop.type,
        message: requestMessage
      });
      
      this.router.navigate(['/contact'], { 
        queryParams: { 
          type: 'workshop',
          id: this.workshop.id 
        }
      });
    } else {
      // Für reguläre Workshops: Anmeldeformular anzeigen
      this.router.navigate(['/workshop-registration', this.workshop.id]);
    }
  }
}