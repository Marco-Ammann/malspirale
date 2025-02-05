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
        'Rot bringt Energie, Leidenschaft und Stärke. Es steht für Urvertrauen und Erdung.',
      steine: 'Rubin, Granat',
    },
    {
      name: 'Koralle – Liebende Weisheit',
      color: '#FF6F61',
      bedeutung:
        'Koralle unterstützt harmonische Beziehungen und hilft, sich selbst zu lieben.',
      steine: 'Rosenquarz, versteinerte Koralle, Chalcedon Rosa',
    },
    {
      name: 'Orange – Leichtigkeit und Freude',
      color: '#FFA500',
      bedeutung: 'Orange steht für Lebensfreude, Kreativität und Vitalität.',
      steine: 'Bernstein, Topas, Dumortierit',
    },
    {
      name: 'Gelb – Sonnenenergie und Bewegung',
      color: '#FFFF00',
      bedeutung:
        'Gelb bringt Licht und Wärme, fördert Klarheit und Lebensfreude.',
      steine: 'Citrin, orange Calcit',
    },
    {
      name: 'Grün – Neuanfang und Heilung',
      color: '#008000',
      bedeutung: 'Grün steht für Wachstum, Heilung und Ausgeglichenheit.',
      steine: 'Jade, Malachit, Olivin, Smaragd',
    },
    {
      name: 'Türkis – Verantwortung und Freiheit',
      color: '#40E0D0',
      bedeutung:
        'Türkis fördert die Intuition und hilft, Verantwortung zu übernehmen.',
      steine: 'Türkis, Aquamarin',
    },
    {
      name: 'Blau – Konzentration auf das Wesentliche',
      color: '#0000FF',
      bedeutung: 'Blau steht für Wahrheit, Kommunikation und Ruhe.',
      steine: 'Lapislazuli, blauer Chalcedon, Sodalith',
    },
    {
      name: 'Indigo – Intuition und Ganzheit',
      color: '#4B0082',
      bedeutung:
        'Indigo öffnet unser Drittes Auge und hilft bei inneren Einsichten.',
      steine: 'Lapislazuli, Azurit, Saphir',
    },
    {
      name: 'Violett – Tiefe Auflösung und Vertrauen',
      color: '#800080',
      bedeutung:
        'Violett steht für Transformation, spirituelle Tiefe und Vertrauen.',
      steine: 'Amethyst, Charoit',
    },
    {
      name: 'Magenta – Göttliche Liebe',
      color: '#FF00FF',
      bedeutung:
        'Magenta fördert göttliche Liebe und Respekt vor allem, was lebt.',
      steine: 'Keine spezifischen Steine angegeben',
    },
  ];
}
