import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { doc, getDocs, deleteDoc, collection } from 'firebase/firestore';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    const db = this.authService.db;
    const querySnapshot = await getDocs(collection(db, 'users'));

    this.users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async deleteUser(id: string) {
    if (confirm('Möchtest du diesen Benutzer wirklich löschen?')) {
      await deleteDoc(doc(this.authService.db, 'users', id));
      this.users = this.users.filter(user => user.id !== id);
    }
  }

  editUser(id: string) {
    console.log(`Bearbeite Benutzer mit ID: ${id}`);
    // Hier kannst du einen Dialog oder ein Formular öffnen
  }
}
