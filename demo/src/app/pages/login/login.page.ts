import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonSpinner,
  IonText,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  business, 
  person, 
  lockClosed, 
  eye, 
  eyeOff, 
  serverOutline,
  shieldCheckmarkOutline,
  businessOutline 
} from 'ionicons/icons';
import { DataCenterService } from '../../services/datacenter.service';
import { Usuario } from '../../interfaces/datacenter.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonInput, 
    IonItem, 
    IonLabel, 
    IonIcon, 
    IonSpinner,
    IonText,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private dataCenterService: DataCenterService
  ) {
    addIcons({ 
      business, 
      person, 
      lockClosed, 
      eye, 
      eyeOff, 
      serverOutline,
      shieldCheckmarkOutline,
      businessOutline 
    });
    
    this.loginForm = this.formBuilder.group({
      usuario: ['admin', [Validators.required]],
      password: ['demo123', [Validators.required]]
    });
  }

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { usuario, password } = this.loginForm.value;

      const loading = await this.loadingController.create({
        message: 'Verificando credenciales...',
        spinner: 'crescent'
      });
      await loading.present();

      this.dataCenterService.login(usuario, password).subscribe({
        next: async (user: Usuario | null) => {
          await loading.dismiss();
          this.isLoading = false;

          if (user) {
            // Guardar información de usuario
            sessionStorage.setItem('datacenter_current_user', JSON.stringify(user));
            localStorage.setItem('datacenter_logged_in', 'true');

            const toast = await this.toastController.create({
              message: `¡Bienvenido al Sistema de Control de Acceso Data Center, ${user.nombre}!`,
              duration: 3000,
              color: 'success',
              position: 'top'
            });
            await toast.present();

            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Usuario o contraseña incorrectos';
            
            const toast = await this.toastController.create({
              message: 'Credenciales incorrectas. Verifique usuario y contraseña.',
              duration: 3000,
              color: 'danger',
              position: 'top'
            });
            await toast.present();
          }
        },
        error: async (error) => {
          await loading.dismiss();
          this.isLoading = false;
          console.error('Error en login:', error);
          
          const toast = await this.toastController.create({
            message: 'Error al conectar con el servidor. Intente nuevamente.',
            duration: 3000,
            color: 'danger',
            position: 'top'
          });
          await toast.present();
        }
      });
    }
  }

  async loginAsDemo(role: 'admin' | 'seguridad') {
    const credentials = {
      admin: { usuario: 'admin', password: 'demo123' },
      seguridad: { usuario: 'seguridad', password: 'demo123' }
    };

    this.loginForm.patchValue(credentials[role]);
    await this.onSubmit();
  }
}
