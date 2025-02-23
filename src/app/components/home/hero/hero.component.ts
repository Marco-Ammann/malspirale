import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import Typed from 'typed.js';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {
  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    if (window.innerWidth >= 900) {
      const options = {
        stringsElement: '#typed-strings',
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 900,
        loop: false,
        showCursor: true,
      };
      new Typed('#typed-text', options);
    } else {
      const typedElem = document.getElementById('typed-text');
      if (typedElem) {
        typedElem.innerText = 'Kreativität entfalten';
      }
    }
  }

  navigateToWorkshops(): void {
    this.router.navigate(['/workshops']);
  }
}
