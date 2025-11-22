# 📱 Sistema de Control de Acceso - Data Center

Aplicación móvil/web desarrollada con **Ionic 8** + **Angular 20** + **Capacitor** para gestión de acceso a centros de datos con captura de fotos y geolocalización.

---

## 🚀 Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Ionic** | 8.7.9 | Framework UI híbrido |
| **Angular** | 20.3.12 | Framework web |
| **Capacitor** | 7.4.3 | Acceso a APIs nativas |
| **TypeScript** | 5.x | Lenguaje tipado |
| **RxJS** | 7.x | Programación reactiva |

### 📦 Plugins Capacitor
- **@capacitor/camera** `7.4.3` - Captura de fotos y galería
- **@capacitor/geolocation** `7.4.3` - GPS y coordenadas
- **@capacitor/preferences** `7.4.3` - Almacenamiento local persistente

---

## 📁 Estructura del Proyecto

```
src/app/
├── home/                          # Dashboard principal
│   ├── home.page.ts              # Lógica del dashboard
│   ├── home.page.html            # Interfaz dashboard
│   └── home.page.scss            # Estilos
│
├── pages/                         # Páginas de la aplicación
│   ├── testcamara/               # Módulo de cámara
│   │   ├── testcamara.page.ts   # Captura y gestión de fotos
│   │   ├── testcamara.page.html # UI de cámara
│   │   └── testcamara.page.scss
│   │
│   ├── testgeo/                  # Módulo GPS
│   │   ├── testgeo.page.ts      # Geolocalización
│   │   ├── testgeo.page.html    # UI GPS
│   │   └── testgeo.page.scss
│   │
│   ├── login/                    # Autenticación
│   ├── agregar/                  # Registro de ingresos
│   ├── listar/                   # Lista de registros
│   ├── detalles/                 # Vista detallada
│   └── editar/                   # Edición de registros
│
├── services/                      # Servicios
│   ├── datacenter.service.ts     # CRUD Data Center
│   └── fotcamara-storage.services.ts  # Almacenamiento fotos
│
├── interfaces/                    # Definiciones TypeScript
│   └── datacenter.interface.ts   # Interfaces del dominio
│
├── app.routes.ts                 # Configuración de rutas
└── app.component.ts              # Componente raíz
```

---

## 🎯 Funcionalidades Principales

### 📷 **Test Cámara** (`/testcamara`)

**Captura y gestión de fotografías con almacenamiento persistente**

#### Características:
- ✅ Tomar foto con cámara del dispositivo (nativa en móvil, modal en web)
- ✅ Seleccionar imágenes desde galería
- ✅ Almacenamiento local con Capacitor Preferences
- ✅ Lista de todas las fotos guardadas con *ngFor
- ✅ Eliminar fotos individuales o todas
- ✅ Previsualización de imagen actual
- ✅ Logs en consola de todas las operaciones

#### Tecnología:
```typescript
// Capacitor Camera para captura
Camera.getPhoto({
  quality: 90,
  allowEditing: false,
  resultType: CameraResultType.DataUrl,
  source: CameraSource.Camera // o CameraSource.Photos
});

// Almacenamiento con Preferences
await Preferences.set({
  key: 'fotocamara_usuario',
  value: JSON.stringify(fotoscamara)
});
```

#### Estructura de datos:
```typescript
interface Fotocamara {
  id: string;                 // Timestamp único
  nombre: string;             // Ej: "camara_1732211234567.jpeg"
  rutaArchivo: string;        // webPath del plugin
  fechaCaptura: string;       // ISO 8601
  base64Data: string;         // Data URL para mostrar imagen
}
```

---

### 📍 **Test GPS** (`/testgeo`)

**Geolocalización en tiempo real con integración a Google Maps**

#### Características:
- ✅ Obtener coordenadas GPS actuales
- ✅ Mostrar latitud, longitud, precisión y timestamp
- ✅ Formato de coordenadas: Grados, Minutos, Segundos (DMS)
- ✅ Enlace directo a Google Maps
- ✅ Compatible con web (solicita permisos del navegador)
- ✅ Manejo de errores y permisos

#### Tecnología:
```typescript
// Geolocalización con alta precisión
const coordinates = await Geolocation.getCurrentPosition({
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
});

// Formato DMS
const lat = coordinates.coords.latitude;
const lng = coordinates.coords.longitude;
```

