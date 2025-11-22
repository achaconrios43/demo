import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  IonCardSubtitle, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonTextarea, 
  IonSelect, 
  IonSelectOption,
  IonSpinner,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, person, personCircle, card, business, layers, documentText, ticket, clipboard, save, close, arrowBack } from 'ionicons/icons';
import { DataCenterService } from '../../services/datacenter.service';
import { RegistroIngreso, DataCenter, TipoTicket, EstadoIngreso } from '../../interfaces/datacenter.interface';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, 
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem, IonLabel, 
    IonInput, IonTextarea, IonSelect, IonSelectOption, IonSpinner, CommonModule, ReactiveFormsModule
  ]
})
export class EditarPage implements OnInit {
  registroForm!: FormGroup;
  registro?: RegistroIngreso;
  registroId: string = '';
  dataCenters: DataCenter[] = [];
  isLoading = false;
  isSubmitting = false;

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
    { value: TipoTicket.VISITA_INSPECTIVA, label: 'Visita Inspectiva' },
    { value: TipoTicket.RONDA_TURINARIA, label: 'Ronda Turinaria' }
  ];

  estadosRegistro = [
    { value: EstadoIngreso.PENDIENTE, label: 'Pendiente' },
    { value: EstadoIngreso.EN_PROCESO, label: 'En Proceso' },
    { value: EstadoIngreso.COMPLETADO, label: 'Completado' },
    { value: EstadoIngreso.CANCELADO, label: 'Cancelado' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataCenterService: DataCenterService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    addIcons({ create, person, personCircle, card, business, layers, documentText, ticket, clipboard, save, close, arrowBack });
    this.initializeForm();
  }

  ngOnInit() {
    this.loadData();
  }

  private initializeForm() {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      rut: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dataCenter: ['', [Validators.required]],
      sala: ['', [Validators.required]],
      tipoTicket: ['', [Validators.required]],
      numeroTicket: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      autorizador: ['', [Validators.required]],
      proposito: ['', [Validators.required]],
      observaciones: [''],
      estado: ['', [Validators.required]]
    });
  }

  async loadData() {
    this.isLoading = true;
    try {
      this.dataCenters = await this.dataCenterService.getDataCenters().toPromise() || [];
      this.registroId = this.route.snapshot.paramMap.get('id') || '';
      
      if (this.registroId) {
        const registros = await this.dataCenterService.getRegistros().toPromise() || [];
        this.registro = registros.find(r => r.id === this.registroId);
        
        if (this.registro) {
          this.populateForm();
        } else {
          this.showToast('No se encontró el registro', 'danger');
          this.router.navigate(['/listar']);
        }
      }
    } catch (error) {
      this.showToast('Error al cargar los datos', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  populateForm() {
    if (this.registro) {
      this.registroForm.patchValue({
        nombre: this.registro.tecnico.nombre,
        apellido: this.registro.tecnico.apellido,
        rut: this.registro.tecnico.rut,
        empresa: this.registro.tecnico.empresa,
        telefono: this.registro.tecnico.telefono,
        email: this.registro.tecnico.email,
        dataCenter: this.registro.dataCenter.id,
        sala: this.registro.sala.nombre,
        tipoTicket: this.registro.tipoTicket,
        numeroTicket: this.registro.numeroTicket,
        responsable: this.registro.responsableActividad,
        autorizador: this.registro.autorizadorIngreso,
        proposito: this.registro.proposito,
        observaciones: this.registro.observaciones || '',
        estado: this.registro.estado
      });
    }
  }

  async onSubmit() {
    if (this.registroForm.valid && this.registro) {
      this.isSubmitting = true;
      
      const loading = await this.loadingController.create({ message: 'Actualizando registro...' });
      await loading.present();

      try {
        const formData = this.registroForm.value;
        const dataCenterSeleccionado = this.dataCenters.find(dc => dc.id === formData.dataCenter);
        const salaSeleccionada = dataCenterSeleccionado?.salas.find(s => s.nombre === formData.sala);

        const changes: Partial<RegistroIngreso> = {
          tecnico: { ...this.registro.tecnico, ...formData },
          dataCenter: dataCenterSeleccionado || this.registro.dataCenter,
          sala: salaSeleccionada || this.registro.sala,
          tipoTicket: formData.tipoTicket,
          numeroTicket: formData.numeroTicket,
          responsableActividad: formData.responsable,
          autorizadorIngreso: formData.autorizador,
          proposito: formData.proposito,
          observaciones: formData.observaciones,
          estado: formData.estado,
          fechaActualizacion: new Date()
        };

        await this.dataCenterService.updateRegistro(this.registro.id, changes).toPromise();
        this.showToast('Registro actualizado exitosamente', 'success');
        this.router.navigate(['/listar']);

      } catch (error) {
        this.showToast('Error al actualizar el registro', 'danger');
      } finally {
        this.isSubmitting = false;
        loading.dismiss();
      }
    } else {
      this.showToast('Por favor, complete todos los campos requeridos', 'warning');
    }
  }

  onDataCenterChange() {
    // Este método puede filtrar las salas según el data center seleccionado
    // Por ahora mantiene todas las salas disponibles
  }

  cancelar() {
    this.router.navigate(['/listar']);
  }

  cancel() {
    this.router.navigate(['/listar']);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({ message, duration: 3000, color, position: 'top' });
    toast.present();
  }
}
