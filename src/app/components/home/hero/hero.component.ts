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
  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.updateParallax();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    this.scrollPosition = window.scrollY;
    this.updateParallax();
  }

  updateParallax(): void {
    const heroBackground = document.querySelector('.hero-background') as HTMLElement;
    if (heroBackground) {
      const offset = this.scrollPosition * 0.4; // Adjust the multiplier for desired effect
      heroBackground.style.backgroundPositionY = `-${offset}px`;
    }
  }

  navigateToWorkshops(): void {
    this.router.navigate(['/workshops']);
  }

  exploreGallery(): void {
    this.router.navigate(['/gallery']);
  }
}
