import { Injectable } from '@angular/core';
import { Workshop } from '../interfaces/interfaces';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, query as firebaseQuerry, CollectionReference, DocumentData, limit, orderBy } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db = getFirestore();
  private workshopsCollection = collection(this.db, 'workshops');

  constructor() {}

  // Alle Angebote abrufen
  getWorkshops(): Observable<Workshop[]> {
    return from(
      getDocs(this.workshopsCollection).then(snapshot => {
        const workshops: Workshop[] = [];
        snapshot.forEach(docSnap => {
          workshops.push({ id: docSnap.id, ...docSnap.data() } as Workshop);
        });
        return workshops;
      })
    );
  }

  // Einzelnes Angebot anhand der ID abrufen
  getWorkshop(id: string): Observable<Workshop> {
    const docRef = doc(this.db, 'workshops', id);
    return from(
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Workshop;
        } else {
          throw new Error('Angebot nicht gefunden');
        }
      })
    );
  }

  // Angebot erstellen (undefined-Felder entfernen)
  async saveWorkshop(workshop: Workshop): Promise<string> {
    const data = JSON.parse(JSON.stringify(workshop));
    const docRef = await addDoc(this.workshopsCollection, data);
    return docRef.id;
  }

  // Angebot aktualisieren
  async updateWorkshop(workshop: Workshop): Promise<void> {
    if (!workshop.id) throw new Error('Workshop-ID fehlt');
    const data = JSON.parse(JSON.stringify(workshop));
    const docRef = doc(this.db, 'workshops', workshop.id);
    await updateDoc(docRef, data);
  }

  // Angebot löschen
  async deleteWorkshop(id: string): Promise<void> {
    const docRef = doc(this.db, 'workshops', id);
    await deleteDoc(docRef);
  }

  // Content-Methoden (unverändert)
  async getContent(documentId: string): Promise<string> {
    try {
      const contentRef = doc(this.db, "content", documentId);
      const docSnap = await getDoc(contentRef);
      return docSnap.exists() ? String(docSnap.data()?.['text'] ?? "") : "";
    } catch (error: unknown) {
      console.error("Error loading content:", error);
      throw error;
    }
  }

  async updateContent(documentId: string, contentData: { text: string }): Promise<void> {
    try {
      const contentRef = doc(this.db, "content", documentId);
      await setDoc(contentRef, contentData, { merge: true });
    } catch (error: unknown) {
      console.error("Error updating content:", error);
      throw error;
    }
  }
}
function query(contentCollection: CollectionReference<DocumentData, DocumentData>, arg1: any, arg2: any): import("@firebase/firestore").Query<unknown, import("@firebase/firestore").DocumentData> {
  throw new Error('Function not implemented.');
}

