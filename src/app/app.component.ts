import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { AuthService } from './core/services/auth.service';
import {
  trigger,
  transition,
  query,
  style,
  animate,
  group,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AppComponent {
  loading = true;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe(() => {
      this.loading = false;
    });
  }

  ngOnInit() {
    // Starte die Navigation manuell
    this.router.navigate(['/']); // oder this.router.initialNavigation();
  }

}

export const routeTransitionAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ opacity: 0 }),
    animate('0.5s ease-in-out', style({ opacity: 1 })),
  ]),
]);
