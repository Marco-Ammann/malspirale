import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-farben',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farben.component.html',
  styleUrls: ['./farben.component.scss'],
})
export class FarbenComponent {
  farben = [
    {
      name: 'Rot – Urvertrauen',
      color: '#FF0000',
      bedeutung:
        'Rot symbolisiert die Kraft des Lebens und der Liebe. Es bringt Energie, Leidenschaft und Aktivität in unser System und hilft uns, ins Handeln zu kommen. Gleichzeitig steht es für unser Urvertrauen und die Fähigkeit, Pläne umzusetzen. Rot gibt Stabilität, fördert den Überlebenswillen und hilft uns, geerdet zu bleiben. Es verstärkt unsere Durchsetzungskraft und sorgt für Vitalität und Mut.',
      steine: 'Rubin, Granat',
    },
    {
      name: 'Koralle – Liebende Weisheit',
      color: '#FF6F61',
      bedeutung:
        'Koralle steht für liebende Weisheit und die Fähigkeit, sich selbst wertzuschätzen. Sie unterstützt dabei, emotionale Blockaden zu lösen und fördert die Fähigkeit, in Beziehungen harmonisch und verständnisvoll zu agieren. Koralle schenkt ein Gefühl der Zugehörigkeit, stärkt das Selbstbewusstsein und verleiht emotionale Klarheit. Sie hilft uns, Probleme mit Mitgefühl und Weisheit zu lösen.',
      steine: 'Rosenquarz, versteinerte Koralle, Chalcedon Rosa',
    },
    {
      name: 'Orange – Leichtigkeit und Freude',
      color: '#FFA500',
      bedeutung:
        'Orange ist die Farbe der Lebensfreude, Kreativität und des Optimismus. Sie verbindet uns mit unserem inneren Kind und bringt Verspieltheit und Begeisterung ins Leben. Orange hilft, sich von Sorgen und Ängsten zu befreien, und fördert ein Gefühl von Freiheit. Diese Farbe unterstützt emotionale Ausgeglichenheit und inspiriert zu neuen Ideen und schöpferischem Ausdruck.',
      steine: 'Bernstein, Topas, Dumortierit',
    },
    {
      name: 'Kupfer – Glück und Meisterschaft',
      color: '#B87333',
      bedeutung:
        'Kupfer wird mit Weiblichkeit, Wärme und Intuition in Verbindung gebracht. Es harmonisiert Körper, Geist und Seele und hilft, energetische Blockaden zu lösen. Kupfer steht für Transformation und Meisterschaft – es unterstützt uns dabei, aus Erfahrungen zu lernen und unser volles Potenzial zu entfalten. Diese Farbe hilft, innere Klarheit zu gewinnen und Verantwortung für das eigene Leben zu übernehmen.',
      steine: 'Kupfernugget, Kupfer-Chalcedon',
    },
    {
      name: 'Gold – Tiefe Weisheit und Erfüllung',
      color: '#FFD700',
      bedeutung:
        'Gold ist die Farbe des inneren Reichtums, der Weisheit und der göttlichen Vollkommenheit. Es symbolisiert Erleuchtung, Erfolg und spirituelles Wachstum. Gold verleiht eine tiefe innere Ruhe und unterstützt uns dabei, unser Selbstwertgefühl zu stärken. Es hilft, Zweifel zu überwinden und mit Würde und Stärke durchs Leben zu gehen.',
      steine: 'Citrin, Bernstein, Gold',
    },
    {
      name: 'Gelb – Sonnenenergie und Bewegung',
      color: '#FFFF00',
      bedeutung:
        'Gelb bringt Licht, Lebensfreude und mentale Klarheit. Es symbolisiert Intelligenz, Neugier und den Wunsch nach Wissen. Gelb regt den Geist an, verbessert die Konzentration und fördert eine positive Lebenseinstellung. Diese Farbe kann auch helfen, Sorgen und negative Gedanken loszulassen und stattdessen Offenheit und Leichtigkeit zu empfinden.',
      steine: 'Citrin, orange Calcit',
    },
    {
      name: 'Oliv – Selbstakzeptanz und Offenheit',
      color: '#808000',
      bedeutung:
        'Oliv verbindet uns mit der Natur und steht für Selbstakzeptanz, Wachstum und Veränderung. Diese Farbe unterstützt eine sanfte innere Führung und hilft, emotionale Muster zu erkennen und aufzulösen. Oliv fördert Diplomatie, Geduld und Verständnis, sodass wir Beziehungen harmonischer gestalten und neue Wege mit Zuversicht beschreiten können.',
      steine: 'Olivin (Peridot), Aventurin',
    },
    {
      name: 'Grün – Neuanfang und Heilung',
      color: '#008000',
      bedeutung:
        'Grün ist die Farbe der Heilung, Hoffnung und Erneuerung. Sie symbolisiert das Gleichgewicht zwischen Körper und Seele und hilft uns, Frieden in unser Leben zu bringen. Grün fördert die Verbindung zur Natur, stärkt unser Herzchakra und unterstützt uns dabei, emotionale Wunden zu heilen. Es gibt uns die Kraft, Veränderungen anzunehmen und voller Vertrauen nach vorne zu blicken.',
      steine: 'Jade, Malachit, Olivin, Smaragd',
    },
    {
      name: 'Rosa – Achtsamkeit und Selbstliebe',
      color: '#FFC0CB',
      bedeutung:
        'Rosa steht für bedingungslose Liebe, Sanftmut und Mitgefühl. Diese Farbe unterstützt emotionale Heilung und fördert das Bewusstsein für Selbstliebe und Fürsorge. Rosa bringt Harmonie ins Herz und hilft, zwischenmenschliche Beziehungen mit mehr Empathie und Verständnis zu gestalten. Sie beruhigt die Seele und schenkt ein Gefühl von Geborgenheit.',
      steine: 'Rosenquarz, rosa Calcit',
    },
    {
      name: 'Magenta – Göttliche Liebe und Transformation',
      color: '#FF00FF',
      bedeutung:
        'Magenta ist die Farbe der spirituellen Transformation und der göttlichen Liebe. Sie verbindet Himmel und Erde und hilft, innere Harmonie und tiefen Frieden zu finden. Magenta fördert das Mitgefühl und den Respekt vor allem, was lebt. Sie stärkt die Fähigkeit, sich selbst und anderen zu vergeben, und bringt eine tiefe spirituelle Weisheit mit sich.',
      steine: 'Turmalin, Rhodonit, Rubin-Zoisit',
    },
  ];
}
