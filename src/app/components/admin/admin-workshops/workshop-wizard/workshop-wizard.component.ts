import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Workshop } from '../../../../core/interfaces/interfaces';
import { DataService } from '../../../../core/services/data.service';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-workshop-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './workshop-wizard.component.html',
  styleUrls: ['./workshop-wizard.component.scss'],
})
export class WorkshopWizardComponent implements OnInit, OnDestroy {
  currentStep = 1;
  totalSteps = 4;
  @Input() workshopId: string | null = null;
  @Output() saveComplete = new EventEmitter<void>();

  isEditMode = false;
  // Formulargruppen für verschiedene Schritte
  basicInfoForm: FormGroup;
  detailsForm: FormGroup;
  descriptionForm: FormGroup;
  publishForm: FormGroup;

  workshopTypes = [
    { id: 'workshop', label: 'Einzeltermin Workshop' },
    { id: 'malatelier', label: 'Regelmäßiges Malatelier' },
    { id: 'individuelleAnfrage', label: 'Individuelle Anfrage' },
  ];

  loading = false;
  errorMessage = '';
  successMessage = '';

  public selectedType = 'workshop';
  public selectedFile: File | null = null;
  public subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialisiere Formulare
    this.basicInfoForm = this.fb.group({
      type: ['workshop', Validators.required],
      title: ['', Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(150)]],
      location: ['', Validators.required],
    });

    this.detailsForm = this.fb.group({
      // Dynamisch je nach Typ
      date: [''],
      startTime: [''],
      endTime: [''],
      price: [0],
      maxParticipants: [null],
      availableSlots: [null],
      frequency: [''],
      contactEmail: [''],
    });

    this.descriptionForm = this.fb.group({
      description: ['', Validators.required],
      imageUrl: [''],
    });

    this.publishForm = this.fb.group({
      status: ['published'],
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode by checking if we have a workshopId
    this.isEditMode = !!this.workshopId;

    if (this.isEditMode && this.workshopId) {
      // Load workshop data
      this.loadWorkshop(this.workshopId);
    } else {
      // Check URL parameters as a fallback
      const routeId = this.route.snapshot.paramMap.get('id');
      if (routeId) {
        this.workshopId = routeId;
        this.isEditMode = true;
        this.loadWorkshop(routeId);
      }
    }

    // Monitor type changes for dynamic form validation
    this.subscriptions.add(
      this.basicInfoForm.get('type')!.valueChanges.subscribe((type) => {
        this.selectedType = type;
        this.updateDetailsFormValidators();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadWorkshop(id: string): void {
    this.loading = true;
    console.log('Loading workshop with ID:', id); // Debugging

    this.dataService.getWorkshop(id).subscribe({
      next: (workshop) => {
        console.log('Loaded workshop data:', workshop); // Debugging

        // Set the type first
        this.selectedType = workshop.type || 'workshop';
        this.basicInfoForm.patchValue({
          type: this.selectedType,
        });

        // Basic information
        this.basicInfoForm.patchValue({
          title: workshop.title || '',
          shortDescription: workshop.shortDescription || '',
          location: workshop.location || '',
        });

        // Details based on type
        const detailsData: any = {};
        if (workshop.date) detailsData.date = workshop.date;
        if (workshop.startTime) detailsData.startTime = workshop.startTime;
        if (workshop.endTime) detailsData.endTime = workshop.endTime;
        if (workshop.price !== undefined) detailsData.price = workshop.price;
        if (workshop.maxParticipants)
          detailsData.maxParticipants = workshop.maxParticipants;
        if (workshop.availableSlots !== undefined)
          detailsData.availableSlots = workshop.availableSlots;
        if (workshop.frequency) detailsData.frequency = workshop.frequency;
        if (workshop.contactEmail)
          detailsData.contactEmail = workshop.contactEmail;

        console.log('Patching details form with:', detailsData); // Debugging
        this.detailsForm.patchValue(detailsData);

        // Description and image
        this.descriptionForm.patchValue({
          description: workshop.description || '',
          imageUrl: workshop.imageUrl || '',
        });

        // Status information
        this.publishForm.patchValue({
          status: workshop.status || 'published',
        });

        // Update validators for the selected type
        this.updateDetailsFormValidators();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading workshop:', error);
        this.errorMessage =
          'Workshop could not be loaded: ' + (error.message || error);
        this.loading = false;
      },
    });
  }

  updateDetailsFormValidators(): void {
    // Setze Validatoren basierend auf dem Typ
    const detailsControls = this.detailsForm.controls;

    // Zurücksetzen aller Validatoren
    Object.keys(detailsControls).forEach((key) => {
      detailsControls[key].clearValidators();
    });

    // Setze spezifische Validatoren je nach Typ
    if (this.selectedType === 'workshop') {
      detailsControls['date'].setValidators([Validators.required]);
      detailsControls['price'].setValidators([
        Validators.required,
        Validators.min(0),
      ]);
    } else if (this.selectedType === 'malatelier') {
      detailsControls['frequency'].setValidators([Validators.required]);
    } else if (this.selectedType === 'individuelleAnfrage') {
      detailsControls['contactEmail'].setValidators([
        Validators.required,
        Validators.email,
      ]);
    }

    // Aktualisiere den Formularstatus
    Object.keys(detailsControls).forEach((key) => {
      detailsControls[key].updateValueAndValidity();
    });
  }

  nextStep(): void {
    // Validiere den aktuellen Schritt
    if (this.validateCurrentStep()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.basicInfoForm.valid;
      case 2:
        return this.detailsForm.valid;
      case 3:
        return this.descriptionForm.valid;
      default:
        return true;
    }
  }

  async handleImageUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    // Setze die Formularfelder für die Vorschau
    if (this.selectedFile) {
      try {
        const imageUrl = await this.uploadImage(this.selectedFile);
        if (imageUrl) {
          this.descriptionForm.patchValue({
            imageUrl: imageUrl,
          });
        }
      } catch (error) {
        this.errorMessage = 'Fehler beim Hochladen des Bildes.';
      }
    }
  }

  async uploadImage(file: File): Promise<string | null> {
    try {
      return await this.storageService.uploadImage(file);
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error);
      return null;
    }
  }

  async saveWorkshop(): Promise<void> {
    this.loading = true;

    try {
      // Sammle alle Daten aus den Formularen
      const workshopData: Workshop = {
        ...this.basicInfoForm.value,
        ...this.detailsForm.value,
        ...this.descriptionForm.value,
        ...this.publishForm.value,
        type: this.selectedType,
      };

      // Entferne leere Felder
      Object.keys(workshopData as Record<string, any>).forEach((key) => {
        const value = (workshopData as Record<string, any>)[key];
        if (value === '' || value === null) {
          delete (workshopData as Record<string, any>)[key];
        }
      });

      if (this.isEditMode && this.workshopId) {
        // Update existierenden Workshop
        workshopData.id = this.workshopId;
        await this.dataService.updateWorkshop(workshopData);
        this.successMessage = 'Workshop erfolgreich aktualisiert.';
      } else {
        // Erstelle neuen Workshop
        const newId = await this.dataService.saveWorkshop(workshopData);
        this.successMessage = 'Workshop erfolgreich erstellt.';
      }

      // Statt zu navigieren, emittieren wir ein Event
      this.saveComplete.emit();
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage =
          'Fehler beim Speichern des Workshops: ' + error.message;
      } else {
        this.errorMessage = 'Fehler beim Speichern des Workshops';
      }
      console.error('Speicherfehler:', error);
    } finally {
      this.loading = false;
    }
  }

  cancelWorkshop(): void {
    this.router.navigate(['/admin/workshops']);
  }

  applyFormat(format: string): void {
    const textarea = document.querySelector(
      '#description'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText}`;
        break;
      case 'ul':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
    }

    // Ersetze den ausgewählten Text mit formatiertem Text
    textarea.setRangeText(formattedText, start, end, 'select');

    // Fokussiere zurück auf das Textarea
    textarea.focus();

    // Aktualisiere das Formular
    this.descriptionForm.patchValue({
      description: textarea.value,
    });
  }
}
