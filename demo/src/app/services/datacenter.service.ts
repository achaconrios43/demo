import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DataCenter,
  DataCenterType,
  Sala,
  Tecnico,
  RegistroIngreso,
  TipoTicket,
  EstadoIngreso,
  NivelSeguridad,
  Usuario,
  RolUsuario,
  FiltroIngresos,
  EstadisticasDataCenter,
  FormularioIngreso
} from '../interfaces/datacenter.interface';

@Injectable({
  providedIn: 'root'
})
export class DataCenterService {
  private readonly STORAGE_KEY = 'datacenter_registros';
  private readonly STORAGE_KEY_DATACENTERS = 'datacenter_locations';
  private readonly STORAGE_KEY_USUARIOS = 'datacenter_usuarios';

  private registrosSubject = new BehaviorSubject<RegistroIngreso[]>([]);
  private dataCentersSubject = new BehaviorSubject<DataCenter[]>([]);
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);

  public registros$ = this.registrosSubject.asObservable();
  public dataCenters$ = this.dataCentersSubject.asObservable();
  public usuarios$ = this.usuariosSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Cargar data centers
    const storedDataCenters = localStorage.getItem(this.STORAGE_KEY_DATACENTERS);
    if (storedDataCenters) {
      this.dataCentersSubject.next(JSON.parse(storedDataCenters));
    } else {
      const defaultDataCenters = this.getDefaultDataCenters();
      this.dataCentersSubject.next(defaultDataCenters);
      localStorage.setItem(this.STORAGE_KEY_DATACENTERS, JSON.stringify(defaultDataCenters));
    }

    // Cargar usuarios
    const storedUsuarios = localStorage.getItem(this.STORAGE_KEY_USUARIOS);
    if (storedUsuarios) {
      this.usuariosSubject.next(JSON.parse(storedUsuarios));
    } else {
      const defaultUsuarios = this.getDefaultUsuarios();
      this.usuariosSubject.next(defaultUsuarios);
      localStorage.setItem(this.STORAGE_KEY_USUARIOS, JSON.stringify(defaultUsuarios));
    }

    // Cargar registros - Sistema limpio sin datos previos
    localStorage.removeItem(this.STORAGE_KEY);
    const storedRegistros = localStorage.getItem(this.STORAGE_KEY);
    if (storedRegistros) {
      const registros = JSON.parse(storedRegistros).map((registro: any) => ({
        ...registro,
        fechaIngreso: new Date(registro.fechaIngreso),
        fechaSalida: registro.fechaSalida ? new Date(registro.fechaSalida) : undefined,
        fechaCreacion: new Date(registro.fechaCreacion),
        fechaActualizacion: registro.fechaActualizacion ? new Date(registro.fechaActualizacion) : undefined
      }));
      this.registrosSubject.next(registros);
    } else {
      const defaultRegistros = this.getDefaultRegistros();
      this.registrosSubject.next(defaultRegistros);
      this.saveRegistros();
    }
  }

  private getDefaultDataCenters(): DataCenter[] {
    return [
      {
        id: '1',
        nombre: DataCenterType.DATA_CENTER_APOQUINDO,
        direccion: 'Av. Apoquindo 4501, Las Condes',
        ciudad: 'Santiago',
        telefono: '+56 2 2345 6789',
        responsable: 'Carlos Mendoza',
        activo: true,
        salas: [
          {
            id: '1-1',
            nombre: 'Sala Principal',
            dataCenterId: '1',
            capacidadMaxima: 50,
            nivelSeguridad: NivelSeguridad.CRITICO,
            requiereAutorizacionEspecial: true,
            activa: true,
            equiposCriticos: ['Servidores Core', 'Storage Principal', 'Switches Backbone']
          },
          {
            id: '1-2',
            nombre: 'Sala UPS',
            dataCenterId: '1',
            capacidadMaxima: 10,
            nivelSeguridad: NivelSeguridad.ALTO,
            requiereAutorizacionEspecial: true,
            activa: true
          },
          {
            id: '1-3',
            nombre: 'Sala Climatización',
            dataCenterId: '1',
            capacidadMaxima: 5,
            nivelSeguridad: NivelSeguridad.MEDIO,
            requiereAutorizacionEspecial: false,
            activa: true
          }
        ]
      },
      {
        id: '2',
        nombre: DataCenterType.DATA_CENTER_SAN_MARTIN,
        direccion: 'San Martín 123, Providencia',
        ciudad: 'Santiago',
        telefono: '+56 2 2345 6790',
        responsable: 'Ana Rodriguez',
        activo: true,
        salas: [
          {
            id: '2-1',
            nombre: 'Sala A',
            dataCenterId: '2',
            capacidadMaxima: 30,
            nivelSeguridad: NivelSeguridad.ALTO,
            requiereAutorizacionEspecial: true,
            activa: true
          },
          {
            id: '2-2',
            nombre: 'Sala B',
            dataCenterId: '2',
            capacidadMaxima: 20,
            nivelSeguridad: NivelSeguridad.MEDIO,
            requiereAutorizacionEspecial: false,
            activa: true
          }
        ]
      },
      {
        id: '3',
        nombre: DataCenterType.MC_INDEPENDENCIA,
        direccion: 'Av. Independencia 456',
        ciudad: 'Santiago',
        telefono: '+56 2 2345 6791',
        responsable: 'Luis Vargas',
        activo: true,
        salas: [
          {
            id: '3-1',
            nombre: 'Sala Equipos',
            dataCenterId: '3',
            capacidadMaxima: 15,
            nivelSeguridad: NivelSeguridad.MEDIO,
            requiereAutorizacionEspecial: false,
            activa: true
          }
        ]
      }
    ];
  }

  private getDefaultUsuarios(): Usuario[] {
    return [
      {
        id: '1',
        username: 'admin',
        nombre: 'Administrador',
        apellido: 'Sistema',
        email: 'admin@datacenter.com',
        rol: RolUsuario.ADMIN,
        dataCentersAsignados: ['1', '2', '3'],
        activo: true,
        fechaCreacion: new Date()
      },
      {
        id: '2',
        username: 'seguridad',
        nombre: 'Personal',
        apellido: 'Seguridad',
        email: 'seguridad@datacenter.com',
        rol: RolUsuario.SEGURIDAD,
        dataCentersAsignados: ['1', '2'],
        activo: true,
        fechaCreacion: new Date()
      }
    ];
  }

  private getDefaultRegistros(): RegistroIngreso[] {
    // Sistema iniciado sin registros previos - base de datos limpia
    return [];
  }

  // CRUD para registros de ingreso
  getRegistros(): Observable<RegistroIngreso[]> {
    return this.registros$;
  }

  getRegistroById(id: string): Observable<RegistroIngreso | undefined> {
    return this.registros$.pipe(
      map(registros => registros.find(registro => registro.id === id))
    );
  }

  createRegistro(formulario: FormularioIngreso): Observable<RegistroIngreso> {
    const dataCenters = this.dataCentersSubject.value;
    const dataCenter = dataCenters.find(dc => dc.id === formulario.dataCenterId);
    const sala = dataCenter?.salas.find(s => s.id === formulario.salaId);

    if (!dataCenter || !sala) {
      throw new Error('Data Center o Sala no encontrados');
    }

    const nuevoTecnico: Tecnico = {
      id: this.generateId(),
      nombre: formulario.tecnicoNombre,
      apellido: formulario.tecnicoApellido,
      rut: formulario.tecnicoRut,
      empresa: formulario.tecnicoEmpresa,
      telefono: formulario.tecnicoTelefono,
      email: formulario.tecnicoEmail,
      certificaciones: [],
      activo: true,
      fechaRegistro: new Date()
    };

    const nuevoRegistro: RegistroIngreso = {
      id: this.generateId(),
      tecnico: nuevoTecnico,
      dataCenter,
      sala,
      tipoTicket: formulario.tipoTicket,
      numeroTicket: formulario.numeroTicket,
      responsableActividad: formulario.responsableActividad,
      autorizadorIngreso: formulario.autorizadorIngreso,
      fechaIngreso: new Date(),
      horaIngreso: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      proposito: formulario.proposito,
      observaciones: formulario.observaciones,
      estado: EstadoIngreso.PENDIENTE,
      creadoPor: 'usuario_actual', // TODO: obtener del contexto de autenticación
      fechaCreacion: new Date()
    };

    const registrosActuales = this.registrosSubject.value;
    const nuevosRegistros = [...registrosActuales, nuevoRegistro];
    this.registrosSubject.next(nuevosRegistros);
    this.saveRegistros();

    return of(nuevoRegistro);
  }

  updateRegistro(id: string, cambios: Partial<RegistroIngreso>): Observable<RegistroIngreso> {
    const registrosActuales = this.registrosSubject.value;
    const index = registrosActuales.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Registro no encontrado');
    }

    const registroActualizado = {
      ...registrosActuales[index],
      ...cambios,
      fechaActualizacion: new Date()
    };

    registrosActuales[index] = registroActualizado;
    this.registrosSubject.next([...registrosActuales]);
    this.saveRegistros();

    return of(registroActualizado);
  }

  deleteRegistro(id: string): Observable<boolean> {
    const registrosActuales = this.registrosSubject.value;
    const nuevosRegistros = registrosActuales.filter(r => r.id !== id);
    
    if (nuevosRegistros.length === registrosActuales.length) {
      return of(false); // No se encontró el registro
    }

    this.registrosSubject.next(nuevosRegistros);
    this.saveRegistros();
    return of(true);
  }

  // Métodos para filtros y búsquedas
  filtrarRegistros(filtros: FiltroIngresos): Observable<RegistroIngreso[]> {
    return this.registros$.pipe(
      map(registros => {
        return registros.filter(registro => {
          if (filtros.dataCenter && registro.dataCenter.id !== filtros.dataCenter) return false;
          if (filtros.sala && registro.sala.id !== filtros.sala) return false;
          if (filtros.tipoTicket && registro.tipoTicket !== filtros.tipoTicket) return false;
          if (filtros.estado && registro.estado !== filtros.estado) return false;
          if (filtros.empresa && !registro.tecnico.empresa.toLowerCase().includes(filtros.empresa.toLowerCase())) return false;
          if (filtros.tecnico && !`${registro.tecnico.nombre} ${registro.tecnico.apellido}`.toLowerCase().includes(filtros.tecnico.toLowerCase())) return false;
          if (filtros.responsable && !registro.responsableActividad.toLowerCase().includes(filtros.responsable.toLowerCase())) return false;
          if (filtros.busquedaTexto) {
            const busqueda = filtros.busquedaTexto.toLowerCase();
            const textoCompleto = `${registro.tecnico.nombre} ${registro.tecnico.apellido} ${registro.tecnico.empresa} ${registro.numeroTicket} ${registro.proposito}`.toLowerCase();
            if (!textoCompleto.includes(busqueda)) return false;
          }
          
          if (filtros.fechaDesde) {
            const fechaRegistro = new Date(registro.fechaIngreso);
            if (fechaRegistro < filtros.fechaDesde) return false;
          }
          
          if (filtros.fechaHasta) {
            const fechaRegistro = new Date(registro.fechaIngreso);
            if (fechaRegistro > filtros.fechaHasta) return false;
          }

          return true;
        });
      })
    );
  }

  // Estadísticas para el dashboard
  getEstadisticas(): Observable<EstadisticasDataCenter> {
    return this.registros$.pipe(
      map(registros => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const ingresosHoy = registros.filter(r => {
          const fechaRegistro = new Date(r.fechaIngreso);
          fechaRegistro.setHours(0, 0, 0, 0);
          return fechaRegistro.getTime() === hoy.getTime();
        }).length;

        const distribucioTiposTicket = registros.reduce((acc, registro) => {
          acc[registro.tipoTicket] = (acc[registro.tipoTicket] || 0) + 1;
          return acc;
        }, {} as { [key in TipoTicket]: number });

        const distribucionDataCenters = registros.reduce((acc, registro) => {
          const nombre = registro.dataCenter.nombre;
          acc[nombre] = (acc[nombre] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        // Ingresos últimos 7 días
        const ingresosUltimos7Dias = [];
        for (let i = 6; i >= 0; i--) {
          const fecha = new Date();
          fecha.setDate(fecha.getDate() - i);
          fecha.setHours(0, 0, 0, 0);
          
          const cantidad = registros.filter(r => {
            const fechaRegistro = new Date(r.fechaIngreso);
            fechaRegistro.setHours(0, 0, 0, 0);
            return fechaRegistro.getTime() === fecha.getTime();
          }).length;

          ingresosUltimos7Dias.push({
            fecha: fecha.toLocaleDateString('es-CL'),
            cantidad
          });
        }

        const dataCenters = this.dataCentersSubject.value;
        const empresasUnicas = new Set(registros.map(r => r.tecnico.empresa));
        const tecnicosUnicos = new Set(registros.map(r => r.tecnico.rut));

        return {
          totalIngresos: registros.length,
          ingresosHoy,
          ingresosPendientes: registros.filter(r => r.estado === EstadoIngreso.PENDIENTE).length,
          ingresosEnProceso: registros.filter(r => r.estado === EstadoIngreso.EN_PROCESO).length,
          centrosActivos: dataCenters.filter(dc => dc.activo).length,
          salasOcupadas: registros.filter(r => r.estado === EstadoIngreso.EN_PROCESO).length,
          distribucioTiposTicket,
          distribucionDataCenters,
          ingresosUltimos7Dias,
          empresasActivas: empresasUnicas.size,
          tecnicosRegistrados: tecnicosUnicos.size
        };
      })
    );
  }

  // Métodos para Data Centers y Salas
  getDataCenters(): Observable<DataCenter[]> {
    return this.dataCenters$;
  }

  getSalasByDataCenter(dataCenterId: string): Observable<Sala[]> {
    return this.dataCenters$.pipe(
      map(dataCenters => {
        const dataCenter = dataCenters.find(dc => dc.id === dataCenterId);
        return dataCenter ? dataCenter.salas : [];
      })
    );
  }

  // Métodos para usuarios y autenticación
  login(username: string, password: string): Observable<Usuario | null> {
    return this.usuarios$.pipe(
      map(usuarios => {
        // Simulación de autenticación básica
        const usuario = usuarios.find(u => u.username === username && u.activo);
        if (usuario && password === 'demo123') {
          usuario.ultimoAcceso = new Date();
          this.saveUsuarios();
          return usuario;
        }
        return null;
      })
    );
  }

  // Método para registrar nuevo ingreso
  registrarIngreso(ingreso: RegistroIngreso): Observable<RegistroIngreso> {
    const registros = this.registrosSubject.value;
    
    // Agregar a la lista
    const nuevosRegistros = [...registros, ingreso];
    this.registrosSubject.next(nuevosRegistros);
    this.saveRegistros();

    return of(ingreso);
  }

  private saveRegistros(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.registrosSubject.value));
  }

  private saveUsuarios(): void {
    localStorage.setItem(this.STORAGE_KEY_USUARIOS, JSON.stringify(this.usuariosSubject.value));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}