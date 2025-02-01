import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workshop } from '../../../core/interfaces/interfaces';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-workshop-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss'],
})
export class WorkshopDetailComponent implements OnInit {
  workshop: Workshop | null = null;
  userId: string | null = null;
  isUserEnrolled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUserId().then((id) => {
      this.userId = id;
      this.loadWorkshop();
    });
  }

  loadWorkshop(): void {
    const workshopId = this.route.snapshot.paramMap.get('id');
    if (workshopId) {
      this.dataService.getWorkshopById(workshopId).subscribe((workshop) => {
        if (workshop) {
          this.workshop = workshop;
          this.checkUserEnrollment();
        }
      });
    }
  }

  checkUserEnrollment(): void {
    if (this.workshop && this.userId) {
      this.isUserEnrolled = this.workshop.participants?.includes(this.userId) || false;
    }
  }

  async onEnroll(): Promise<void> {
    if (this.workshop && this.userId) {
      await this.dataService.enrollUser(this.workshop.id, this.userId);
      this.workshop.availableSlots -= 1;
      this.isUserEnrolled = true;
    }
  }

  async onUnenroll(): Promise<void> {
    if (this.workshop && this.userId) {
      await this.dataService.unenrollUser(this.workshop.id, this.userId);
      this.workshop.availableSlots += 1;
      this.isUserEnrolled = false;
    }
  }
}
