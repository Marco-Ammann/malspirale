import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Workshop } from '../../core/interfaces/interfaces';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  userEmail: string | null = null;
  enrolledWorkshops: Workshop[] = [];

  constructor(private authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.userEmail = user?.email || null;
      if (user) {
        this.loadEnrolledWorkshops(user.uid);
      }
    });
  }

  loadEnrolledWorkshops(userId: string): void {
    this.dataService.getEnrolledWorkshops(userId).subscribe((workshops) => {
      this.enrolledWorkshops = workshops;
    });
  }
}
