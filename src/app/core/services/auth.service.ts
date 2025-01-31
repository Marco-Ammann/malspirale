import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../../../firebase-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(firebaseApp);
  public db = getFirestore(firebaseApp);

  constructor() {}

  // Benutzer registrieren
  async register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        // Speichere Benutzer in Firestore
        const userDocRef = doc(this.db, 'users', user.uid);
        return setDoc(userDocRef, {
          email: user.email,
          role: 'user',
        });
      }
    );
  }

  // Benutzer einloggen
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login erfolgreich!');
    } catch (error: any) {
      console.error('Login-Fehler:', error);
      throw error;
    }
  }

  // Benutzer ausloggen
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Abgemeldet!');
    } catch (error: any) {
      console.error('Logout-Fehler:', error);
      throw error;
    }
  }

  isLoggedIn(): boolean {
    const user = getAuth(firebaseApp).currentUser;
    return !!user; // true, wenn eingeloggt
  }

  async isAdmin(user: any): Promise<boolean> {
    const userDocRef = doc(this.db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData['role'] === 'admin';
    }
    return false;
  }

  getCurrentUser() {
    return getAuth(firebaseApp).currentUser;
  }
}
