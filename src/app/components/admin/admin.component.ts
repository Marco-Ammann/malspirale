import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription, filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { HelpService } from '../../core/services/help.service';
import { HelpPanelComponent } from '../../shared/help/help-panel.component';
import { OnboardingTourComponent } from '../../shared/help/onboarding-tour.component';

interface Activity {
  id: string;
  title: string;
  type: string;
  icon: string;
  time: Date;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HelpPanelComponent,
    OnboardingTourComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  userCount$ = new BehaviorSubject<number>(0);
  workshopCount$ = new BehaviorSubject<number>(0);
  userRole$ = new BehaviorSubject<string>('UNBEKANNT');
  userName$ = new BehaviorSubject<string>('Admin');

  // Neue Eigenschaften
  menuOpen = false;
  showHelp = false;
  pageTitle = 'Dashboard';
  isMainDashboard = true;
  visitorCount = 0;
  messageCount = 0;
  currentRoute = '/';
  recentActivities: Activity[] = [];

  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private helpService: HelpService
  ) {}

  ngOnInit(): void {
    this.loadUserCount();
    this.loadWorkshopCount();
    this.loadUserRole();
    this.loadStatistics();
    this.loadRecentActivities();
    this.loadUserName();

    // Router-Events überwachen
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.currentRoute = event.url;
          this.isMainDashboard =
            event.url === '/admin' || event.url === '/admin/';
          this.updatePageTitle(event.url);
          // Bei Routenwechsel mobile Menü schließen
          if (window.innerWidth <= 768) {
            this.menuOpen = false;
          }
        })
    );

    // Route-Hilfe-Thema setzen
    this.subscriptions.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          // Extrahiere den Hauptpfad (admin/xyz)
          const path = event.url.split('/')[2] || 'dashboard';
          // Setze Hilfethema basierend auf aktuellem Pfad
          this.helpService.setCurrentTopic(path);
        })
    );

    // Zeige Einführungsdialog, wenn der Benutzer zum ersten Mal die Admin-Seite besucht
    this.subscriptions.add(
      this.helpService.firstVisit$.subscribe((isFirstVisit) => {
        if (isFirstVisit) {
          // Dialog oder Tour starten
          setTimeout(() => {
            // Kurze Verzögerung, um sicherzustellen, dass alles geladen ist
            this.openHelp();
          }, 1000);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserCount(): void {
    this.authService
      .getUserCount()
      .then((count) => this.userCount$.next(count));
  }

  loadWorkshopCount(): void {
    this.dataService.getWorkshops().subscribe((workshops) => {
      this.workshopCount$.next(workshops.length);
    });
  }

  loadUserRole(): void {
    this.authService.getUserRole().then((role) => {
      this.userRole$.next(role ? role.toUpperCase() : 'UNBEKANNT');
    });
  }

  loadUserName(): void {
    this.authService.getCurrentUserId().then((userId) => {
      if (userId) {
        this.dataService.getUser(userId).subscribe((user) => {
          console.log('Loaded user data:', user);
          this.userName$.next(user.fullName);
        });
      }
    });
  }

  getFirstNameOfFullName(fullName: string): string {
    return fullName.split(' ')[0];
  }

  // Neue Methoden
  loadStatistics(): void {
    // Beispieldaten - hier später mit echten Daten aus einem Service ersetzen
    this.visitorCount = 245;
    this.messageCount = 3;
  }

  loadRecentActivities(): void {
    // Beispieldaten - später mit echten Daten ersetzen
    this.recentActivities = [
      {
        id: '1',
        title: 'Workshop "Intuitives Malen" erstellt',
        type: 'workshop_create',
        icon: 'add_circle',
        time: new Date(Date.now() - 3600000), // 1 Stunde zurück
      },
      {
        id: '2',
        title: 'Gallerie aktualisiert',
        type: 'gallery_update',
        icon: 'photo_library',
        time: new Date(Date.now() - 8600000), // 2.4 Stunden zurück
      },
      {
        id: '3',
        title: 'Inhalt auf "Über Mich" bearbeitet',
        type: 'content_edit',
        icon: 'edit',
        time: new Date(Date.now() - 86400000), // 1 Tag zurück
      },
    ];
  }

  updatePageTitle(url: string): void {
    if (url.includes('/workshops')) {
      this.pageTitle = 'Workshop-Verwaltung';
    } else if (url.includes('/gallery')) {
      this.pageTitle = 'Galerie-Verwaltung';
    } else if (url.includes('/content')) {
      this.pageTitle = 'Inhalte bearbeiten';
    } else if (url.includes('/users')) {
      this.pageTitle = 'Benutzerverwaltung';
    } else if (url.includes('/reports')) {
      this.pageTitle = 'Berichte';
    } else {
      this.pageTitle = 'Dashboard';
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  openHelp(): void {
    this.helpService.openHelpPanel();
  }

  closeHelp(): void {
    this.helpService.closeHelpPanel();
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
