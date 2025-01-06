import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-geschichten',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './geschichten.component.html',
  styleUrls: ['./geschichten.component.scss'],
})
export class GeschichtenComponent {
  // Optional: Eigene Logik, z. B. ein Array mit Geschichten
}
