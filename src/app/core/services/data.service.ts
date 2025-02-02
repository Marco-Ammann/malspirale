import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Workshop, GalleryImage, ContentData } from '../interfaces/interfaces';
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
  setDoc,
} from 'firebase/firestore';
import { firebaseApp } from '../../../firebase-config';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private db = getFirestore(firebaseApp);
  private workshopsSubject = new BehaviorSubject<Workshop[]>([]);
  workshops$ = this.workshopsSubject.asObservable();
  
  constructor() {
    this.loadWorkshops();
  }


  // 🔄 Workshops mit Echtzeit-Updates laden
  private loadWorkshops() {
    const workshopsCollection = collection(this.db, 'workshops');
    const q = query(workshopsCollection, orderBy('date', 'asc'));

    onSnapshot(q, (querySnapshot) => {
      const workshops = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workshop[];
      this.workshopsSubject.next(workshops);
    });
  }

  // 🔍 Einzelnen Workshop abrufen
  async getWorkshop(id: string): Promise<Workshop | null> {
    try {
      const docRef = doc(this.db, 'workshops', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Workshop) : null;
    } catch (error) {
      console.error('Fehler beim Abrufen des Workshops:', error);
      return null;
    }
  }

  // 📜 Alle Workshops abrufen (ohne Live-Updates)
  async getAllWorkshops(): Promise<Workshop[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'workshops'));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Workshop[];
    } catch (error) {
      console.error('Fehler beim Abrufen der Workshops:', error);
      return [];
    }
  }


  // ➕ Neuen Workshop hinzufügen
  async addWorkshop(workshop: Workshop): Promise<void> {
    try {
      console.log("📡 Firestore: Speichere Workshop...", workshop);
      const workshopsCollection = collection(this.db, 'workshops');
      await addDoc(workshopsCollection, {
        ...workshop,
        createdAt: new Date().toISOString(),  // Zeitstempel hinzufügen
      });
      console.log("✅ Firestore: Workshop gespeichert!");
    } catch (error) {
      console.error("❌ Firestore-Fehler beim Speichern:", error);
      throw error;
    }
  }

  // 📝 Workshop aktualisieren
  async updateWorkshop(id: string, data: Partial<Workshop>): Promise<void> {
    try {
      console.log(`📡 Firestore: Aktualisiere Workshop mit ID ${id}...`, data);
      const workshopDoc = doc(this.db, 'workshops', id);
      await updateDoc(workshopDoc, data);
      console.log("✅ Firestore: Workshop aktualisiert!");
    } catch (error) {
      console.error("❌ Firestore-Fehler beim Aktualisieren:", error);
      throw error;
    }
  }

  // ❌ Workshop löschen
  async deleteWorkshop(id: string): Promise<void> {
    try {
      const workshopDoc = doc(this.db, 'workshops', id);
      await deleteDoc(workshopDoc);
    } catch (error) {
      console.error('Fehler beim Löschen des Workshops:', error);
      throw error;
    }
  }

  async createOrUpdateWorkshop(workshop: Workshop): Promise<void> {
    const docRef = workshop.id
      ? doc(this.db, 'workshops', workshop.id)
      : doc(collection(this.db, 'workshops'));
  
    const workshopData = { ...workshop };
  
    // Falls der Workshop wiederkehrend ist, setzen wir das Datum automatisch
    if (workshop.recurring) {
      workshopData.date = this.calculateNextRecurringDate(workshop);
    }
  
    await setDoc(docRef, workshopData, { merge: true });
  }
  
  calculateNextRecurringDate(workshop: Workshop): string {
    const today = new Date();
    let nextDate = new Date(today.getFullYear(), today.getMonth(), 1);
  
    let weekCount = 0;
    while (weekCount < workshop.recurringWeek!) {
      if (nextDate.getDay() === workshop.recurringDay) {
        weekCount++;
      }
      if (weekCount < workshop.recurringWeek!) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
    }
    return nextDate.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // Nutzer anmelden
  async enrollUser(workshopId: string, userId: string): Promise<void> {
    const workshopRef = doc(this.db, 'workshops', workshopId);
    const docSnap = await getDoc(workshopRef);
  
    if (docSnap.exists()) {
      const workshop = docSnap.data() as Workshop;
      if ((workshop.availableSlots ?? 0) > 0) {
        await updateDoc(workshopRef, {
          participants: arrayUnion(userId),
          availableSlots: (workshop.availableSlots ?? 0) - 1,
        });
      }
    }
  }
  
  async unenrollUser(workshopId: string, userId: string): Promise<void> {
    const workshopRef = doc(this.db, 'workshops', workshopId);
    const docSnap = await getDoc(workshopRef);
  
    if (docSnap.exists()) {
      const workshop = docSnap.data() as Workshop;
      await updateDoc(workshopRef, {
        participants: arrayRemove(userId),
        availableSlots: (workshop.availableSlots ?? 0) + 1,
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

  // 🔹 Inhalt einer bestimmten Sektion abrufen (z. B. "about")
  getContent(section: string): Observable<ContentData | null> {
    return new Observable((observer) => {
      const docRef = doc(this.db, 'content', section);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          observer.next(docSnap.data() as ContentData);
        } else {
          observer.next(null);
        }
      });
    });
  }
  
  // 🔹 Inhalt einer bestimmten Sektion aktualisieren oder erstellen
  async updateContent(section: string, newData: ContentData): Promise<void> {
    const docRef = doc(this.db, 'content', section);
    await setDoc(docRef, newData, { merge: true });
  }
}
