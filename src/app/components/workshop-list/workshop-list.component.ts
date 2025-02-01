import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workshop-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.scss'],
})
export class WorkshopListComponent implements OnInit {
  workshops: Workshop[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadWorkshops();
  }

  loadWorkshops(): void {
    this.dataService.getWorkshops().subscribe((workshops) => {
      this.workshops = workshops;
    });
  }

  filterWorkshops(): Workshop[] {
    return this.workshops.filter((w) =>
      w.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  navigateToWorkshop(workshop: Workshop): void {
    this.router.navigate(['/workshops', workshop.id]);
  }
}
