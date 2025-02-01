import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.role$.pipe(
      first(), // Stelle sicher, dass der Wert nur einmal genommen wird
      map((role) => {
        console.log('🔍 AdminGuard überprüft Rolle:', role);
        if (role === 'admin') {
          return true;
        } else {
          console.warn('🚫 Zugriff verweigert: Kein Admin');
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
  }
}
