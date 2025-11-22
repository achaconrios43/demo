import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locateOutline, mapOutline, refreshOutline, informationCircleOutline, homeOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';

// Estructura de datos para ubicación GPS
interface GPSlocation {
  latitud: number;
  longitud: number;
  accuracy: number;
  timestamp: number;
}
@Component({
  selector: 'app-testgeo',
  templateUrl: './testgeo.page.html',
  styleUrls: ['./testgeo.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, CommonModule, FormsModule]
})
export class TestgeoPage implements OnInit {

  // Almacena la información de ubicación actual
  ubicacion: GPSlocation | undefined;

  // Indica si está en proceso de obtener la ubicación
  obteniendoUbicacion: boolean = false;

  constructor(public router: Router) { 
    addIcons({ locateOutline, mapOutline, refreshOutline, informationCircleOutline, homeOutline });
  }

  ngOnInit() {
  }

  // Obtener la ubicación actual del dispositivo
  async obtenerUbicacion() {
    this.obteniendoUbicacion = true;
    
    try {
      // Solicitar permisos solo en móvil (en web no está implementado)
      try {
        const permisos = await Geolocation.requestPermissions();
        if (permisos.location !== 'granted') {
          throw new Error('Permisos de ubicación denegados');
        }
      } catch (permError: any) {
        // En web, requestPermissions lanza error "Not implemented", pero getCurrentPosition funciona
        if (!permError.message?.includes('Not implemented')) {
          throw permError;
        }
        console.log('Plataforma web detectada');
      }

      // Obtener posición actual con alta precisión
      const posicion = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      });
      
      this.ubicacion = {
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
        accuracy: posicion.coords.accuracy,
        timestamp: posicion.timestamp,
      };
      
      console.log('Ubicación obtenida exitosamente:', this.ubicacion);
      
    } catch (error: any) {
      console.error('Error al obtener la ubicación:', error);
      
      let mensaje = 'Error al obtener ubicación.\n\n';
      
      if (error.message?.includes('denied') || error.message?.includes('denegados')) {
        mensaje += 'Permisos de ubicación denegados.';
      } else if (error.message?.includes('timeout')) {
        mensaje += 'Tiempo de espera agotado. Intente nuevamente.';
      } else if (error.message?.includes('unavailable')) {
        mensaje += 'Servicio de ubicación no disponible.';
      } else {
        mensaje += 'Verifique:\n- GPS habilitado\n- Permisos concedidos\n- En web usar HTTPS (localhost está permitido)';
      }
      
      alert(mensaje);
      
    } finally {
      this.obteniendoUbicacion = false;
    }
  }

  // Abrir la ubicación actual en Google Maps
  obtenerenlaceMap(): void {
    if (this.ubicacion) {
      const url = `https://www.google.com/maps?q=${this.ubicacion.latitud},${this.ubicacion.longitud}`;
      window.open(url, '_blank');
      console.log('Abriendo ubicación en Google Maps:', url);
    } else {
      console.warn('No hay ubicación disponible para mostrar en el mapa');
      alert('Primero debe obtener su ubicación actual');
    }
  }

  // Limpiar la ubicación actual
  limpiarUbicacion(): void {
    this.ubicacion = undefined;
    console.log('Ubicación limpiada');
  }

  // Formatear las coordenadas para mostrar
  formatearCoordenadas(): string {
    if (this.ubicacion) {
      return `Lat: ${this.ubicacion.latitud.toFixed(6)}, Lng: ${this.ubicacion.longitud.toFixed(6)}`;
    }
    return 'No disponible';
  }
}
