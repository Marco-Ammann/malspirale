import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  emailSent = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async sendResetEmail() {
    if (this.forgotPasswordForm.invalid) {
      this.markFormGroupTouched(this.forgotPasswordForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { email } = this.forgotPasswordForm.value;
      await this.authService.forgotPassword(email);
      
      this.emailSent = true;
      this.successMessage = `Eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts wurde an ${email} gesendet.`;
      
    } catch (error: any) {
      console.error('Password Reset Error:', error);
      this.handleResetError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleResetError(error: any) {
    switch(error.code) {
      case 'auth/user-not-found':
        this.errorMessage = 'Kein Konto mit dieser E-Mail-Adresse gefunden.';
        break;
      case 'auth/invalid-email':
        this.errorMessage = 'Ungültige E-Mail-Adresse.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'Zu viele Anfragen. Bitte versuche es später erneut.';
        break;
      default:
        this.errorMessage = `Fehler beim Zurücksetzen des Passworts: ${error.message}`;
    }
  }
}