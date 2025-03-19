import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

export interface MasonryItem {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  loaded?: boolean;
  category?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-masonry-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masonry-grid.component.html',
  styleUrls: ['./masonry-grid.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class MasonryGridComponent {
  @Input() items: MasonryItem[] = [];
  @Input() columns: number = 3;
  @Input() gap: string = '1.5rem';
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No items to display';
  @Output() itemClick = new EventEmitter<{item: MasonryItem, index: number}>();

  // Default items for placeholder display
  @Input() placeholderCount: number = 6;
  placeholderArray: number[] = [];

  @Input() enableLazyLoading: boolean = true;
  @Input() categories: string[] = [];
  @Input() showCategories: boolean = false;

  activeCategory: string = 'all';
  visibleItems: MasonryItem[] = [];

  private scrollBuffer: number = 200; // px before bottom to trigger load
  private itemsPerBatch: number = 12;
  private currentBatch: number = 1;

  ngOnInit() {
    this.placeholderArray = Array(this.placeholderCount).fill(0).map((_, i) => i);

    if (this.enableLazyLoading) {
      this.loadInitialBatch();
    } else {
      this.visibleItems = [...this.items];
    }
  }

  ngOnChanges() {
    if (!this.enableLazyLoading) {
      this.visibleItems = [...this.items];
    } else if (this.items.length > 0 && this.visibleItems.length === 0) {
      this.loadInitialBatch();
    }

    // Extract categories if not provided but items have them
    if (this.showCategories && this.categories.length === 0) {
      const uniqueCategories = new Set<string>();
      this.items.forEach(item => {
        if (item.category) uniqueCategories.add(item.category);
      });
      this.categories = Array.from(uniqueCategories);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.enableLazyLoading || this.visibleItems.length >= this.items.length) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.body.offsetHeight - this.scrollBuffer;

    if (scrollPosition >= bottomPosition) {
      this.loadMoreItems();
    }
  }

  loadInitialBatch() {
    this.currentBatch = 1;
    this.visibleItems = this.items.slice(0, this.itemsPerBatch);
  }

  loadMoreItems() {
    const start = this.currentBatch * this.itemsPerBatch;
    const end = start + this.itemsPerBatch;
    const newItems = this.items.slice(start, end);

    if (newItems.length > 0) {
      this.visibleItems = [...this.visibleItems, ...newItems];
      this.currentBatch++;
    }
  }

  filterByCategory(category: string) {
    this.activeCategory = category;

    if (category === 'all') {
      this.visibleItems = this.enableLazyLoading
        ? this.items.slice(0, this.itemsPerBatch)
        : [...this.items];
    } else {
      const filtered = this.items.filter(item => item.category === category);
      this.visibleItems = this.enableLazyLoading
        ? filtered.slice(0, this.itemsPerBatch)
        : filtered;
    }

    this.currentBatch = 1;
  }

  trackByFn(index: number, item: MasonryItem): string {
    return item.id;
  }

  onItemClick(item: MasonryItem, index: number): void {
    this.itemClick.emit({ item, index });
  }

  onImageLoad(item: MasonryItem): void {
    item.loaded = true;
  }
}
