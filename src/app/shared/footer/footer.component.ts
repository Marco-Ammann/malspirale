import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__main">
          <div class="footer__brand">
            <h2 class="footer__title">Malspirale</h2>
            <p class="footer__subtitle">Kreatives Ausdrucksmalen in Riggisberg</p>
            <p class="footer__description">
              Entdecken Sie die Kraft der Farben und lassen Sie Ihrer Kreativität freien Lauf.
            </p>
          </div>
          
          <nav class="footer__links">
            <div class="footer__links-group">
              <h3 class="footer__group-title">Navigation</h3>
              <a routerLink="/home" class="footer__link">Home</a>
              <a routerLink="/gallery" class="footer__link">Galerie</a>
              <a routerLink="/workshops" class="footer__link">Workshops</a>
              <a routerLink="/about" class="footer__link">Über mich</a>
              <a routerLink="/contact" class="footer__link">Kontakt</a>
            </div>
            
            <div class="footer__links-group">
              <h3 class="footer__group-title">Philosophie</h3>
              <a routerLink="/philosophy/farben" class="footer__link">Farben</a>
              <a routerLink="/philosophy/geschichten" class="footer__link">Geschichten</a>
              <a routerLink="/philosophy/resonance-colors" class="footer__link">Resonance Colors</a>
            </div>
            
            <div class="footer__links-group">
              <h3 class="footer__group-title">Rechtliches</h3>
              <a routerLink="/impressum" class="footer__link">Impressum</a>
              <a routerLink="/datenschutz" class="footer__link">Datenschutz</a>
            </div>
          </nav>
        </div>
        
        <div class="footer__bottom">
          <p class="footer__copyright">
            &copy; {{ currentYear }} Isabel Kunz-Schindler | Alle Rechte vorbehalten
          </p>
          <p class="footer__attribution">
            Mit <span class="footer__heart">❤️</span> entwickelt von 
            <a href="https://marco-ammann.ch" target="_blank" rel="noopener" class="footer__dev-link">
              Marco Ammann
            </a>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @use '../../../assets/styles/variables' as *;
    
    .footer {
      background-color: $accent-color;
      color: $text-color-white;
      padding: $padding-extra-large 0;
      
      &__container {
        max-width: $container-max-width-xl;
        margin: 0 auto;
        padding: 0 $container-padding;
      }
      
      &__main {
        display: grid;
        grid-template-columns: minmax(250px, 1fr) 2fr;
        gap: $container-gap-large;
        margin-bottom: $padding-large;
        
        @media (max-width: $breakpoint-md) {
          grid-template-columns: 1fr;
        }
      }
      
      &__brand {
        padding-right: $padding-large;
      }
      
      &__title {
        font-family: $font-family-heading;
        font-size: $font-size-xxlarge;
        margin: 0 0 $padding-small;
        font-weight: $font-weight-bold;
      }
      
      &__subtitle {
        font-size: $font-size-medium;
        margin: 0 0 $padding-medium;
        opacity: 0.9;
      }
      
      &__description {
        font-size: $font-size-base;
        opacity: 0.8;
        line-height: $line-height;
        margin: 0;
      }
      
      &__links {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: $container-gap-large;
      }
      
      &__group-title {
        font-family: $font-family-heading;
        font-size: $font-size-medium;
        margin: 0 0 $padding-medium;
        font-weight: $font-weight-bold;
      }
      
      &__link {
        display: block;
        color: rgba($text-color-white, 0.8);
        text-decoration: none;
        margin-bottom: $padding-small;
        transition: all 0.3s ease;
        
        &:hover {
          color: $text-color-white;
          transform: translateX(4px);
        }
      }
      
      &__bottom {
        padding-top: $padding-large;
        margin-top: $padding-large;
        border-top: 1px solid rgba($text-color-white, 0.2);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: $padding-medium;
        
        @media (max-width: $breakpoint-sm) {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
      }
      
      &__copyright, &__attribution {
        margin: 0;
        font-size: $font-size-small;
        opacity: 0.9;
      }
      
      &__heart {
        display: inline-block;
        animation: pulse 1.5s ease infinite;
      }

      &__dev-link {
        color: $text-color-white;
        text-decoration: none;
        border-bottom: 1px solid rgba($text-color-white, 0.4);
        transition: all 0.3s ease;
        
        &:hover {
          color: $text-color-white;
          border-bottom-color: $text-color-white;
        }
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}