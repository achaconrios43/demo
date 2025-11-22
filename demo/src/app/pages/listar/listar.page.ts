import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  IonSearchbar, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonItem, 
  IonLabel, 
  IonSelect, 
  IonSelectOption, 
  IonBadge, 
  IonText,
  IonDatetime,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  add,
  filter, 
  construct, 
  time, 
  checkmarkCircle, 
  star, 
  eye, 
  create, 
  trash, 
  chevronForward
} from 'ionicons/icons';
import { DataCenterService } from '../../services/datacenter.service';
import { 
  RegistroIngreso, 
  DataCenter,
  TipoTicket, 
  EstadoIngreso, 
  FiltroIngresos 
} from '../../interfaces/datacenter.interface';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
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
    IonSearchbar, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonItem, 
    IonLabel, 
    IonSelect, 
    IonSelectOption, 
    IonBadge, 
    IonText,
    IonDatetime,
    CommonModule, 
    FormsModule
  ]
})
export class ListarPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Hacer disponible el enum en el template
  EstadoIngreso = EstadoIngreso;
  TipoTicket = TipoTicket;
  
  ingresos: RegistroIngreso[] = [];
  ingresosFiltrados: RegistroIngreso[] = [];
  dataCenters: DataCenter[] = [];
  searchTerm = '';
  showFilters = false;
  
  filtros: FiltroIngresos = {};
  
  // Datos para los selectores
  salasDisponibles = [
    'Conmutación',
    'Mainframe', 
    'CPD2',
    'CPD1',
    'CrossConnect',
    'GSM'
  ];

  tiposTicket = [
    { value: TipoTicket.CRQ, label: 'CRQ - Change Request' },
    { value: TipoTicket.INC, label: 'INC - Incident' },
    { value: TipoTicket.VISITA_INSPECTIVA, label: 'Visita Técnica' }
  ];

  estadosIngreso = [
    { value: EstadoIngreso.PENDIENTE, label: 'Pendiente' },
    { value: EstadoIngreso.EN_PROCESO, label: 'En Proceso' },
    { value: EstadoIngreso.COMPLETADO, label: 'Completado' },
    { value: EstadoIngreso.CANCELADO, label: 'Cancelado' }
  ];

  empresasUnicas: string[] = [];

  constructor(
    private router: Router,
    private dataCenterService: DataCenterService,
    private alertController: AlertController
  ) {
    addIcons({
      add,
      filter,
      construct,
      time,
      checkmarkCircle,
      star,
      eye,
      create,
      trash,
      chevronForward
    });
  }

  ngOnInit() {
    this.cargarIngresos();
    this.cargarDataCenters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarIngresos() {
    this.dataCenterService.getRegistros()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ingresos: RegistroIngreso[]) => {
        this.ingresos = ingresos;
        this.extraerEmpresasUnicas();
        this.aplicarFiltros();
      });
  }

  cargarDataCenters() {
    this.dataCenterService.getDataCenters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dataCenters: DataCenter[]) => {
        this.dataCenters = dataCenters;
      });
  }

  extraerEmpresasUnicas() {
    const empresas = new Set(this.ingresos.map(ingreso => ingreso.tecnico.empresa));
    this.empresasUnicas = Array.from(empresas).sort();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultados = [...this.ingresos];

    // Filtro por término de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      resultados = resultados.filter(ingreso =>
        ingreso.tecnico.nombre.toLowerCase().includes(term) ||
        ingreso.tecnico.rut.toLowerCase().includes(term) ||
        ingreso.tecnico.empresa.toLowerCase().includes(term) ||
        ingreso.numeroTicket.toLowerCase().includes(term) ||
        ingreso.responsableActividad.toLowerCase().includes(term) ||
        ingreso.autorizadorIngreso.toLowerCase().includes(term)
      );
    }

    // Filtros específicos
    if (this.filtros.dataCenter) {
      resultados = resultados.filter(ingreso => ingreso.dataCenter.id === this.filtros.dataCenter);
    }

    if (this.filtros.sala) {
      resultados = resultados.filter(ingreso => ingreso.sala.id === this.filtros.sala);
    }

    if (this.filtros.tipoTicket) {
      resultados = resultados.filter(ingreso => ingreso.tipoTicket === this.filtros.tipoTicket);
    }

    if (this.filtros.estado) {
      resultados = resultados.filter(ingreso => ingreso.estado === this.filtros.estado);
    }

    if (this.filtros.empresa) {
      resultados = resultados.filter(ingreso => ingreso.tecnico.empresa === this.filtros.empresa);
    }

    if (this.filtros.fechaDesde) {
      const fechaDesde = new Date(this.filtros.fechaDesde);
      resultados = resultados.filter(ingreso => new Date(ingreso.fechaIngreso) >= fechaDesde);
    }

    if (this.filtros.fechaHasta) {
      const fechaHasta = new Date(this.filtros.fechaHasta);
      resultados = resultados.filter(ingreso => new Date(ingreso.fechaIngreso) <= fechaHasta);
    }

    this.ingresosFiltrados = resultados;
  }

  limpiarFiltros() {
    this.filtros = {};
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  contarFiltrosActivos(): number {
    let count = 0;
    if (this.filtros.dataCenter) count++;
    if (this.filtros.sala) count++;
    if (this.filtros.tipoTicket) count++;
    if (this.filtros.estado) count++;
    if (this.filtros.empresa) count++;
    if (this.filtros.fechaDesde) count++;
    if (this.filtros.fechaHasta) count++;
    if (this.searchTerm) count++;
    return count;
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

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async cambiarEstado(ingreso: RegistroIngreso, nuevoEstado: EstadoIngreso) {
    const alert = await this.alertController.create({
      header: 'Confirmar cambio de estado',
      message: `¿Desea cambiar el estado a ${nuevoEstado}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            const cambios: Partial<RegistroIngreso> = { estado: nuevoEstado };
            if (nuevoEstado === EstadoIngreso.COMPLETADO) {
              cambios.fechaSalida = new Date();
            }
            this.dataCenterService.updateRegistro(ingreso.id, cambios).subscribe();
          }
        }
      ]
    });

    await alert.present();
  }

  verDetalles(ingreso: RegistroIngreso) {
    this.router.navigate(['/detalles'], { 
      state: { ingreso } 
    });
  }

  editarIngreso(ingreso: RegistroIngreso) {
    this.router.navigate(['/editar'], { 
      state: { ingreso } 
    });
  }

  async eliminarIngreso(ingreso: RegistroIngreso) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Está seguro de que desea eliminar este registro de ingreso?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.dataCenterService.deleteRegistro(ingreso.id).subscribe();
          }
        }
      ]
    });

    await alert.present();
  }

  nuevoIngreso() {
    this.router.navigate(['/agregar']);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  get activeFiltersCount(): number {
    return this.contarFiltrosActivos();
  }

  clearFilters() {
    this.limpiarFiltros();
  }

  applyFilters() {
    this.aplicarFiltros();
  }

  navigateToAgregar() {
    this.nuevoIngreso();
  }

  getEstadoLabel(estado: EstadoIngreso): string {
    const estadoItem = this.estadosIngreso.find(e => e.value === estado);
    return estadoItem ? estadoItem.label : estado;
  }

  getTipoTicketLabel(tipoTicket: TipoTicket): string {
    const tipoItem = this.tiposTicket.find(t => t.value === tipoTicket);
    return tipoItem ? tipoItem.label : tipoTicket;
  }

  viewDetails(ingresoId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const ingreso = this.ingresos.find(i => i.id === ingresoId);
    if (ingreso) {
      this.verDetalles(ingreso);
    }
  }

  editIngreso(ingresoId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const ingreso = this.ingresos.find(i => i.id === ingresoId);
    if (ingreso) {
      this.editarIngreso(ingreso);
    }
  }

  deleteIngreso(ingresoId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const ingreso = this.ingresos.find(i => i.id === ingresoId);
    if (ingreso) {
      this.eliminarIngreso(ingreso);
    }
  }

  marcarEnProceso(ingresoId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const ingreso = this.ingresos.find(i => i.id === ingresoId);
    if (ingreso) {
      this.cambiarEstado(ingreso, EstadoIngreso.EN_PROCESO);
    }
  }

  marcarFinalizado(ingresoId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const ingreso = this.ingresos.find(i => i.id === ingresoId);
    if (ingreso) {
      this.cambiarEstado(ingreso, EstadoIngreso.COMPLETADO);
    }
  }
}
