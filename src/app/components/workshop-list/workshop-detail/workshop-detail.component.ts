import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { Workshop } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'app-workshop-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss']
})
export class WorkshopDetailComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  workshop!: Workshop;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.getWorkshop(id).subscribe({
        next: (data: Workshop) => { this.workshop = data; },
        error: (err: any) => console.error('Workshop nicht gefunden', err)
      });
    }
  }

  registerForWorkshop(): void {
    // Beispiel: Navigiere zur Anmeldeseite mit der Workshop-ID
    this.router.navigate(['/register', this.workshop.id]);
  }
}
