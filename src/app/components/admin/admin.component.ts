import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '../../../firebase-config';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  user: any = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;
        this.isAdmin = await this.authService.isAdmin(user);
        if (!this.isAdmin) {
          alert('Nicht autorisiert!');
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.logout().then(() => {
      alert('Abgemeldet!');
      this.router.navigate(['/login']);
    }).catch((error) => {
      alert('Fehler beim Abmelden: ' + error.message);
    });
  }
}
