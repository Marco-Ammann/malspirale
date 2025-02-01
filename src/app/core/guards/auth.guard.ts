import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../../../firebase-config';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private auth = getAuth(firebaseApp);

  constructor(private router: Router, private authService: AuthService) {
    
  }

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
