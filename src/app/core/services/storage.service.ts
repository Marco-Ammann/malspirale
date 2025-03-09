import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage = getStorage();

  constructor() {}

  /** Lädt ein Bild hoch und gibt die URL zurück – gespeichert im Ordner "images/workshops" */
// Ersetze die uploadImage-Methode mit dieser verbesserten Version
async uploadImage(file: File): Promise<string> {
  try {
    const storageRef = ref(this.storage, `images/workshops/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    throw new Error(`Bildupload fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}

// Ersetze auch die uploadFile-Methode mit dieser verbesserten Version
async uploadFile(file: File): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(this.storage, `images/workshops/${fileName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    throw new Error(`Dateiupload fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}

  async deleteImage(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, imageUrl);
    await deleteObject(storageRef);
  }
}
