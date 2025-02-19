import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Workshop } from '../../../core/interfaces/interfaces';
import { DataService } from '../../../core/services/data.service';
import { CommonModule } from '@angular/common';

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
  imageLoaded = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.getWorkshop(id).subscribe({
        next: (data) => this.workshop = data,
        error: (err) => console.error('Workshop nicht gefunden', err)
      });
    }
  }

  registerForWorkshop(): void {
    // Logik zur Anmeldung zum Workshop
  }

  requestIndividualInquiry(): void {
    this.router.navigate(['/contact']);
  }
}
