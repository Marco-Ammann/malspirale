import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  HttpClient,
  HttpErrorResponse,
  HttpClientModule,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.http
        .post('https://malspirale.ch/sendmail.php', this.contact, {
          responseType: 'text',
        })
        .subscribe({
          next: (res) => {
            this.successMessage =
              'Nachricht wurde erfolgreich gesendet! Wir werden uns so schnell wie möglich bei dir melden.';
            this.errorMessage = '';
            form.reset();
          },
          error: (err) => {
            this.errorMessage =
              'Fehler beim Senden der Nachricht. Bitte versuche es später erneut.';
            this.successMessage = '';
          },
        });
    }
  }
}
