import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Workshop } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db = getFirestore();
  private workshopsCollection = collection(this.db, "workshops");

  constructor() {}

  /** Holt alle Workshops aus Firebase */
  async getAllWorkshops(): Promise<Workshop[]> {
    try {
      const querySnapshot = await getDocs(this.workshopsCollection);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Workshop[];
    } catch (error) {
      console.error("Fehler beim Laden der Workshops:", error);
      throw error;
    }
  }

  /** Holt einen Workshop anhand der ID */
  async getWorkshopById(id: string): Promise<Workshop | null> {
    try {
      const workshopRef = doc(this.db, "workshops", id);
      const docSnap = await getDoc(workshopRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Workshop : null;
    } catch (error) {
      console.error("Fehler beim Abrufen des Workshops:", error);
      throw error;
    }
  }

  /** Erstellt einen neuen Workshop */
  async addWorkshop(workshop: Workshop): Promise<void> {
    try {
      const newDocRef = doc(collection(this.db, "workshops"));
      await setDoc(newDocRef, workshop);
    } catch (error) {
      console.error("Fehler beim Erstellen des Workshops:", error);
      throw error;
    }
  }

  /** Aktualisiert einen bestehenden Workshop */
  async updateWorkshop(id: string, workshop: Partial<Workshop>): Promise<void> {
    try {
      const workshopRef = doc(this.db, "workshops", id);
      await updateDoc(workshopRef, workshop);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Workshops:", error);
      throw error;
    }
  }

  /** Löscht einen Workshop */
  async deleteWorkshop(id: string): Promise<void> {
    try {
      const workshopRef = doc(this.db, "workshops", id);
      await deleteDoc(workshopRef);
    } catch (error) {
      console.error("Fehler beim Löschen des Workshops:", error);
      throw error;
    }
  }

  /** Holt Content aus Firestore */
  async getContent(documentId: string): Promise<string> {
    try {
      const contentRef = doc(this.db, "content", documentId);
      const docSnap = await getDoc(contentRef);
      return docSnap.exists() ? docSnap.data()['text'] : "";
    } catch (error) {
      console.error("Fehler beim Laden des Contents:", error);
      throw error;
    }
  }

  /** Aktualisiert Content in Firestore */
  async updateContent(documentId: string, contentData: { text: string }): Promise<void> {
    try {
      const contentRef = doc(this.db, "content", documentId);
      await setDoc(contentRef, contentData, { merge: true });
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Contents:", error);
      throw error;
    }
  }
}