#### Compatibilidad web:
- El método `requestPermissions()` está envuelto en try-catch
- En web lanza "Not implemented", pero sigue funcionando
- El navegador solicita permisos automáticamente

---

### 🏠 **Dashboard** (`/home`)

**Panel principal con estadísticas y navegación rápida**

#### Características:
- ✅ Estadísticas en tiempo real de Data Center
- ✅ Pull-to-refresh para actualizar datos
- ✅ Navegación rápida a todas las secciones
- ✅ Acceso directo a Test Cámara y Test GPS
- ✅ Información de ingresos pendientes y completados
- ✅ Distribución por tipo de ticket
- ✅ Grid responsive adaptable a móvil/tablet/desktop

#### Tarjetas de navegación:
- 📝 Registrar nuevo ingreso → `/agregar`
- 📋 Ver lista de ingresos → `/listar`
- 📷 Test Cámara → `/testcamara`
- 📍 Test GPS → `/testgeo`
- 🔑 Login → `/login`

---

### 🔐 **Sistema Data Center** (Login, Agregar, Listar, Detalles, Editar)

**Gestión completa de ingresos de técnicos a centros de datos**

#### Flujo de trabajo:
1. **Login** → Autenticación con roles (admin, seguridad, técnico)
2. **Agregar** → Registro de nuevo ingreso de técnico
3. **Listar** → Vista de tabla con filtros avanzados
4. **Detalles** → Información completa de un registro
5. **Editar** → Modificación de registros existentes

#### Validaciones:
- ✅ RUT chileno con dígito verificador
- ✅ Campos obligatorios
- ✅ Formato de email
- ✅ Validación de fechas

#### Estados de ingreso:
- 🟡 **PENDIENTE** - Esperando acceso
- 🔵 **EN_PROCESO** - Técnico trabajando
- 🟢 **COMPLETADO** - Trabajo finalizado
- 🔴 **CANCELADO** - Ingreso cancelado

#### Tipos de ticket:
- **CRQ** - Change Request
- **INC** - Incident
- **VISITA_INSPECTIVA** - Visita Técnica
- **RONDA_TURINARIA** - Ronda de Mantenimiento

---

## 🛠️ Instalación

### Prerrequisitos
```bash
node --version  # v18+
npm --version   # v9+
ionic --version # v7+
```

### Pasos

1. **Clonar repositorio**
```bash
git clone <url-repositorio>
cd demo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
ionic serve
# Abre en http://localhost:8100
```

4. **Build para producción**
```bash
npm run build
```

5. **Sincronizar Capacitor** (para móvil)
```bash
npx cap sync
npx cap open android  # o ios
```

---

## 📱 Ejecución en Dispositivos

### Web (PWA)
```bash
ionic serve
```
- Cámara: Modal simulado con PWA Elements
- GPS: API del navegador (solicita permisos)

### Android
```bash
ionic build
npx cap sync android
npx cap open android
```
- Cámara: API nativa de Android
- GPS: Servicios de ubicación de Google

### iOS
```bash
ionic build
npx cap sync ios
npx cap open ios
```
- Requiere Xcode
- Cámara: API nativa de iOS
- GPS: Core Location Framework

---

## 🔧 Servicios Principales

### 📸 **FotocamaraStorageService**

Servicio para persistencia de fotos con Capacitor Preferences

```typescript
// Guardar fotos
await guardarFotocamara(usuario: string, fotocamara: Fotocamara[]): Promise<void>

// Obtener fotos
await obtenerFotocamara(usuario: string): Promise<Fotocamara[]>

// Eliminar todas las fotos
await eliminarFotocamaras(usuario: string): Promise<void>
```

### 🏢 **DataCenterService**

Servicio para CRUD de registros de ingreso

```typescript
// Obtener todos los registros
getRegistros(): Observable<RegistroIngreso[]>

// Crear nuevo registro
createRegistro(registro: RegistroIngreso): Observable<RegistroIngreso>

// Actualizar registro
updateRegistro(id: string, changes: Partial<RegistroIngreso>): Observable<RegistroIngreso>

// Eliminar registro
deleteRegistro(id: string): Observable<void>

// Obtener estadísticas
getEstadisticas(): Observable<EstadisticasDataCenter>
```

