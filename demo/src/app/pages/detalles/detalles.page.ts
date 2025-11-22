import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonBadge, 
  IonText,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  create, 
  trash, 
  person, 
  business, 
  layers, 
  time, 
  calendar, 
  documentText, 
  chatbubbleEllipses, 
  alertCircle, 
  arrowBack,
  personCircle,
  card,
  call,
  mail,
  location,
  shieldCheckmark,
  ticket,
  clipboard,
  checkmarkCircle
} from 'ionicons/icons';
import { DataCenterService } from '../../services/datacenter.service';
import { 
  RegistroIngreso, 
  EstadoIngreso, 
  TipoTicket, 
  NivelSeguridad 
} from '../../interfaces/datacenter.interface';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonButton, 
    IonIcon, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle, 
    IonBadge, 
    IonText,
    CommonModule
  ]
})
export class DetallesPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Hacer disponibles los enums en el template
  EstadoIngreso = EstadoIngreso;
  TipoTicket = TipoTicket;
  NivelSeguridad = NivelSeguridad;
  
  registro?: RegistroIngreso;
  registroId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataCenterService: DataCenterService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ 
      create, 
      trash, 
      person, 
      business, 
      layers, 
      time, 
      calendar, 
      documentText, 
      chatbubbleEllipses, 
      alertCircle, 
      arrowBack,
      personCircle,
      card,
      call,
      mail,
      location,
      shieldCheckmark,
      ticket,
      clipboard,
      checkmarkCircle
    });
  }

  ngOnInit() {
    // Obtener el registro desde el state de navegación o cargar por ID
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['ingreso']) {
      this.registro = navigation.extras.state['ingreso'];
    } else {
      // Obtener el ID desde la ruta si no hay state
      this.registroId = this.route.snapshot.paramMap.get('id') || '';
      this.cargarRegistro();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarRegistro() {
    if (this.registroId) {
      this.dataCenterService.getRegistros()
        .pipe(takeUntil(this.destroy$))
        .subscribe((registros: RegistroIngreso[]) => {
          this.registro = registros.find(r => r.id === this.registroId);
        });
    }
  }

  getEstadoColor(estado: EstadoIngreso): string {
    switch (estado) {
      case EstadoIngreso.PENDIENTE:
        return 'warning';
      case EstadoIngreso.EN_PROCESO:
        return 'primary';
      case EstadoIngreso.COMPLETADO:
        return 'success';
      case EstadoIngreso.CANCELADO:
        return 'danger';
      default:
        return 'medium';
    }
  }

  getEstadoLabel(estado: EstadoIngreso): string {
    switch (estado) {
      case EstadoIngreso.PENDIENTE:
        return 'Pendiente';
      case EstadoIngreso.EN_PROCESO:
        return 'En Proceso';
      case EstadoIngreso.COMPLETADO:
        return 'Completado';
      case EstadoIngreso.CANCELADO:
        return 'Cancelado';
      default:
        return estado;
    }
  }

  getTipoTicketColor(tipoTicket: TipoTicket): string {
    switch (tipoTicket) {
      case TipoTicket.CRQ:
        return 'primary';
      case TipoTicket.INC:
        return 'danger';
      case TipoTicket.VISITA_INSPECTIVA:
        return 'secondary';
      case TipoTicket.RONDA_TURINARIA:
        return 'tertiary';
      default:
        return 'medium';
    }
  }

  getTipoTicketLabel(tipoTicket: TipoTicket): string {
    switch (tipoTicket) {
      case TipoTicket.CRQ:
        return 'CRQ - Change Request';
      case TipoTicket.INC:
        return 'INC - Incident';
      case TipoTicket.VISITA_INSPECTIVA:
        return 'Visita Inspectiva';
      case TipoTicket.RONDA_TURINARIA:
        return 'Ronda Turinaria';
      default:
        return tipoTicket;
    }
  }

  getNivelSeguridadColor(nivel: NivelSeguridad): string {
    switch (nivel) {
      case NivelSeguridad.BAJO:
        return 'success';
      case NivelSeguridad.MEDIO:
        return 'warning';
      case NivelSeguridad.ALTO:
        return 'danger';
      case NivelSeguridad.CRITICO:
        return 'dark';
      default:
        return 'medium';
    }
  }

  formatearFecha(fecha: Date | string): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  calcularTiempoTranscurrido(): string {
    if (!this.registro) return '0 horas';
    
    const fechaIngreso = new Date(this.registro.fechaIngreso);
    const fechaSalida = this.registro.fechaSalida ? new Date(this.registro.fechaSalida) : new Date();
    
    const diffMs = fechaSalida.getTime() - fechaIngreso.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes} minutos`;
  }

  editarRegistro() {
    if (this.registro) {
      this.router.navigate(['/editar'], { 
        state: { ingreso: this.registro } 
      });
    }
  }

  async marcarCompletado() {
    if (!this.registro) return;

    const alert = await this.alertController.create({
      header: 'Marcar como Completado',
      message: '¿Desea marcar este registro como completado? Se registrará la fecha y hora de salida.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.confirmarCompletado();
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarCompletado() {
    if (!this.registro) return;

    try {
      const ahora = new Date();
      const cambios = {
        estado: EstadoIngreso.COMPLETADO,
        fechaSalida: ahora,
        horaSalida: ahora.toLocaleTimeString('es-CL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      this.dataCenterService.updateRegistro(this.registro.id, cambios)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (registroActualizado) => {
            this.registro = registroActualizado;
            this.mostrarToast('Registro marcado como completado', 'success');
          },
          error: () => {
            this.mostrarToast('Error al actualizar el registro', 'danger');
          }
        });
    } catch (error) {
      this.mostrarToast('Error al marcar como completado', 'danger');
    }
  }

  async eliminarRegistro() {
    if (!this.registro) return;

    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de que desea eliminar el registro de ingreso de ${this.registro.tecnico.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmarEliminacion();
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarEliminacion() {
    if (!this.registro) return;

    try {
      this.dataCenterService.deleteRegistro(this.registro.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.mostrarToast('Registro eliminado exitosamente', 'success');
            this.router.navigate(['/listar']);
          },
          error: () => {
            this.mostrarToast('Error al eliminar el registro', 'danger');
          }
        });
    } catch (error) {
      this.mostrarToast('Error al eliminar el registro', 'danger');
    }
  }

  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}
