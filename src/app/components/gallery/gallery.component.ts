import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { GalleryImage } from '../../core/interfaces/interfaces';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  images$!: Observable<GalleryImage[]>;
  selectedImage: GalleryImage | null = null;

  openModal(image: GalleryImage): void {
    this.selectedImage = image;
  }

  closeModal(): void {
    this.selectedImage = null;
  }

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.images$ = this.dataService.getImages();
  }

}
