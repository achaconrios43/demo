// Enumeraciones para el sistema de Data Center
export enum DataCenterType {
  DATA_CENTER_APOQUINDO = 'Data Center Apoquindo',
  DATA_CENTER_SAN_MARTIN = 'Data Center San Martin',
  MC_INDEPENDENCIA = 'MC Independencia',
  MC_CHILOE = 'MC Chiloé',
  MC_LA_FLORIDA = 'MC La Florida',
  MC_PROVIDENCIA = 'MC Providencia',
  MC_MANUEL_MONTT = 'MC Manuel Montt',
  MC_PEDRO_DE_VALDIVIA = 'MC Pedro de Valdivia'
}

export enum TipoTicket {
  CRQ = 'CRQ',
  INC = 'INC',
  VISITA_INSPECTIVA = 'Visita Inspectiva',
  RONDA_TURINARIA = 'Ronda Turinaria'
}

export enum EstadoIngreso {
  PENDIENTE = 'Pendiente',
  EN_PROCESO = 'En Proceso',
  COMPLETADO = 'Completado',
  CANCELADO = 'Cancelado'
}

export enum RolUsuario {
  ADMIN = 'admin',
  SEGURIDAD = 'seguridad',
  TECNICO = 'tecnico'
}

export enum NivelSeguridad {
  BAJO = 'bajo',
  MEDIO = 'medio',
  ALTO = 'alto',
  CRITICO = 'critico'
}

// Interfaces principales
export interface DataCenter {
  id: string;
  nombre: DataCenterType;
  direccion: string;
  ciudad: string;
  telefono: string;
  responsable: string;
  activo: boolean;
  salas: Sala[];
}

export interface Sala {
  id: string;
  nombre: string;
  dataCenterId: string;
  capacidadMaxima: number;
  nivelSeguridad: NivelSeguridad;
  requiereAutorizacionEspecial: boolean;
  activa: boolean;
  equiposCriticos?: string[];
}

export interface Tecnico {
  id: string;
  nombre: string;
  apellido: string;
  rut: string;
  empresa: string;
  telefono: string;
  email: string;
  certificaciones: string[];
  activo: boolean;
  fechaRegistro: Date;
}

export interface RegistroIngreso {
  id: string;
  tecnico: Tecnico;
  dataCenter: DataCenter;
  sala: Sala;
  tipoTicket: TipoTicket;
  numeroTicket: string;
  responsableActividad: string;
  autorizadorIngreso: string;
  fechaIngreso: Date;
  horaIngreso: string;
  fechaSalida?: Date;
  horaSalida?: string;
  proposito: string;
  observaciones?: string;
  estado: EstadoIngreso;
  creadoPor: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  documentosAdjuntos?: string[];
}

export interface Usuario {
  id: string;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  dataCentersAsignados: string[]; // IDs de data centers
  activo: boolean;
  ultimoAcceso?: Date;
  fechaCreacion: Date;
}

// Interfaces para filtros y búsquedas
export interface FiltroIngresos {
  dataCenter?: string;
  sala?: string;
  tipoTicket?: TipoTicket;
  estado?: EstadoIngreso;
  fechaDesde?: Date;
  fechaHasta?: Date;
  empresa?: string;
  tecnico?: string;
  responsable?: string;
  busquedaTexto?: string;
}

// Interfaces para estadísticas del dashboard
export interface EstadisticasDataCenter {
  totalIngresos: number;
  ingresosHoy: number;
  ingresosPendientes: number;
  ingresosEnProceso: number;
  centrosActivos: number;
  salasOcupadas: number;
  distribucioTiposTicket: { [key in TipoTicket]: number };
  distribucionDataCenters: { [key: string]: number };
  ingresosUltimos7Dias: { fecha: string; cantidad: number }[];
  empresasActivas: number;
  tecnicosRegistrados: number;
}

// Interfaces para formularios
export interface FormularioIngreso {
  tecnicoNombre: string;
  tecnicoApellido: string;
  tecnicoRut: string;
  tecnicoEmpresa: string;
  tecnicoTelefono: string;
  tecnicoEmail: string;
  dataCenterId: string;
  salaId: string;
  tipoTicket: TipoTicket;
  numeroTicket: string;
  responsableActividad: string;
  autorizadorIngreso: string;
  proposito: string;
  observaciones?: string;
}

export interface FormularioTecnico {
  nombre: string;
  apellido: string;
  rut: string;
  empresa: string;
  telefono: string;
  email: string;
  certificaciones: string[];
}

// Interfaces para reportes
export interface ReporteActividad {
  periodo: string;
  totalIngresos: number;
  distribuccionPorDataCenter: { [key: string]: number };
  distribuccionPorTipoTicket: { [key in TipoTicket]: number };
  empresasMasActivas: { empresa: string; ingresos: number }[];
  salasMasUtilizadas: { sala: string; dataCenter: string; ingresos: number }[];
  promedioTiempoEstadia: number; // en minutos
}

// Interface para notificaciones
export interface Notificacion {
  id: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  titulo: string;
  mensaje: string;
  fechaCreacion: Date;
  leida: boolean;
  usuarioId: string;
  dataCenterId?: string;
  registroIngresoId?: string;
}