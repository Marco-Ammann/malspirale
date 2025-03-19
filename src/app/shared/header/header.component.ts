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
  galleryDropdownOpen = false; // Add this property
  isLoggedIn = false;
  isAdmin = false;
  isScrolled = false;
  openSubmenu: string | null = null;
  
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
    
    // Check if we're on a gallery route and open dropdown if needed
    const currentPath = window.location.pathname;
    if (currentPath.includes('/gallery')) {
      this.galleryDropdownOpen = true;
    }
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
    // Don't close dropdowns when clicking inside them
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.menu-toggle')) {
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
    // Close mobile menu if open
    this.mobileMenuOpen = false;
    
    // Get the current state before we change it
    const currentState = 
      (menu === 'gallery' && this.galleryDropdownOpen) ||
      (menu === 'philosophy' && this.philosophyDropdownOpen) ||
      (menu === 'user' && this.userDropdownOpen);
    
    // Close other dropdowns first
    this.galleryDropdownOpen = false;
    this.philosophyDropdownOpen = false;
    this.userDropdownOpen = false;
    
    // Toggle the requested dropdown (only open if it was closed)
    if (menu === 'gallery' && !currentState) {
      this.galleryDropdownOpen = true;
    } else if (menu === 'philosophy' && !currentState) {
      this.philosophyDropdownOpen = true;
    } else if (menu === 'user' && !currentState) {
      this.userDropdownOpen = true;
    }
    
    // Update body scroll
    this.updateBodyScroll();
    
    // Close mobile submenu if we're opening a desktop dropdown
    if (window.innerWidth > 768) {
      this.openSubmenu = null;
    }
  }

  toggleSubmenu(menu: string): void {
    if (this.openSubmenu === menu) {
      this.openSubmenu = null;
    } else {
      this.openSubmenu = menu;
    }
  }

  isSubmenuOpen(menu: string): boolean {
    return this.openSubmenu === menu;
  }

  closeAllMenus(): void {
    this.closeDropdowns();
    this.mobileMenuOpen = false;
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
    this.galleryDropdownOpen = false;
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