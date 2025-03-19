import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { WorkshopRequestService } from '../../core/services/workshop-request.service';
import { Subscription, catchError, throwError, timeout, TimeoutError } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit, OnDestroy {
  contact = {
    name: '',
    email: '',
    phone: '',
    message: '',
    agreedToPrivacyPolicy: false
  };

  successMessage: string = '';
  errorMessage: string = '';
  sending: boolean = false;
  submitted: boolean = false;
  isWorkshopRequest: boolean = false;
  workshopTitle: string = '';
  
  private subscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private workshopRequestService: WorkshopRequestService
  ) {}

  ngOnInit(): void {
    // Prüfen, ob wir Parameter über die URL erhalten haben
    this.route.queryParams.subscribe(params => {
      if (params['type'] === 'workshop' && params['id']) {
        this.isWorkshopRequest = true;
      }
    });
    
    // Prüfen, ob wir Daten vom WorkshopRequestService haben
    this.subscription.add(
      this.workshopRequestService.requestData$.subscribe(data => {
        if (data) {
          this.isWorkshopRequest = true;
          this.workshopTitle = data.workshopTitle || '';
          
          if (data.message) {
            this.contact.message = data.message;
          }
        }
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // Daten löschen, wenn die Komponente zerstört wird
    this.workshopRequestService.clearRequestData();
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    
    if (form.valid && this.contact.agreedToPrivacyPolicy) {
      this.sending = true;
      this.successMessage = '';
      this.errorMessage = '';
      
      // Betreff für E-Mail anpassen, wenn es eine Workshop-Anfrage ist
      const contactData = {...this.contact};
      if (this.isWorkshopRequest && this.workshopTitle) {
        contactData.message = `Workshop-Anfrage: ${this.workshopTitle}\n\n${contactData.message}`;
      }
      
      // Build the URL - use absolute path for production
      const apiUrl = environment.production
        ? '/sendMail.php'  // Use relative path in production
        : `${environment.apiUrl}/sendMail.php`;  // Use environment.apiUrl in development
      
      console.log(`Sending to: ${apiUrl}`);
      
      this.http
        .post(apiUrl, contactData, {
          responseType: 'text',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .pipe(
          timeout(20000), // 20 second timeout
          catchError((error: HttpErrorResponse | TimeoutError) => {
            console.log('Error details:', error);
            let errorMsg = 'Fehler beim Senden der Nachricht.';
            
            if (error instanceof HttpErrorResponse) {
              if (error.status === 0) {
                errorMsg = 'Keine Verbindung zum Server möglich. Bitte überprüfe, ob der Server erreichbar ist oder kontaktiere uns direkt per E-Mail.';
              } else if (error.status === 400) {
                errorMsg = 'Ungültige Eingaben. Bitte überprüfe alle Felder.';
              } else if (error.status === 500) {
                errorMsg = 'Server-Fehler beim Senden. Bitte versuche es später erneut.';
              } else if (error.status === 405) {
                errorMsg = 'Diese Anfragemethode ist nicht erlaubt.';
              } else if (error.status === 429) {
                errorMsg = 'Zu viele Anfragen. Bitte versuche es später erneut.';
              }
            } else if (error instanceof TimeoutError) {
              errorMsg = 'Die Anfrage hat zu lange gedauert. Bitte versuche es später erneut.';
            }
            
            return throwError(() => new Error(errorMsg));
          })
        )
        .subscribe({
          next: (res) => {
            this.successMessage = this.isWorkshopRequest 
              ? 'Deine Workshop-Anfrage wurde erfolgreich versendet! Wir werden uns so schnell wie möglich bei dir melden.'
              : 'Nachricht wurde erfolgreich gesendet! Wir werden uns so schnell wie möglich bei dir melden.';
            
            this.errorMessage = '';
            form.resetForm();
            this.contact = {
              name: '',
              email: '',
              phone: '',
              message: '',
              agreedToPrivacyPolicy: false
            };
            this.submitted = false;
            this.sending = false;
            
            // Daten im Service löschen
            this.workshopRequestService.clearRequestData();
            
            // Nach 5 Sekunden Erfolgsmeldung ausblenden
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
          },
          error: (err) => {
            console.error('Fehler beim Senden:', err);
            this.errorMessage = err.message || 'Fehler beim Senden der Nachricht. Bitte versuche es später erneut oder kontaktiere uns direkt per E-Mail.';
            this.successMessage = '';
            this.sending = false;
          },
        });
    } else if (!this.contact.agreedToPrivacyPolicy) {
      this.errorMessage = 'Bitte stimme den Datenschutzbestimmungen zu, um das Formular zu senden.';
    }
  }
}