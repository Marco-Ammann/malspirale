import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workshop } from '../../../core/interfaces/interfaces';
import { StateService } from '../../../core/services/state.service';
import { DataService } from '../../../core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workshop-detail',
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss'],
  imports: [CommonModule],
})
export class WorkshopDetailComponent implements OnInit {
  workshop: Workshop | null = null;

  constructor(
    private stateService: StateService,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.workshop = this.stateService.selectedWorkshop();

    if (!this.workshop) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.dataService.getWorkshopById(id).subscribe((workshop) => {
          if (workshop) {
            this.workshop = workshop;
          } else {
            // Fallback: Keine Daten gefunden
            console.error('Workshop nicht gefunden!');
          }
        });
      }
    }
  }
}
