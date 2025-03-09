import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

export interface LightboxImage {
  src: string;
  alt?: string;
  title?: string;
  caption?: string;
}

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ transform: 'scale(0.9)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class LightboxComponent {
  @Input() images: LightboxImage[] = [];
  @Input() currentIndex: number = 0;
  @Output() close = new EventEmitter<void>();
  private touchStartX = 0;
  private touchEndX = 0;
  private swipeThreshold = 50;
  loading: boolean = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }

  closeLightbox(): void {
    this.close.emit();
  }

  nextImage(): void {
    this.loading = true;
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to the first image
    }
  }

  prevImage(): void {
    this.loading = true;
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1; // Loop to the last image
    }
  }

  onImageLoad(): void {
    this.loading = false;
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (Math.abs(swipeDistance) < this.swipeThreshold) {
      return; // Ignoriere kleine Bewegungen
    }

    if (swipeDistance > 0) {
      // Swipe nach rechts - vorheriges Bild
      this.prevImage();
    } else {
      // Swipe nach links - nächstes Bild
      this.nextImage();
    }
  }
}
