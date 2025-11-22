/**
 * Importaciones de Angular Core
 * - Component: Decorador para definir componentes de Angular
 * - OnInit: Interface del ciclo de vida que se ejecuta al inicializar el componente
 * - OnDestroy: Interface del ciclo de vida que se ejecuta al destruir el componente
 * - inject: Función para inyección de dependencias
 */
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
/** CommonModule: Módulo que proporciona directivas comunes como *ngIf, *ngFor */
import { CommonModule } from '@angular/common';
/** Router: Servicio para la navegación entre rutas de la aplicación */
import { Router } from '@angular/router';
/** Subject: Observable que permite emitir valores múltiples y completarse manualmente */
import { Subject } from 'rxjs';
/** takeUntil: Operador RxJS que cancela suscripciones cuando el observable fuente emite */
import { takeUntil } from 'rxjs/operators';
/**
 * Componentes standalone de Ionic
 * Importados individualmente para optimizar el bundle size
 */
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel
} from '@ionic/angular/standalone';
/** addIcons: Función para registrar iconos de Ionicons en el componente */
import { addIcons } from 'ionicons';
/**
 * Iconos de Ionicons utilizados en la interfaz
 * Versión 'outline' para mantener consistencia visual
 */
import {
  serverOutline,
  businessOutline,
  peopleOutline,
  documentTextOutline,
  timeOutline,
  checkmarkCircleOutline,
  warningOutline,
  addCircleOutline,
  listOutline,
  barChartOutline,
  shieldCheckmarkOutline,
  keyOutline,
  exitOutline,
  refreshOutline,
  personCircleOutline,
  todayOutline,
  hourglassOutline,
  personAddOutline,
  analyticsOutline,
  settingsOutline,
  locationOutline,
  logOutOutline,
  chevronForwardOutline,
  searchOutline,
  cameraOutline
} from 'ionicons/icons';
/** DataCenterService: Servicio para operaciones CRUD de Data Centers */
import { DataCenterService } from '../services/datacenter.service';
/** Interfaces del dominio de Data Centers */
import { EstadisticasDataCenter, TipoTicket, EstadoIngreso, DataCenter } from '../interfaces/datacenter.interface';

