import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Workshop } from '../interfaces/interfaces';

export interface WorkshopRequest {
  workshopId?: string;
  workshopTitle?: string;
  workshopType?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkshopRequestService {
  private requestDataSubject = new BehaviorSubject<WorkshopRequest | null>(null);
  public requestData$ = this.requestDataSubject.asObservable();

  constructor() { }

  /**
   * Speichert die Daten für eine Workshop-Anfrage
   */
  setRequestData(data: WorkshopRequest): void {
    this.requestDataSubject.next(data);
  }

  /**
   * Löscht die gespeicherten Anfragedaten
   */
  clearRequestData(): void {
    this.requestDataSubject.next(null);
  }

  /**
   * Erstellt eine Anfrage-Nachricht basierend auf einem Workshop
   */
  createRequestMessage(workshop: Workshop): string {
    let message = `Hallo Isabel,\n\nich interessiere mich für den Workshop "${workshop.title}".`;
    
    if (workshop.date) {
      message += `\nDatum: ${workshop.date}`;
    }
    
    if (workshop.type === 'individuelleAnfrage') {
      message += `\n\nIch hätte folgende Fragen/Wünsche:\n\n`;
    } else {
      message += `\n\nBitte halte mir einen Platz frei.\n\nVielen Dank!\nMit freundlichen Grüßen`;
    }
    
    return message;
  }
}