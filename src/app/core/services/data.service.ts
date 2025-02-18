import { Injectable } from '@angular/core';
import { 
  getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc 
} from "firebase/firestore";
import { Workshop } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db = getFirestore();
  private workshopsCollection = collection(this.db, "workshops");

  constructor() {}

  async getAllWorkshops(): Promise<Workshop[]> {
    try {
      const querySnapshot = await getDocs(this.workshopsCollection);
      return querySnapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
      })) as Workshop[];
    } catch (error: unknown) {
      console.error("Error loading workshops:", error);
      throw error;
    }
  }

  async getWorkshopById(id: string): Promise<Workshop | null> {
    try {
      const workshopRef = doc(this.db, "workshops", id);
      const docSnap = await getDoc(workshopRef);
      return docSnap.exists() 
        ? { id: docSnap.id, ...docSnap.data() } as Workshop
        : null;
    } catch (error: unknown) {
      console.error("Error fetching workshop:", error);
      throw error;
    }
  }

  async addWorkshop(workshop: Workshop): Promise<void> {
    try {
      const newDocRef = doc(collection(this.db, "workshops"));
      await setDoc(newDocRef, workshop);
    } catch (error: unknown) {
      console.error("Error creating workshop:", error);
      throw error;
    }
  }

  async updateWorkshop(id: string, workshop: Partial<Workshop>): Promise<void> {
    try {
      const workshopRef = doc(this.db, "workshops", id);
      await updateDoc(workshopRef, workshop);
    } catch (error: unknown) {
      console.error("Error updating workshop:", error);
      throw error;
    }
  }

  async deleteWorkshop(id: string): Promise<void> {
    try {
      const workshopRef = doc(this.db, "workshops", id);
      await deleteDoc(workshopRef);
    } catch (error: unknown) {
      console.error("Error deleting workshop:", error);
      throw error;
    }
  }

  /** Retrieves content text from Firestore */
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

  /** Updates content in Firestore */
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