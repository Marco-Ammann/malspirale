import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  userCount$ = new BehaviorSubject<number>(0);
  workshopCount$ = new BehaviorSubject<number>(0);
  lastContentUpdate$ = new BehaviorSubject<Date | null>(null);
  userRole$ = new BehaviorSubject<string>('UNBEKANNT');
  menuOpen = false;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserCount();
    this.loadWorkshopCount();
    this.loadUserRole();
    // Placeholder for content update, assuming there's a method in DataService

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserCount(): void {
    this.authService.getUserCount().then(count => this.userCount$.next(count));
  }


  loadWorkshopCount(): void {
    this.dataService.getWorkshops().subscribe(workshops => {
      this.workshopCount$.next(workshops.length);
    });
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