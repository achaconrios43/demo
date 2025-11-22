import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonTextarea, 
  IonSelect, 
  IonSelectOption, 
  IonButton, 
  IonButtons, 
  IonBackButton, 
  IonIcon, 
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personAdd, 
  person, 
  card, 
  business, 
  construct, 
  layers, 
  documentText, 
  clipboard, 
  personCircle, 
  shieldCheckmark, 
  chatbubbleEllipses, 
  close, 
  save 
} from 'ionicons/icons';
import { DataCenterService } from '../../services/datacenter.service';
import { 
  TipoTicket, 
  EstadoIngreso,
  RegistroIngreso,
  DataCenter,
  Tecnico
} from '../../interfaces/datacenter.interface';

// Interfaz temporal para el formulario
interface FormularioIngresoTecnico {
  nombreCompleto: string;
  rut: string;
  empresa: string;
  actividad: string;
  sala: string;
  numeroTicket: string;
  tipoTicket: TipoTicket;
  responsable: string;
  autorizador: string;
  observaciones: string;
}

// Validador personalizado para RUT chileno
function rutValidator(control: any) {
  const rut = control.value;
  if (!rut) return null;
  
  // Remover puntos y guión para validar
  const rutLimpio = rut.replace(/\./g, '').replace('-', '');
  if (rutLimpio.length < 8) return { rutInvalido: true };
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toLowerCase();
  
  // Validar que el cuerpo sea numérico
  if (!/^\d+$/.test(cuerpo)) return { rutInvalido: true };
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  let dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'k' : dvCalculado.toString();
  
  return dv === dvEsperado ? null : { rutInvalido: true };
}

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonTextarea, 
    IonSelect, 
    IonSelectOption, 
    IonButton, 
    IonButtons, 
    IonBackButton, 
    IonIcon, 
    IonSpinner,
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class AgregarPage implements OnInit {
  ingresoForm: FormGroup;
  isLoading = false;

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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataCenterService: DataCenterService,
    private toastController: ToastController
  ) {
    addIcons({ 
      personAdd, 
      person, 
      card, 
      business, 
      construct, 
      layers,
      documentText, 
      clipboard, 
      personCircle, 
      shieldCheckmark, 
      chatbubbleEllipses, 
      close, 
      save 
    });

    this.ingresoForm = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      rut: ['', [Validators.required, rutValidator]],
      empresa: ['', [Validators.required]],
      actividad: ['', [Validators.required]],
      sala: ['', [Validators.required]],
      numeroTicket: ['', [Validators.required]],
      tipoTicket: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      autorizador: ['', [Validators.required]],
      observaciones: ['']
    });
  }

  ngOnInit() {
    // Verificar autenticación del Data Center
    const isLoggedIn = localStorage.getItem('datacenter_logged_in');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  async onSubmit() {
    if (this.ingresoForm.valid) {
      this.isLoading = true;

      try {
        const formData = this.ingresoForm.value as FormularioIngresoTecnico;
        
        // Obtener data centers para encontrar el primero disponible
        this.dataCenterService.getDataCenters().subscribe(dataCenters => {
          if (dataCenters.length > 0) {
            const dataCenter = dataCenters[0]; // Por ahora usar el primer data center
            const sala = dataCenter.salas.find(s => s.nombre === formData.sala);
            
            if (sala) {
              // Crear técnico
              const tecnico: Tecnico = {
                id: Date.now().toString(),
                nombre: formData.nombreCompleto.split(' ')[0],
                apellido: formData.nombreCompleto.split(' ').slice(1).join(' '),
                rut: formData.rut,
                empresa: formData.empresa,
                telefono: '',
                email: '',
                certificaciones: [],
                activo: true,
                fechaRegistro: new Date()
              };

              // Crear registro de ingreso
              const nuevoIngreso: RegistroIngreso = {
                id: Date.now().toString(),
                tecnico: tecnico,
                dataCenter: dataCenter,
                sala: sala,
                tipoTicket: formData.tipoTicket,
                numeroTicket: formData.numeroTicket,
                responsableActividad: formData.responsable,
                autorizadorIngreso: formData.autorizador,
                fechaIngreso: new Date(), // Fecha y hora automática al momento de crear el registro
                horaIngreso: new Date().toLocaleTimeString('es-CL'), // Hora automática actual
                proposito: formData.actividad,
                observaciones: formData.observaciones,
                estado: EstadoIngreso.PENDIENTE,
                creadoPor: 'usuario_actual', // En producción sería del usuario logueado
                fechaCreacion: new Date()
              };

              // Guardar usando el servicio
              this.dataCenterService.registrarIngreso(nuevoIngreso).subscribe({
                next: async () => {
                  const toast = await this.toastController.create({
                    message: 'Ingreso registrado exitosamente',
                    duration: 2000,
                    color: 'success',
                    position: 'top'
                  });
                  toast.present();
                  this.router.navigate(['/listar']);
                },
                error: async (error) => {
                  console.error('Error al registrar ingreso:', error);
                  const toast = await this.toastController.create({
                    message: 'Error al registrar el ingreso',
                    duration: 3000,
                    color: 'danger',
                    position: 'top'
                  });
                  toast.present();
                }
              });
            }
          }
        });
      } catch (error) {
        console.error('Error al procesar formulario:', error);
        const toast = await this.toastController.create({
          message: 'Error al procesar el formulario',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        toast.present();
      } finally {
        this.isLoading = false;
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.ingresoForm.controls).forEach(key => {
        this.ingresoForm.get(key)?.markAsTouched();
      });

      const toast = await this.toastController.create({
        message: 'Por favor complete todos los campos requeridos',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      toast.present();
    }
  }

  cancelar() {
    this.router.navigate(['/home']);
  }
}
