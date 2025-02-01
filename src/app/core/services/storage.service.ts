import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage = getStorage(); // 🔹 Direkte Initialisierung von Firebase Storage

  constructor() {}

  // 🔹 Bild hochladen & Download-URL abrufen
  async uploadImage(file: File): Promise<string> {
    const filePath = `images/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(uploadTask.ref);
  }

  // 🔹 Bild aus Firebase Storage löschen
  async deleteImage(imageUrl: string): Promise<void> {
    const storageRef = ref(this.storage, imageUrl);
    await deleteObject(storageRef);
  }
}
