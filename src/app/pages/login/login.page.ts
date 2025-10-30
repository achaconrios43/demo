import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  loading = false;
  showPassword = false;

  constructor(private toastCtrl: ToastController) { }

  ngOnInit() {
    this.loadSaved();
  }

  loadSaved() {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        this.username = u.username || '';
        this.email = u.email || '';
        // don't prefill password for security, but you may if desired
      }
    } catch (e) {
      // ignore
    }
  }

  async save() {
    const user = { username: this.username, email: this.email, password: this.password };
    try {
      localStorage.setItem('user', JSON.stringify(user));
      await this.presentToast('Datos guardados/actualizados');
      // clear password field after saving for safety
      this.password = '';
    } catch (e) {
      await this.presentToast('Error al guardar');
    }
  }

  async login() {
    if (!this.email || !this.password) {
      await this.presentToast('Ingresa email y contraseña');
      return;
    }
    this.loading = true;
    // simulate async auth
    setTimeout(async () => {
      this.loading = false;
      try {
        const raw = localStorage.getItem('user');
        const saved = raw ? JSON.parse(raw) : null;
        if (saved && saved.email === this.email && saved.password === this.password) {
          await this.presentToast('Inicio de sesión correcto');
        } else {
          await this.presentToast('Credenciales inválidas');
        }
      } catch (e) {
        await this.presentToast('Error al iniciar sesión');
      }
    }, 900);
  }

  private async presentToast(message: string) {
    const t = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    await t.present();
  }

}
