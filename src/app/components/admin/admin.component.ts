import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Firestore } from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  userCount: number = 0;
  workshopCount: number = 0;
  lastContentUpdate?: Date;

  constructor(private router: Router, private authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    this.loadUserCount();
    this.loadWorkshopCount();
  }

  loadUserCount(): void {
    this.authService.getUserCount().then((count) => {
      this.userCount = count;
    });
  }

  loadWorkshopCount(): void {
    this.dataService.getWorkshops().subscribe((workshops) => {
      this.workshopCount = workshops.length;
    });
  }

  manageUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  manageWorkshops(): void {
    this.router.navigate(['/admin/workshops']);
  }

  editContent(): void {
    this.router.navigate(['/admin/content']);
  }
}
function collection(firestore: Firestore, arg1: string) {
  throw new Error('Function not implemented.');
}

function collectionData(usersCollection: any) {
  throw new Error('Function not implemented.');
}

