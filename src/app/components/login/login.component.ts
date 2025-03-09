import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService
      .login(email, password, rememberMe)
      .then(async () => {
        const role = await this.authService.getUserRole();
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'user') {
          this.router.navigate(['/user-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      })
      .catch((error) => {
        console.error('Login Error:', error);
        this.handleLoginError(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleLoginError(error: any) {
    switch(error.code) {
      case 'auth/user-not-found':
        this.errorMessage = 'E-Mail-Adresse wurde nicht gefunden.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Falsches Passwort.';
        break;
      case 'auth/invalid-credential':
        this.errorMessage = 'Ungültige Anmeldedaten.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'Zu viele fehlgeschlagene Versuche. Bitte versuche es später erneut.';
        break;
      default:
        this.errorMessage = `Anmeldung fehlgeschlagen: ${error.message}`;
    }
  }
}