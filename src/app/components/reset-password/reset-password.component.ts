import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  resetComplete = false;
  actionCode = '';
  email = '';

  constructor(
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['oobCode']) {
        this.actionCode = params['oobCode'];
        this.verifyActionCode();
      } else {
        this.errorMessage = 'Ungültiger oder abgelaufener Link. Bitte fordere einen neuen Link an.';
      }
    });
  }

  async verifyActionCode(): Promise<void> {
    try {
      this.isLoading = true;
      this.email = await this.authService.verifyPasswordResetCode(this.actionCode);
    } catch (error: any) {
      console.error('Code verification error:', error);
      this.errorMessage = 'Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.';
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      this.markFormGroupTouched(this.resetPasswordForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { password } = this.resetPasswordForm.value;
      await this.authService.confirmPasswordReset(this.actionCode, password);
      
      this.resetComplete = true;
      this.successMessage = 'Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt mit deinem neuen Passwort anmelden.';
      
      // Kurze Verzögerung, damit der Benutzer die Erfolgsmeldung sehen kann
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      this.handleResetError(error);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) {
      return null;
    }
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    
    return !passwordValid ? { passwordStrength: true } : null;
  }

  private handleResetError(error: any): void {
    switch(error.code) {
      case 'auth/invalid-action-code':
        this.errorMessage = 'Dieser Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.';
        break;
      case 'auth/expired-action-code':
        this.errorMessage = 'Dieser Link ist abgelaufen. Bitte fordere einen neuen Link an.';
        break;
      case 'auth/user-disabled':
        this.errorMessage = 'Dieses Konto wurde deaktiviert. Bitte kontaktiere den Support.';
        break;
      case 'auth/user-not-found':
        this.errorMessage = 'Kein Konto mit dieser E-Mail-Adresse gefunden.';
        break;
      default:
        this.errorMessage = `Fehler beim Zurücksetzen des Passworts: ${error.message}`;
    }
  }

  getPasswordStrength(): { strength: number, text: string, color: string } {
    const password = this.resetPasswordForm.get('password')?.value || '';
    
    if (!password) {
      return { strength: 0, text: 'Sehr schwach', color: '#ff4d4d' };
    }
    
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthMap = [
      { text: 'Sehr schwach', color: '#ff4d4d' },
      { text: 'Schwach', color: '#ff8533' },
      { text: 'Mittel', color: '#ffcc00' },
      { text: 'Gut', color: '#5cd65c' },
      { text: 'Stark', color: '#00cc66' }
    ];
    
    return { 
      strength, 
      ...strengthMap[Math.min(strength, 4)] 
    };
  }
}