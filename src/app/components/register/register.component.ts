import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  registrationSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [''],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
        agreeTerms: [false, Validators.requiredTrue],
        role: ['user'],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  async register() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { fullName, email, phoneNumber, password, role } =
        this.registerForm.value;
      const userCredential = await createUserWithEmailAndPassword(
        this.authService.getAuthInstance(),
        email,
        password
      );

      const user = userCredential.user;

      // E-Mail-Bestätigung senden
      await sendEmailVerification(user);

      await setDoc(doc(this.authService.db, 'users', user.uid), {
        fullName,
        email: user.email,
        phoneNumber: phoneNumber || null,
        role,
        createdAt: new Date(),
      });

      this.registrationSuccess = true;

      // Kurze Verzögerung, damit der Benutzer die Erfolgsmeldung sehen kann
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      console.error('Registration Error:', error);
      this.handleRegistrationError(error);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  private passwordStrengthValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const passwordValid =
      hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  private handleRegistrationError(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.errorMessage = 'E-Mail-Adresse wird bereits verwendet.';
        break;
      case 'auth/invalid-email':
        this.errorMessage = 'Ungültige E-Mail-Adresse.';
        break;
      case 'auth/weak-password':
        this.errorMessage = 'Das Passwort ist zu schwach.';
        break;
      default:
        this.errorMessage = `Registrierung fehlgeschlagen: ${error.message}`;
    }
  }

  getPasswordStrength(): { strength: number; text: string; color: string } {
    const password = this.registerForm.get('password')?.value || '';

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
      { text: 'Stark', color: '#00cc66' },
    ];

    return {
      strength,
      ...strengthMap[Math.min(strength, 4)],
    };
  }
}
