import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { HomeAboutComponent } from './about/home-about.component';
import { WorkshopsTeaserComponent } from './workshops-teaser/workshops-teaser.component';
import { HomeGalleryComponent } from './gallery/home-gallery.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule, HeroComponent, HomeAboutComponent, WorkshopsTeaserComponent, HomeGalleryComponent]
})
export class HomeComponent implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Verbesserte Performance mit optimierten Threshold-Werten
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Erhöht für bessere Sensitivität
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = this.el.nativeElement.querySelectorAll('.scroll-effect');
    elements.forEach((element: HTMLElement) => observer.observe(element));
  }
}