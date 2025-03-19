import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MasonryItem {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  loaded?: boolean;
  [key: string]: any;
}

@Component({
  selector: 'app-masonry-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masonry-grid.component.html',
  styleUrls: ['./masonry-grid.component.scss']
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

  ngOnInit() {
    this.placeholderArray = Array(this.placeholderCount).fill(0).map((_, i) => i);
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
