import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-philosophie',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './philosophie.component.html',
  styleUrls: ['./philosophie.component.scss'],
})
export class PhilosophieComponent {}
