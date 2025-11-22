import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, imagesOutline, trashOutline, homeOutline, imageOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FotocamaraStorageService,Fotocamara } from '../../services/fotcamara-storage.services';  

// Componente para captura de fotos con cámara y galería
@Component({
  selector: 'app-testcamara',
  templateUrl: './testcamara.page.html',
  styleUrls: ['./testcamara.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class TestcamaraPage implements OnInit {
  fotoscamara: Fotocamara[] = [];
  foto: string | undefined;
  tomandoFoto: boolean = false;

  constructor(
    private fotocamaraStorageService: FotocamaraStorageService,
    public router: Router
  ) { 
    addIcons({ 'camera-outline': cameraOutline, 'images-outline': imagesOutline, 'trash-outline': trashOutline, 'home-outline': homeOutline, 'image-outline': imageOutline });
  }

  async ngOnInit() {
    this.fotoscamara = await this.fotocamaraStorageService.obtenerFotocamara('usuario');
    console.log('📂 Fotos cargadas al iniciar la página:', this.fotoscamara.length);
    console.log('Fotos guardadas previamente:', this.fotoscamara);
  }

  // Capturar foto usando la cámara del dispositivo
  async tomarFoto(){
    if (this.tomandoFoto) return;
    
    this.tomandoFoto = true;
    
    try{
      const foto = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      
      this.foto = foto.dataUrl;
      
      // Guardar foto en almacenamiento local
      if (this.foto) {
        const nuevaFoto: Fotocamara = {
          id: `foto_${new Date().getTime()}`,
          nombre: `camara_${new Date().getTime()}.jpeg`,
          rutaArchivo: foto.webPath || '',
          fechaCaptura: new Date().toISOString(),
          base64Data: this.foto
        };
        this.fotoscamara.push(nuevaFoto);
        await this.fotocamaraStorageService.guardarFotocamara('usuario', this.fotoscamara);
        
        console.log('📸 Foto tomada y guardada:');
        console.log('Total de fotos:', this.fotoscamara.length);
        console.log('Todas las fotos guardadas:', this.fotoscamara);
      }
      
    } catch(error: any) {
      console.log('Acción cancelada o error:', error);
      if (error.message && !error.message.includes('cancel')) {
        console.error('Error al tomar la foto:', error);
      }
    } finally {
      setTimeout(() => {
        this.tomandoFoto = false;
      }, 100);
    }
  }

  // Seleccionar imagen desde la galería
  async seleccionarDeGaleria(){
    if (this.tomandoFoto) return;
    
    this.tomandoFoto = true;
    
    try{
      const foto = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });
      
      this.foto = foto.dataUrl;
      
      // Guardar foto en almacenamiento local
      if (this.foto) {
        const nuevaFoto: Fotocamara = {
          id: `foto_${new Date().getTime()}`,
          nombre: `galeria_${new Date().getTime()}.jpeg`,
          rutaArchivo: foto.webPath || '',
          fechaCaptura: new Date().toISOString(),
          base64Data: this.foto
        };
        this.fotoscamara.push(nuevaFoto);
        await this.fotocamaraStorageService.guardarFotocamara('usuario', this.fotoscamara);
        
        console.log('🖼️ Foto seleccionada de galería y guardada:');
        console.log('Total de fotos:', this.fotoscamara.length);
        console.log('Todas las fotos guardadas:', this.fotoscamara);
      }

    } catch(error: any) {
      console.log('Acción cancelada o error:', error);
      if (error.message && !error.message.includes('cancel')) {
        console.error('Error al seleccionar imagen:', error);
      }
    } finally {
      setTimeout(() => {
        this.tomandoFoto = false;
      }, 100);
    } 
  }

  // Limpiar la foto actual
  limpiarFoto(): void {
    this.foto = undefined;
    console.log('Foto limpiada');
  }

  // Eliminar una foto específica del array
  async eliminarFoto(index: number): Promise<void> {
    try {
      const fotoEliminada = this.fotoscamara[index];
      this.fotoscamara.splice(index, 1);
      await this.fotocamaraStorageService.guardarFotocamara('usuario', this.fotoscamara);
      
      console.log('🗑️ Foto eliminada:', fotoEliminada.nombre);
      console.log('Total de fotos restantes:', this.fotoscamara.length);
      console.log('Fotos guardadas:', this.fotoscamara);
    } catch (error) {
      console.error('Error al eliminar foto:', error);
    }
  }

  // Eliminar todas las fotos
  async eliminarTodasLasFotos(): Promise<void> {
    try {
      const totalFotos = this.fotoscamara.length;
      this.fotoscamara = [];
      this.foto = undefined;
      await this.fotocamaraStorageService.eliminarFotocamaras('usuario');
      
      console.log(`🗑️ Todas las fotos eliminadas (${totalFotos} fotos)`);
      console.log('Array de fotos:', this.fotoscamara);
    } catch (error) {
      console.error('Error al eliminar todas las fotos:', error);
    }
  }
}
