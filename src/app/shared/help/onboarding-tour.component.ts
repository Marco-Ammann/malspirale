import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelpService } from '../../core/services/help.service';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

@Component({
  selector: 'app-onboarding-tour',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showTour" class="tour-overlay">
      <div class="tour-step" 
           [ngStyle]="getPositionStyle()" 
           [ngClass]="currentStep.position">
        <div class="step-header">
          <h3>{{ currentStep.title }}</h3>
          <button class="close-btn" (click)="endTour()">×</button>
        </div>
        <div class="step-content">
          <p>{{ currentStep.content }}</p>
        </div>
        <div class="step-footer">
          <span class="step-counter">{{ currentStepIndex + 1 }} / {{ tourSteps.length }}</span>
          <div class="step-buttons">
            <button *ngIf="currentStepIndex > 0" 
                    class="btn btn-outline" 
                    (click)="previousStep()">Zurück</button>
            <button *ngIf="currentStepIndex < tourSteps.length - 1" 
                    class="btn btn-primary" 
                    (click)="nextStep()">Weiter</button>
            <button *ngIf="currentStepIndex === tourSteps.length - 1" 
                    class="btn btn-success" 
                    (click)="endTour()">Fertig</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use 'variables' as vars;
    
    .tour-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2000;
      pointer-events: none;
    }
    
    .tour-step {
      position: absolute;
      width: 300px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
      pointer-events: all;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 10px solid transparent;
      }
      
      &.top::after {
        border-top-color: white;
        top: 100%;
        left: 50%;
        margin-left: -10px;
      }
      
      &.right::after {
        border-right-color: white;
        right: 100%;
        top: 50%;
        margin-top: -10px;
      }
      
      &.bottom::after {
        border-bottom-color: white;
        bottom: 100%;
        left: 50%;
        margin-left: -10px;
      }
      
      &.left::after {
        border-left-color: white;
        left: 100%;
        top: 50%;
        margin-top: -10px;
      }
      
      .step-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: vars.$accent-color-light;
        color: white;
        
        h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
        }
      }
      
      .step-content {
        padding: 1rem;
        
        p {
          margin: 0;
          color: vars.$text-color;
          line-height: 1.5;
        }
      }
      
      .step-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-top: 1px solid #e9ecef;
        
        .step-counter {
          font-size: 0.9rem;
          color: vars.$text-color-light;
        }
        
        .step-buttons {
          display: flex;
          gap: 0.5rem;
          
          .btn {
            padding: 0.35rem 0.75rem;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
            
            &.btn-outline {
              background-color: white;
              border: 1px solid vars.$accent-color;
              color: vars.$accent-color;
            }
            
            &.btn-primary {
              background-color: vars.$accent-color;
              border: 1px solid vars.$accent-color-dark;
              color: white;
            }
            
            &.btn-success {
              background-color: vars.$success-color;
              border: 1px solid color.adjust(vars.$success-color, $lightness: -10%);
              color: white;
            }
          }
        }
      }
    }
  `]
})
export class OnboardingTourComponent implements OnInit, OnDestroy {
  showTour = false;
  currentStepIndex = 0;
  targetElement: HTMLElement | null = null;
  
  tourSteps: TourStep[] = [
    {
      target: '.sidebar-header',
      title: 'Willkommen bei Malspirale Admin',
      content: 'Diese Tour führt dich durch die wichtigsten Funktionen. Hier findest du die Hauptnavigation für alle Verwaltungsbereiche.',
      position: 'right'
    },
    {
      target: '.quick-actions',
      title: 'Schnellzugriff',
      content: 'Hier findest du Buttons für häufig verwendete Aktionen wie das Erstellen eines neuen Workshops oder das Hochladen von Bildern.',
      position: 'bottom'
    },
    {
      target: '.stat-card:first-child',
      title: 'Statistiken',
      content: 'Hier siehst du wichtige Zahlen wie die Anzahl deiner Workshops oder Besucher auf deiner Website.',
      position: 'top'
    },
    {
      target: '.help-btn',
      title: 'Hilfe & Support',
      content: 'Wenn du Fragen hast oder Hilfe benötigst, klicke jederzeit auf diesen Button, um das Hilfesystem zu öffnen.',
      position: 'top'
    }
  ];
  
  get currentStep(): TourStep {
    return this.tourSteps[this.currentStepIndex];
  }
  
  private subscriptions = new Subscription();
  
  constructor(
    private helpService: HelpService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.subscriptions.add(
      this.helpService.firstVisit$.subscribe(isFirstVisit => {
        if (isFirstVisit) {
          // Verzögerung für bessere UX und damit DOM vollständig geladen ist
          setTimeout(() => {
            this.startTour();
          }, 1500);
        }
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  startTour(): void {
    this.showTour = true;
    this.currentStepIndex = 0;
    this.positionStep();
  }
  
  nextStep(): void {
    if (this.currentStepIndex < this.tourSteps.length - 1) {
      this.currentStepIndex++;
      this.positionStep();
    }
  }
  
  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.positionStep();
    }
  }
  
  endTour(): void {
    this.showTour = false;
    this.helpService.markFirstVisitComplete();
  }
  
  positionStep(): void {
    // Suche das Zielelement im DOM
    const target = document.querySelector(this.currentStep.target) as HTMLElement;
    this.targetElement = target;
    
    // Tour beenden, wenn Zielelement nicht gefunden wurde
    if (!target) {
      console.warn(`Tour target '${this.currentStep.target}' not found`);
      this.nextStep(); // Überspringe diesen Schritt
      return;
    }
  }
  
  getPositionStyle(): any {
    if (!this.targetElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = this.targetElement.getBoundingClientRect();
    
    switch (this.currentStep.position) {
      case 'top':
        return {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.top - 10}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'right':
        return {
          left: `${rect.right + 10}px`,
          top: `${rect.top + rect.height / 2}px`,
          transform: 'translateY(-50%)'
        };
      case 'bottom':
        return {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.bottom + 10}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          left: `${rect.left - 10}px`,
          top: `${rect.top + rect.height / 2}px`,
          transform: 'translate(-100%, -50%)'
        };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  }
}