import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';
import { RouterModule } from '@angular/router';

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
  private typingText = "Entfalte deine Kreativität";
  private typingSpeed = 120; // Geschwindigkeit in ms
  
  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadWorkshops();
    this.updateParallaxEffect();
  }

  ngAfterViewInit(): void {
    this.startTypingEffect();
  }
  private startTypingEffect(): void {
    const typedTextElement = document.getElementById("typed-text");
    if (!typedTextElement) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < this.typingText.length) {
        typedTextElement.textContent += this.typingText.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, this.typingSpeed);
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
