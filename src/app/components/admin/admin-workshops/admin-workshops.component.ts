import { Component, OnInit } from '@angular/core';
import { Workshop } from '../../../core/interfaces/interfaces';
import { DataService } from '../../../core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-workshops',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-workshops.component.html',
  styleUrls: ['./admin-workshops.component.scss']
})
export class AdminWorkshopsComponent implements OnInit {
  workshops: Workshop[] = [];
  loading: boolean = true;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAllWorkshops().subscribe((workshops) => {
      this.workshops = workshops;
      this.loading = false;
    });
  }

  deleteWorkshop(id: string): void {
    if (confirm('Möchtest du diesen Workshop wirklich löschen?')) {
      this.dataService.deleteWorkshop(id).then(() => {
        this.workshops = this.workshops.filter(w => w.id !== id);
      }).catch(err => console.error('Fehler beim Löschen:', err));
    }
  }
}
