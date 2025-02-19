import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userCount$ = new BehaviorSubject<number>(0);
  workshopCount$ = new BehaviorSubject<number>(0);
  lastContentUpdate$ = new BehaviorSubject<Date | null>(null);
  userRole$ = new BehaviorSubject<string>('UNBEKANNT');
  menuOpen = false;  // Für mobile Navigation

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loadUserCount();
    this.loadWorkshopCount();
    this.loadLastContentUpdate();
    this.loadUserRole();
  }

  loadUserCount(): void {
    this.authService.getUserCount().then(count => {
      this.userCount$.next(count);
    });
  }

  loadWorkshopCount(): void {
    firstValueFrom(this.dataService.getWorkshops()).then(workshops => {
      this.workshopCount$.next(workshops.length);
    }).catch(error => {
      console.error('Fehler beim Laden der Workshops:', error);
    });
  }

  loadLastContentUpdate(): void {
    // Hier kann eine Funktion ergänzt werden
  }

  loadUserRole(): void {
    this.authService.getUserRole().then(role => {
      this.userRole$.next(role ? role.toUpperCase() : 'UNBEKANNT');
    });
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
