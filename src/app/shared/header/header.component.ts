import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
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
export class HeaderComponent implements OnDestroy {
  mobileMenuOpen = false;
  philosophyDropdownOpen = false;
  userDropdownOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  isScrolled = false;
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    this.closeDropdowns();
  }
  
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthService, private stateService: StateService) {
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
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('.dropdown, .menu-toggle')) {
      this.closeDropdowns();
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.closeDropdowns();
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }
}
