import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Hier könntest du eine echte Backend-Anfrage hinzufügen
      alert('Vielen Dank für deine Nachricht! Isabel wird sich bald bei dir melden.');
      form.resetForm();
    } else {
      alert('Bitte fülle alle Pflichtfelder korrekt aus.');
    }
  }
}
