import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Router, RouterModule } from '@angular/router';
import { Workshop } from '../../core/interfaces/interfaces';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-workshop-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss'],
})
export class WorkshopListComponent implements OnInit {
  workshops: Workshop[] = [];
  searchTerm: string = '';

  constructor(
    private stateService: StateService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.getAllWorkshops().subscribe((data) => {
      this.workshops = data;
    });
  }

  filterWorkshops(): Workshop[] {
    return this.workshops.filter((workshop) =>
      workshop.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onWorkshopClick(workshop: Workshop): void {
    this.stateService.setSelectedWorkshop(workshop);
    this.router.navigate(['/workshops', workshop.id]);
  }

  navigateToWorkshop(workshop: Workshop): void {
    this.router.navigate([`/workshops/${workshop.id}`]);
  }
}
