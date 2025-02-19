import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage = getStorage();

  constructor() {}

  /** Lädt ein Bild hoch und gibt die URL zurück – gespeichert im Ordner "images/workshops" */
  async uploadImage(file: File): Promise<string> {
    try {
      const storageRef = ref(this.storage, `images/workshops/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error);
      throw error;
    }
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const storageRef = ref(this.storage, `images/workshops/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, imageUrl);
    await deleteObject(storageRef);
  }
}
