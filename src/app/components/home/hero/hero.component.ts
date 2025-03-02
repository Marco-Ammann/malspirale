import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Host, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import Typed from 'typed.js';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {
  scrollPosition = 0;
  private ticking = false;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.updateParallax();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrollPosition = window.scrollY;

    if (!this.ticking) {
      this.ticking = true;

      requestAnimationFrame(() => {
        this.updateParallax();
        this.ticking = false;
      });
    }
  }

  updateParallax(): void {
    const heroBackground = document.querySelector('.hero-background') as HTMLElement;
    if (heroBackground) {
      const offset = this.scrollPosition * 0.4;
      heroBackground.style.transform = `translateY(${offset}px)`;
    }
  }

  navigateToWorkshops(): void {
    this.router.navigate(['/workshops']);
  }

  exploreGallery(): void {
    this.router.navigate(['/gallery']);
  }
}
