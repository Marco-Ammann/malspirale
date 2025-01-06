import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
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

  private sendMailUrl = 'https://malspirale.ch/api/sendmail.php'; // Korrigiere die Domain

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.sendContactForm(this.contact).subscribe({
        next: (response) => {
          if (response.success) {
            alert(response.message);
            form.resetForm();
          } else {
            alert(`Fehler: ${response.error}`);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Es gab einen Fehler beim Senden der Nachricht:', error);
          alert('Es gab ein Problem beim Senden deiner Nachricht. Bitte versuche es später erneut.');
        },
      });
    } else {
      alert('Bitte fülle alle Pflichtfelder korrekt aus.');
    }
  }

  sendContactForm(contactData: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', contactData.name);
    formData.append('email', contactData.email);
    formData.append('phone', contactData.phone);
    formData.append('message', contactData.message);

    return this.http.post<any>(this.sendMailUrl, formData);
  }
}
