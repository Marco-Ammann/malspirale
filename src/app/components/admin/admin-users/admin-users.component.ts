import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {
  users = [
    { id: 1, name: 'Max Mustermann', email: 'max@example.com' },
    { id: 2, name: 'Anna Schmidt', email: 'anna@example.com' }
  ];

  editUser(id: number): void {
    console.log('Benutzer bearbeiten:', id);
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
