import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      switchMap(user => this.authService.isAdmin().then(isAdmin => {
        if (user && isAdmin) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }))
    );
  }
}
