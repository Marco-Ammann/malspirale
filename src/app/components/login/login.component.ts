import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService
      .login(this.email, this.password)
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
        alert('Login fehlgeschlagen: ' + error.message);
      });
  }
}
