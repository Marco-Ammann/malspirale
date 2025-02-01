import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userEmail: string | null = null;
  dropdownOpen: boolean = false;
  userDropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.userEmail = user ? user.email : null;
    });
  
    this.authService.role$.subscribe((role) => {
      console.log('🔍 Header überprüft Admin-Status:', role);
      this.isAdmin = role === 'admin';
    });
  }
  


  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleUserDropdown(event: Event): void {
    event.stopPropagation();
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  closeDropdowns(): void {
    this.dropdownOpen = false;
    this.userDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
