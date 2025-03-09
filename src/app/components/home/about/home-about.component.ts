import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-about.component.html',
  styleUrls: ['./home-about.component.scss']
})
export class HomeAboutComponent {
  constructor(private router: Router) {}

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }
}