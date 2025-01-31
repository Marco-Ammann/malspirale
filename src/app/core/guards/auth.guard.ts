import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../../../firebase-config';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private auth = getAuth(firebaseApp);

  constructor(private router: Router) {
    
  }

  canActivate(): boolean {
    const user = this.auth.currentUser;

    if (user) {
      return true; // Zugriff erlaubt
    } else {
      this.router.navigate(['/login']); // Weiterleitung zur Login-Seite
      return false; // Zugriff verweigert
    }
  }
}
