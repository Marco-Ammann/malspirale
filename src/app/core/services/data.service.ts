import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Workshop, GalleryImage } from '../interfaces/interfaces';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  arrayRemove,
  arrayUnion,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { firebaseApp } from '../../../firebase-config';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private db = getFirestore(firebaseApp);

  constructor() {}

  // Workshops abrufen (Live-Updates)
  getWorkshops(): Observable<Workshop[]> {
    return new Observable((observer) => {
      const workshopsCollection = collection(this.db, 'workshops');

      // Firestore Live-Listener für Echtzeit-Updates
      onSnapshot(workshopsCollection, (querySnapshot) => {
        const workshops = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workshop[];
        observer.next(workshops);
      });
    });
  }

  // Workshop anhand der ID abrufen
  getWorkshopById(id: string): Observable<Workshop | null> {
    return from(
      getDoc(doc(this.db, 'workshops', id)).then((docSnap) =>
        docSnap.exists()
          ? ({ id: docSnap.id, ...docSnap.data() } as Workshop)
          : null
      )
    );
  }

  // Workshop erstellen
  createWorkshop(workshop: Omit<Workshop, 'id'>): Promise<void> {
    return addDoc(collection(this.db, 'workshops'), {
      ...workshop,
      participants: [],
      createdAt: new Date(),
    }).then(() => console.log('Workshop erstellt!'));
  }

  // Workshop aktualisieren (Live-Update in Firestore)
  updateWorkshop(id: string, updates: Partial<Workshop>): Promise<void> {
    return updateDoc(doc(this.db, 'workshops', id), updates);
  }

  // Workshop löschen
  deleteWorkshop(id: string): Promise<void> {
    return deleteDoc(doc(this.db, 'workshops', id)).then(() =>
      console.log('Workshop gelöscht!')
    );
  }

  // Nutzer anmelden
  async enrollUser(workshopId: string, userId: string): Promise<void> {
    const workshopRef = doc(this.db, 'workshops', workshopId);
    const docSnap = await getDoc(workshopRef);

    if (docSnap.exists()) {
      const workshop = docSnap.data();
      if (workshop['availableSlots'] > 0) {
        await updateDoc(workshopRef, {
          participants: arrayUnion(userId),
          availableSlots: workshop['availableSlots'] - 1,
        });
      }
    }
  }

  // Nutzer abmelden
  async unenrollUser(workshopId: string, userId: string): Promise<void> {
    const workshopRef = doc(this.db, 'workshops', workshopId);
    const docSnap = await getDoc(workshopRef);

    if (docSnap.exists()) {
      await updateDoc(workshopRef, {
        participants: arrayRemove(userId),
        availableSlots: docSnap.data()?.['availableSlots'] + 1,
      });
    }
  }

  getEnrolledWorkshops(userId: string): Observable<Workshop[]> {
    return new Observable((observer) => {
      const workshopsCollection = collection(this.db, 'workshops');
  
      onSnapshot(workshopsCollection, (querySnapshot) => {
        const enrolledWorkshops = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Workshop))
          .filter((workshop) => workshop.participants?.includes(userId));
        observer.next(enrolledWorkshops);
      });
    });
  }

  async getLastContentUpdate(): Promise<Date | null> {
    const contentCollection = collection(this.db, 'content');
    const contentQuery = query(contentCollection, orderBy('updatedAt', 'desc'), limit(1));
    const snapshot = await getDocs(contentQuery);
  
    if (!snapshot.empty) {
      return new Date(snapshot.docs[0].data()['updatedAt']);
    }
    return null;
  }
}
