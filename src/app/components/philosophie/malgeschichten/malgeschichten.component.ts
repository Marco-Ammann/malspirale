import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-malgeschichten',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './malgeschichten.component.html',
  styleUrls: ['./malgeschichten.component.scss'],
})
export class MalgeschichtenComponent {
  // Optional: Eigene Logik, z.B. ein Array mit Geschichten
}
