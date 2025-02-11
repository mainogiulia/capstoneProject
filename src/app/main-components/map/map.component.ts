import { Component } from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  private map!: L.Map;

  private initMap(): void {
    this.map = L.map('map').setView([45.67, 11.515], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    const iconDefault = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    L.Marker.prototype.options.icon = iconDefault;

    L.marker([45.67, 11.515], { icon: iconDefault })
      .addTo(this.map)
      .bindPopup('📍 Via Astichello, 58, Montecchio Precalcino')
      .openPopup();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
