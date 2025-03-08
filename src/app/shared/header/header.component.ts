import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  philosophyDropdownOpen = false;
  userDropdownOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  isScrolled = false;
  
  private unsubscribe$ = new Subject<void>();
  private previousScrollPosition = 0;
  private scrollDelta = 5;
  private scrollThreshold = 50;
  
  constructor(
    private authService: AuthService, 
    private stateService: StateService,
    private renderer: Renderer2
  ) {}
  
  ngOnInit(): void {
    // Überwache Auth-Status
    this.authService.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        this.isLoggedIn = !!user;
      });

    this.authService.role$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(role => {
        this.isAdmin = role === 'admin';
      });
      
    // Verhindere Scrollen, wenn Mobile-Menü geöffnet ist
    this.updateBodyScroll();
  }
  
  ngOnDestroy(): void {
    // Räume Subscriptions auf
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    
    // Stelle sicher, dass Scrollen wieder möglich ist
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    // Schließt Dropdowns, wenn außerhalb geklickt wird
    if (!(event.target as HTMLElement).closest('.dropdown, .menu-toggle')) {
      this.closeDropdowns();
    }
  }
  
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Tastatursteuerung
    if (event.key === 'Escape') {
      this.closeAllMenus();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY;
    
    // Header-Styling bei Scrollen anpassen
    if (currentScroll > this.scrollThreshold) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
    
    this.previousScrollPosition = currentScroll;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.closeDropdowns();
    this.updateBodyScroll();
  }

  toggleDropdown(menu: string): void {
    if (menu === 'philosophy') {
      this.philosophyDropdownOpen = !this.philosophyDropdownOpen;
      this.userDropdownOpen = false;
    } else if (menu === 'user') {
      this.userDropdownOpen = !this.userDropdownOpen;
      this.philosophyDropdownOpen = false;
    }
  }

  closeAllMenus(): void {
    this.mobileMenuOpen = false;
    this.closeDropdowns();
    this.updateBodyScroll();
  }
  
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.closeDropdowns();
    this.updateBodyScroll();
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.closeAllMenus();
    });
  }

  private closeDropdowns(): void {
    this.philosophyDropdownOpen = false;
    this.userDropdownOpen = false;
  }
  
  private updateBodyScroll(): void {
    // Verhindere Scrollen des Hintergrunds, wenn Mobile-Menü offen ist
    if (this.mobileMenuOpen) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }
}