import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { BehaviorSubject } from 'rxjs';

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

  // Live-Update der Benutzeranzahl
  loadUserCount(): void {
    this.authService.getUserCount().then((count) => {
      this.userCount$.next(count);
    });
  }

  getUserRole(): void {
    this.authService.getUserRole().then((role) => {
      console.log("Benutzerrolle:", role); // 🔥 DEBUGGING
      this.userRole$.next(role ? role.toUpperCase() : 'UNBEKANNT');
    });
  }

  // Live-Update der Workshops
  loadWorkshopCount(): void {
    this.dataService.getAllWorkshops().then((workshops) => {
      this.workshopCount$.next(workshops.length);
    });
  }

  // Letzte Inhaltsänderung abrufen
  async loadLastContentUpdate(): Promise<void> {
    const lastUpdate = await this.dataService.getLastContentUpdate();
    this.lastContentUpdate$.next(lastUpdate);
  }

  // Benutzerrolle abrufen
  loadUserRole(): void {
    this.authService.getUserRole().then((role) => {
      this.userRole$.next(role ? role.toUpperCase() : 'UNBEKANNT');
    });
  }

  // Benutzer abmelden
  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
