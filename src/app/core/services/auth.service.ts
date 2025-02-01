import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { firebaseApp } from '../../../firebase-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(firebaseApp);
  public db = getFirestore(firebaseApp);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  
  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  // Benutzer registrieren
  async register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(async (userCredential) => {
      const user = userCredential.user;
      await setDoc(doc(this.db, 'users', user.uid), {
        email: user.email,
        role: 'user',
        createdAt: new Date(),
      });
    });
  }

  // Aktuelle Benutzer-ID abrufen
  getCurrentUserId(): Promise<string | null> {
    return new Promise((resolve) => {
      this.user$.subscribe((user) => {
        resolve(user ? user.uid : null);
      });
    });
  }

  // Benutzeranzahl abrufen
  async getUserCount(): Promise<number> {
    const usersCollection = collection(this.db, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.size;
  }

  // Benutzer einloggen
  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }


  // Benutzer ausloggen
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // Prüfen, ob Benutzer eingeloggt ist
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  // Prüfen, ob Benutzer Admin ist
  async isAdmin(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    const userDoc = await getDoc(doc(this.db, 'users', user.uid));
    return userDoc.exists() && userDoc.data()?.['role'] === 'admin';
  }

  // Aktuellen Benutzer abrufen
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
