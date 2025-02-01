import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss']
})
export class AdminContentComponent {
  siteContent = "Hier ist der aktuelle Webseiten-Text...";

  saveContent(): void {
    console.log('Content gespeichert:', this.siteContent);
  }
}
