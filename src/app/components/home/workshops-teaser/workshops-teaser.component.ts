import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workshops-teaser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshops-teaser.component.html',
  styleUrls: ['./workshops-teaser.component.scss']
})
export class WorkshopsTeaserComponent {
  constructor(private router: Router) {}
  navigateTo(target: string): void {
    this.router.navigate(["/" + target]);
  }
}