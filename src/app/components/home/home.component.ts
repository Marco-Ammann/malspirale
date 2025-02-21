import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';
import { RouterModule } from '@angular/router';
import * as AOS from 'aos';
import 'aos/dist/aos.css';
import Typed from 'typed.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  workshops: Workshop[] = [];
  regularWorkshops: Workshop[] = [];
  malateliers: Workshop[] = [];
  individuelleAnfragen: Workshop[] = [];
  artworks = [
    { src: 'assets/images/art1.webp', alt: 'Kunstwerk 1', imageLoaded: false },
    { src: 'assets/images/art2.webp', alt: 'Kunstwerk 2', imageLoaded: false },
    { src: 'assets/images/art3.webp', alt: 'Kunstwerk 3', imageLoaded: false },
  ];  
  constructor(private dataService: DataService, private router: Router) {}
  ngOnInit(): void {
    this.loadWorkshops();
    this.updateParallaxEffect();

    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false
    });
  }

  ngAfterViewInit(): void {
    if (window.innerWidth >= 900) {
      const options = {
        stringsElement: '#typed-strings',
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 900,
        smartBackspace: true,
        loop: false,
        showCursor: true,
        autoInsertCss: true,
      };
      new Typed('#typed-text', options);
    } else {
      // Auf kleineren Bildschirmen setzen wir statisch einen kürzeren Text
      const typedElem = document.getElementById('typed-text');
      if (typedElem) {
        typedElem.innerText = 'Kreativität entfalten';
      }
    }
  }

  loadWorkshops(): void {
    this.dataService.getWorkshops().subscribe({
      next: (workshops: Workshop[]) => {
        this.workshops = workshops;
        this.regularWorkshops = workshops.filter(w => w.type === 'workshop');
        this.malateliers = workshops.filter(w => w.type === 'malatelier');
        this.individuelleAnfragen = workshops.filter(w => w.type === 'individuelleAnfrage');
      },
      error: (error: any) => {
        console.error('Fehler beim Laden der Workshops:', error);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // ** PARALLAX LOGIK **
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateParallaxEffect();
  }

  private updateParallaxEffect(): void {
    const scrolled = window.scrollY;
    const parallaxElement = document.querySelector('.hero-background') as HTMLElement;

    if (parallaxElement) {
      parallaxElement.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }
}
