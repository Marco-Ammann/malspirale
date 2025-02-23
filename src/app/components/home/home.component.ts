import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { WorkshopsTeaserComponent } from './workshops-teaser/workshops-teaser.component';
import { GalleryComponent } from './gallery/gallery.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule, HeroComponent, AboutComponent, WorkshopsTeaserComponent, GalleryComponent]
})
export class HomeComponent {}