---

## 🎨 Interfaz de Usuario

### Componentes Ionic utilizados:
- `ion-card` - Tarjetas de contenido
- `ion-button` - Botones con iconos
- `ion-icon` - Iconografía Ionicons
- `ion-grid/ion-row/ion-col` - Sistema de grilla
- `ion-chip` - Badges y etiquetas
- `ion-refresher` - Pull-to-refresh

### Diseño responsive:
```html
<ion-grid>
  <ion-row>
    <!-- Móvil: 12 cols | Tablet: 6 cols | Desktop: 4 cols -->
    <ion-col size="12" size-md="6" size-lg="4">
      <ion-card>...</ion-card>
    </ion-col>
  </ion-row>
</ion-grid>
```

---

## 📊 Consola de Logs

Todas las acciones importantes se registran en consola:

### Test Cámara:
```
📂 Fotos cargadas al iniciar la página: 3
📸 Foto tomada y guardada:
   Total de fotos: 4
   Todas las fotos guardadas: [Array]
🗑️ Foto eliminada: camara_1732211234567.jpeg
   Total de fotos restantes: 3
```

### Test GPS:
```
📍 Ubicación obtenida:
   Latitud: -33.4489° S
   Longitud: -70.6693° W
   Precisión: ±10 metros
```

---

## 🚨 Manejo de Errores

### Cámara:
- Usuario cancela: No muestra alerta, solo log
- Sin permisos: Muestra mensaje en consola
- Timeout: Reinicia estado del botón automáticamente

### GPS:
- Sin permisos: Try-catch silencioso en web
- Servicio desactivado: Mensaje al usuario
- Timeout: Error después de 10 segundos

---

## 🔐 Almacenamiento de Datos

### LocalStorage (via Capacitor Preferences):
- **Key pattern**: `fotocamara_{usuario}`
- **Format**: JSON stringificado
- **Persistencia**: Sobrevive a reinicios de app
- **Límite**: ~5-10 MB (depende del navegador)

### Estructura almacenada:
```json
{
  "fotocamara_usuario": "[{id:'...',nombre:'...',base64Data:'...'}]"
}
```

---

## 📝 Rutas de la Aplicación

```typescript
/ → /login                    # Redirección por defecto
/login                        # Autenticación
/home                         # Dashboard principal
/agregar                      # Nuevo registro
/listar                       # Lista registros
/detalles/:id                 # Vista detallada
/editar/:id                   # Edición
/testcamara                   # Test de cámara
/testgeo                      # Test GPS
```

---

## 🧪 Testing

Archivos de pruebas `.spec.ts` eliminados para optimizar el proyecto.

Para testing manual:
1. Probar captura de fotos en web y móvil
2. Verificar permisos de GPS
3. Validar almacenamiento persistente
4. Comprobar navegación entre páginas
5. Revisar logs en consola del navegador/device

---

## 🐛 Debugging

### Ver logs en dispositivo:

**Android:**
```bash
npx cap run android -l --external
adb logcat | grep Capacitor
```

**iOS:**
```bash
npx cap run ios -l --external
# Ver logs en Xcode Console
```

**Web:**
```
F12 → Console
```

---

## 📦 Dependencias Principales

```json
{
  "@ionic/angular": "^8.7.9",
  "@angular/core": "^20.3.12",
  "@capacitor/core": "^7.4.3",
  "@capacitor/camera": "^7.4.3",
  "@capacitor/geolocation": "^7.4.3",
  "@capacitor/preferences": "^7.4.3",
  "rxjs": "^7.8.1",
  "ionicons": "^7.4.0"
}
```

---

## 🚀 Próximas Mejoras

- [ ] Subida de fotos a servidor
- [ ] Sincronización en la nube
- [ ] Modo offline completo
- [ ] Compresión de imágenes
- [ ] Filtros de fotos
- [ ] Exportar datos a PDF
- [ ] Notificaciones push
- [ ] Biometría (huella/Face ID)

---

## 📄 Licencia

Proyecto educativo - Todos los derechos reservados

---

## 👨‍💻 Información del Proyecto

**Versión**: 1.0.0  
**Fecha**: Noviembre 2025  
**Plataformas**: Web, Android, iOS  
**Estado**: ✅ Producción
