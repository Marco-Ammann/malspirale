import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GalleryImage, Workshop } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private workshops: Workshop[] = [
    {
      id: '1',
      title: 'Pastellmalerei Grundlagen',
      date: '2025-01-15',
      maxParticipants: 10,
      availableSlots: 7,
      description: 'Ein Workshop für Einsteiger in die Pastellmalerei.',
      location: 'Generationehuus Schwarzenburg',
    },
    {
      id: '2',
      title: 'Acryltechniken für Fortgeschrittene',
      date: '2025-02-10',
      maxParticipants: 8,
      availableSlots: 3,
      description: 'Entdecke fortgeschrittene Techniken der Acrylmalerei.',
      location: 'Generationehuus Schwarzenburg',
    },
  ];

  private images: GalleryImage[] = [
    {
      id: '1',
      title: 'Bild 1',
      description: 'Beschreibung Bild 1',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'Bild 2',
      description: 'Beschreibung Bild 2',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      title: 'Bild 3',
      description: 'Beschreibung Bild 3',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      title: 'Bild 4',
      description: 'Beschreibung Bild 4',
      imageUrl: 'https://via.placeholder.com/150',
    }
  ];

  // Gibt den Workshop anhand der ID zurück
  getWorkshopById(id: string): Observable<Workshop | undefined> {
    const workshop = this.workshops.find((w) => w.id === id);
    return of(workshop);
  }

  // Optional: Alle Workshops abrufen
  getAllWorkshops(): Observable<Workshop[]> {
    return of(this.workshops);
  }


  getImages(): Observable<GalleryImage[]> {
    return of(this.images);
  }

  
}