/**
 * HomePage - Componente principal del dashboard de Data Center
 * 
 * Proporciona una vista general del sistema con:
 * - Estadísticas en tiempo real de ingresos y tickets
 * - Información del usuario autenticado
 * - Navegación rápida a las diferentes secciones
 * - Gráficos y métricas del Data Center actual
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel
  ]
})
export class HomePage implements OnInit, OnDestroy {
  /**
   * @property {Subject<void>} destroy$ - Subject para manejar la cancelación de suscripciones
   * Se utiliza con el operador takeUntil para evitar memory leaks
   */
  private destroy$ = new Subject<void>();
  
  /**
   * @property {Router} router - Servicio de enrutamiento inyectado
   * Permite la navegación programática entre páginas
   */
  private router = inject(Router);
  
  /**
   * @property {DataCenterService} dataCenterService - Servicio de datos inyectado
   * Proporciona acceso a las operaciones del Data Center
   */
  private dataCenterService = inject(DataCenterService);

  /**
   * @property {EstadisticasDataCenter | null} estadisticas - Estadísticas del dashboard
   * Contiene métricas agregadas de ingresos, tickets y estados
   */
  estadisticas: EstadisticasDataCenter | null = null;
  
  /**
   * @property {any} usuarioActual - Información del usuario autenticado
   * Cargado desde sessionStorage al inicializar el componente
   */
  usuarioActual: any = null;
  
  /**
   * @property {DataCenter | null} dataCenterActual - Data Center seleccionado/actual
   * Contiene la información detallada del Data Center en uso
   */
  dataCenterActual: DataCenter | null = null;
  
  /**
   * @property {any[]} tipoTicketStats - Estadísticas por tipo de ticket
   * Array con contadores y porcentajes de cada tipo (CRQ, INC, etc.)
   */
  tipoTicketStats: any[] = [];
  
  /**
   * @property {boolean} isLoading - Indicador de carga de datos
   * Se utiliza para mostrar spinners durante las peticiones
   */
  isLoading = false;

  /**
   * @property {typeof Object} Object - Referencia a Object para uso en template
   * Permite usar Object.keys() directamente en el HTML
   */
  Object = Object;

  /**
   * @property {Date} currentDate - Fecha actual para mostrar en el template
   * Se inicializa con la fecha actual del sistema
   */
  currentDate = new Date();

  /**
   * Constructor del componente
   * Registra todos los iconos necesarios para la interfaz
   */
  constructor() {
    // Registrar todos los iconos de Ionicons que se usarán en el template
    addIcons({
      serverOutline,
      businessOutline,
      peopleOutline,
      documentTextOutline,
      timeOutline,
      checkmarkCircleOutline,
      warningOutline,
      addCircleOutline,
      listOutline,
      barChartOutline,
      shieldCheckmarkOutline,
      keyOutline,
      exitOutline,
      refreshOutline,
      personCircleOutline,
      todayOutline,
      hourglassOutline,
      personAddOutline,
      analyticsOutline,
      settingsOutline,
      locationOutline,
      logOutOutline,
      chevronForwardOutline,
      searchOutline,
      cameraOutline
    });
  }

  /**
   * Hook del ciclo de vida OnInit
   * Se ejecuta después de que Angular inicializa las propiedades del componente
   * Carga todos los datos necesarios para el dashboard
   */
  ngOnInit() {
    this.loadUserData();           // Cargar información del usuario desde sessionStorage
    this.loadEstadisticas();       // Obtener estadísticas del servidor
    this.loadDataCenterInfo();     // Cargar información del Data Center actual
    this.loadTipoTicketStats();    // Generar estadísticas por tipo de ticket
  }

  ircamara(){
   console.log('Navegando a cámara');
    this.router.navigate(['/testcamara']);
  }
  /**
   * Hook del ciclo de vida OnDestroy
   * Se ejecuta antes de que Angular destruya el componente
   * Cancela todas las suscripciones activas para prevenir memory leaks
   */
  ngOnDestroy() {
    this.destroy$.next();      // Emitir señal de destrucción
    this.destroy$.complete();  // Completar el Subject
  }

  /**
   * Carga los datos del usuario autenticado desde sessionStorage
   * @private
   * @function loadUserData
   * @returns {void}
   * 
   * Busca la clave 'datacenter_current_user' en sessionStorage
   * y parsea el JSON almacenado para obtener los datos del usuario
   */
  private loadUserData(): void {
    const userData = sessionStorage.getItem('datacenter_current_user');
    if (userData) {
      this.usuarioActual = JSON.parse(userData);
    }
  }

  /**
   * Carga las estadísticas del Data Center desde el servidor
   * @private
   * @async
   * @function loadEstadisticas
   * @returns {void}
   * 
   * Utiliza el DataCenterService para obtener métricas agregadas
   * Actualiza el estado de carga (isLoading) durante la petición
   * La suscripción se cancela automáticamente al destruir el componente (takeUntil)
   */
  private loadEstadisticas(): void {
    this.isLoading = true;
    this.dataCenterService.getEstadisticas()
      .pipe(takeUntil(this.destroy$))  // Cancelar suscripción al destruir componente
      .subscribe({
        next: (stats) => {
          this.estadisticas = stats;  // Asignar estadísticas recibidas
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Navega a una ruta específica de la aplicación
   * @public
   * @function navigateTo
   * @param {string} route - Ruta destino sin la barra inicial (ej: 'listar', 'agregar')
   * @returns {void}
   * 
   * Utiliza el Router de Angular para navegación programática
   * Añade automáticamente la barra inicial a la ruta
   */
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  /**
   * Obtiene el color Ionic asociado a cada tipo de ticket
   * @public
   * @function getTipoTicketColor
   * @param {TipoTicket | string} tipo - Enum o string del tipo de ticket
   * @returns {string} - Color Ionic ('primary', 'danger', 'warning', 'success', 'medium')
   * 
   * Mapeo de colores:
   * - CRQ: 'primary' (azul) - Cambios de requerimiento
   * - INC: 'danger' (rojo) - Incidentes
   * - VISITA_INSPECTIVA: 'warning' (amarillo) - Visitas de inspección
   * - RONDA_TURINARIA: 'success' (verde) - Rondas de turno
   */
  getTipoTicketColor(tipo: TipoTicket | string): string {
    const colors: { [key: string]: string } = {
      [TipoTicket.CRQ]: 'primary',
      [TipoTicket.INC]: 'danger',
      [TipoTicket.VISITA_INSPECTIVA]: 'warning',
      [TipoTicket.RONDA_TURINARIA]: 'success'
    };
    return colors[tipo] || 'medium';  // Color por defecto si no hay coincidencia
  }

  /**
   * Obtiene el icono asociado a cada tipo de ticket
   * @public
   * @function getTipoTicketIcon
   * @param {TipoTicket | string} tipo - Enum o string del tipo de ticket
   * @returns {string} - Nombre del icono de Ionicons
   * 
   * Mapeo de iconos:
   * - CRQ: 'document-text-outline' - Documentos de cambio
   * - INC: 'warning-outline' - Alertas de incidentes
   * - VISITA_INSPECTIVA: 'search-outline' - Búsqueda/inspección
   * - RONDA_TURINARIA: 'time-outline' - Reloj para rondas
   */
  getTipoTicketIcon(tipo: TipoTicket | string): string {
    const icons: { [key: string]: string } = {
      [TipoTicket.CRQ]: 'document-text-outline',
      [TipoTicket.INC]: 'warning-outline',
      [TipoTicket.VISITA_INSPECTIVA]: 'search-outline',
      [TipoTicket.RONDA_TURINARIA]: 'time-outline'
    };
    return icons[tipo] || 'document-outline';  // Icono por defecto
  }

  /**
   * Convierte el nombre completo del Data Center a su abreviación
   * @public
   * @function getDataCenterAbrev
   * @param {string} nombre - Nombre completo del Data Center
   * @returns {string} - Abreviación del Data Center
   * 
   * Utiliza un diccionario predefinido de abreviaciones
   * Si no encuentra coincidencia, devuelve los primeros 6 caracteres
   */
  getDataCenterAbrev(nombre: string): string {
    const abreviaciones: { [key: string]: string } = {
      'Data Center Apoquindo': 'DC-APO',
      'Data Center San Martin': 'DC-SM',
      'MC Independencia': 'MC-IND',
      'MC Chiloé': 'MC-CHI',
      'MC La Florida': 'MC-LF',
      'MC Providencia': 'MC-PRO',
      'MC Manuel Montt': 'MC-MM',
      'MC Pedro de Valdivia': 'MC-PDV'
    };
    return abreviaciones[nombre] || nombre.substring(0, 6);
  }

  /**
   * Cierra la sesión del usuario actual
   * @public
   * @async
   * @function logout
   * @returns {Promise<void>}
   * 
   * Acciones realizadas:
   * 1. Elimina datos de usuario de sessionStorage
   * 2. Elimina flag de autenticación de localStorage
   * 3. Redirige a la página de login
   */
  async logout(): Promise<void> {
    sessionStorage.removeItem('datacenter_current_user');  // Limpiar usuario actual
    localStorage.removeItem('datacenter_logged_in');       // Limpiar estado de login
    await this.router.navigate(['/login']);                // Navegar a login
  }

  /**
   * Obtiene el saludo apropiado según la hora del día
   * @public
   * @function getGreeting
   * @returns {string} - Saludo contextual ('Buenos días', 'Buenas tardes', 'Buenas noches')
   * 
   * Rangos horarios:
   * - 00:00 - 11:59: 'Buenos días'
   * - 12:00 - 17:59: 'Buenas tardes'
   * - 18:00 - 23:59: 'Buenas noches'
   */
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  /**
   * Convierte el código de rol a su nombre legible
   * @public
   * @function getRoleDisplayName
   * @param {string} role - Código del rol ('admin', 'seguridad', 'tecnico')
   * @returns {string} - Nombre legible del rol
   * 
   * Mapeo de roles:
   * - 'admin': 'Administrador'
   * - 'seguridad': 'Personal de Seguridad'
   * - 'tecnico': 'Técnico'
   */
  getRoleDisplayName(role: string): string {
    const roles: { [key: string]: string } = {
      'admin': 'Administrador',
      'seguridad': 'Personal de Seguridad',
      'tecnico': 'Técnico'
    };
    return roles[role] || role;  // Devolver el código si no hay coincidencia
  }

  /**
   * Carga la información del Data Center actual
   * @private
   * @async
   * @function loadDataCenterInfo
   * @returns {void}
   * 
   * Obtiene la lista de Data Centers y selecciona el primero como actual
   * TODO: Implementar selección de Data Center específico según usuario/contexto
   */
  private loadDataCenterInfo(): void {
    // Obtener información del Data Center actual (primer data center como ejemplo)
    this.dataCenterService.getDataCenters()
      .pipe(takeUntil(this.destroy$))  // Cancelar suscripción al destruir componente
      .subscribe({
        next: (dataCenters) => {
          if (dataCenters.length > 0) {
            this.dataCenterActual = dataCenters[0]; // Por ahora usar el primero
          }
        },
        error: (error) => {
          console.error('Error al cargar información del Data Center:', error);
        }
      });
  }

  /**
   * Genera estadísticas por tipo de ticket
   * @private
   * @function loadTipoTicketStats
   * @returns {void}
   * 
   * Crea un array con datos estadísticos de cada tipo de ticket:
   * - tipo: Nombre del tipo de ticket
   * - cantidad: Número de tickets de ese tipo
   * - porcentaje: Porcentaje relativo al total
   * 
   * TODO: Obtener estos datos desde el servidor en lugar de hardcodearlos
   */
  private loadTipoTicketStats(): void {
    // Generar estadísticas por tipo de ticket
    this.tipoTicketStats = [
      { tipo: 'CRQ', cantidad: 15, porcentaje: 40 },
      { tipo: 'INC', cantidad: 10, porcentaje: 27 },
      { tipo: 'Visita Inspectiva', cantidad: 8, porcentaje: 22 },
      { tipo: 'Ronda Turinaria', cantidad: 4, porcentaje: 11 }
    ];
  }

  /**
   * Genera un reporte de accesos del Data Center
   * @public
   * @function generarReporte
   * @returns {void}
   * 
   * TODO: Implementar generación de reportes
   * Debe crear un documento (PDF/Excel) con el historial de accesos
   */
  generarReporte(): void {
    // TODO: Implementar generación de reportes
    console.log('Generar reporte de accesos');
  }

  /**
   * Abre el panel de configuración de la aplicación
   * @public
   * @function abrirConfiguracion
   * @returns {void}
   * 
   * TODO: Implementar panel de configuración
   * Debe permitir ajustar preferencias del usuario y parámetros del sistema
   */
  abrirConfiguracion(): void {
    // TODO: Implementar configuración
    console.log('Abrir configuración');
  }

  /**
   * Maneja el evento de pull-to-refresh
   * @public
   * @async
   * @function handleRefresh
   * @param {any} event - Evento del refresher de Ionic
   * @returns {Promise<void>}
   * 
   * Recarga todos los datos del dashboard:
   * - Estadísticas generales
   * - Información del Data Center
   * - Estadísticas por tipo de ticket
   * Completa el refresher cuando todas las operaciones terminan
   */
  async handleRefresh(event: any): Promise<void> {
    console.log('Refrescando datos del dashboard...');
    
    try {
      // Recargar todos los datos
      await Promise.all([
        this.loadEstadisticas(),
        this.loadDataCenterInfo(),
        this.loadTipoTicketStats()
      ]);
      
      console.log('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al refrescar datos:', error);
    } finally {
      // Completar el refresher
      event.target.complete();
    }
  }
}
