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
              // Ungeordnete Listen
              .replace(/^[\*\-] (.*)$/gim, '<li>$1</li>')
              .replace(/(?:^<li>.*<\/li>$(\n)?)+/gm, function (match) {
                return '<ul>' + match + '</ul>';
              })
              // Geordnete Listen
              .replace(/^\d+\. (.*)$/gim, '<li>$1</li>')
              .replace(/(?:^<li>.*<\/li>$(\n)?)+/gm, function (match) {
                if (!match.startsWith('<ul>')) {
                  return '<ol>' + match + '</ol>';
                }
                return match;
              })
              // Links
              .replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2" target="_blank">$1</a>'
              )
              // Absätze (muss am Ende stehen)
              .replace(/^(?!<[hou][l1-5]|<blockquote|<p)(.+)$/gim, '<p>$1</p>')
              .replace(/\n{2,}/g, '</p><p>');

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
      const requestMessage = this.workshopRequestService.createRequestMessage(
        this.workshop
      );

      this.workshopRequestService.setRequestData({
        workshopId: this.workshop.id,
        workshopTitle: this.workshop.title,
        workshopType: this.workshop.type,
        message: requestMessage,
      });

      this.router.navigate(['/contact'], {
        queryParams: {
          type: 'workshop',
          id: this.workshop.id,
        },
      });
    } else {
      // Für reguläre Workshops: Anmeldeformular anzeigen
      this.router.navigate(['/workshop-registration', this.workshop.id]);
    }
  }
}
