import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  mobileMenuOpen = false;
  philosophyDropdownOpen = false;
  userDropdownOpen = false;
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private stateService: StateService
  ) {
    this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
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
    this.philosophyDropdownOpen = false;
    this.userDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.closeAllMenus();
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.closeDropdowns();
    }
  }

  private closeDropdowns(): void {
    this.philosophyDropdownOpen = false;
    this.userDropdownOpen = false;
  }
}
