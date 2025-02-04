import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage = getStorage(); // 🔹 Direkte Initialisierung von Firebase Storage

  constructor() {}

  /** Lädt ein Bild in Firebase Storage hoch und gibt die URL zurück */
  async uploadImage(file: File): Promise<string> {
    try {
      const storageRef = ref(this.storage, `workshops/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Fehler beim Hochladen des Bildes:", error);
      throw error;
    }
  }

  // 🔹 Bild aus Firebase Storage löschen
  async deleteImage(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, imageUrl);
    await deleteObject(storageRef);
  }
}
