import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  activeDropdown: string | null = null;
  isScrolled = false;
  
  constructor(private router: Router) { }
  
  ngOnInit(): void {
    // Close menu and dropdowns when route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMenuOpen = false;
      this.activeDropdown = null;
      document.body.classList.remove('menu-open');
    });
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Toggle body class for overlay
    if (this.isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
      this.activeDropdown = null;
    }
  }
  
  toggleDropdown(dropdown: string) {
    // If clicking the same dropdown, toggle it
    if (this.activeDropdown === dropdown) {
      this.activeDropdown = null;
    } else {
      // Otherwise, open the clicked dropdown and close others
      this.activeDropdown = dropdown;
    }
    
    // Prevent event bubbling
    event?.stopPropagation();
  }
  
  closeDropdowns() {
    this.activeDropdown = null;
  }
  
  // Close dropdown when clicking a menu item within it
  handleMenuItemClick() {
    this.activeDropdown = null;
    
    // On mobile, also close the menu
    if (window.innerWidth <= 768) {
      this.isMenuOpen = false;
      document.body.classList.remove('menu-open');
    }
  }
  
  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isClickInsideMenu = target.closest('.navbar') !== null;
    
    if (!isClickInsideMenu) {
      this.activeDropdown = null;
      
      // If menu is open and click is outside, close it
      if (this.isMenuOpen) {
        this.isMenuOpen = false;
        document.body.classList.remove('menu-open');
      }
    }
  }
}
