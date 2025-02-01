import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  role: string = 'user';
  errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Bitte alle Pflichtfelder ausfüllen!';
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.authService.getAuthInstance(),
        this.email,
        this.password
      );

      const user = userCredential.user;

      await setDoc(doc(this.authService.db, 'users', user.uid), {
        fullName: this.fullName,
        email: user.email,
        phoneNumber: this.phoneNumber || null,
        role: this.role,
        createdAt: new Date(),
      });

      alert('Registrierung erfolgreich!');
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.fullName = '';
      this.email = '';
      this.password = '';
      this.phoneNumber = '';
      this.role = 'user';
      this.router.navigate(['/login']);
    }
  }
}
