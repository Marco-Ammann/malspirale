import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  confirmPasswordReset,
  verifyPasswordResetCode
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
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(firebaseApp);
  public db = getFirestore(firebaseApp);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();
  
  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      this.userSubject.next(user);
      if (user) {
        const userDoc = await getDoc(doc(this.db, 'users', user.uid));
        this.roleSubject.next(userDoc.exists() ? userDoc.data()?.['role'] : null);
      } else {
        this.roleSubject.next(null);
      }
    });
  }

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

  getAuthInstance() {
    return this.auth;
  }

  getCurrentUserId(): Promise<string | null> {
    return new Promise((resolve) => {
      this.user$.subscribe((user) => {
        resolve(user ? user.uid : null);
      });
    });
  }

  async getUserCount(): Promise<number> {
    const usersCollection = collection(this.db, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.size;
  }

  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    // Wähle die Persistenz-Option basierend auf rememberMe
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    
    await setPersistence(this.auth, persistenceType);
    
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.userSubject.next(userCredential.user);
    const userDoc = await getDoc(doc(this.db, 'users', userCredential.user.uid));
    this.roleSubject.next(userDoc.exists() ? userDoc.data()?.['role'] : null);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
    this.roleSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  async getUserRole(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) {
      console.error("❌ Kein Benutzer eingeloggt!");
      return null;
    }
  
    const userDoc = await getDoc(doc(this.db, 'users', user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data()?.['role'];
      console.log("✅ Benutzerrolle:", role);
      return role;
    } else {
      console.error("❌ Benutzer existiert nicht in Firestore!");
      return null;
    }
  }

  async isAdmin(): Promise<boolean> {
    const role = await firstValueFrom(this.role$);
    return role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
  
  async forgotPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }
  
  async verifyPasswordResetCode(code: string): Promise<string> {
    return verifyPasswordResetCode(this.auth, code);
  }
  
  async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(this.auth, code, newPassword);
  }
}