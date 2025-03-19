import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface LightboxImage {
  src: string;
  alt?: string;
  title?: string;
  caption?: string;
  category?: string;
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
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LightboxComponent implements OnInit {
  @Input() images: LightboxImage[] = [];
  @Input() currentIndex: number = 0;
  @Output() close = new EventEmitter<void>();

  loading: boolean = true;

  ngOnInit(): void {
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';

    // Preload the current image to start
    this.preloadImage(this.currentIndex);

    // Then preload neighbors
    if (this.currentIndex > 0) {
      this.preloadImage(this.currentIndex - 1);
    }
    if (this.currentIndex < this.images.length - 1) {
      this.preloadImage(this.currentIndex + 1);
    }
  }

  navigate(direction: number): void {
    this.loading = true;
    const newIndex = this.currentIndex + direction;

    if (newIndex >= 0 && newIndex < this.images.length) {
      this.currentIndex = newIndex;

      // Preload the next image in the sequence
      if (direction > 0 && this.currentIndex < this.images.length - 1) {
        this.preloadImage(this.currentIndex + 1);
      } else if (direction < 0 && this.currentIndex > 0) {
        this.preloadImage(this.currentIndex - 1);
      }
    }
  }

  onClose(): void {
    document.body.style.overflow = '';
    this.close.emit();
  }

  closeOnBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox-overlay')) {
      this.onClose();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.navigate(-1);
        break;
      case 'ArrowRight':
        this.navigate(1);
        break;
      case 'Escape':
        this.onClose();
        break;
    }
  }

  onImageLoad(): void {
    this.loading = false;
  }

  private preloadImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      const img = new Image();
      img.src = this.images[index].src;
    }
  }
}
