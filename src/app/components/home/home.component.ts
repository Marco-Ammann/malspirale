import { Component } from '@angular/core';
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
  imports: [CommonModule, RouterModule, HeroComponent, HomeAboutComponent, WorkshopsTeaserComponent, HomeGalleryComponent ]
})
export class HomeComponent {}
