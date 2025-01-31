import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService
      .register(this.email, this.password)
      .then(() => {
        alert('Registrierung erfolgreich! Bitte loggen Sie sich ein.');
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }
}
