# Sistema de Control de Acceso a Data Center

🏢 **Sistema Ionic/Angular** para gestión y control de acceso de técnicos a centros de datos.

## 📋 Descripción

Este proyecto es una aplicación web desarrollada con **Ionic 8.0** y **Angular 20.0** que permite gestionar el acceso de técnicos a centros de datos de manera segura y controlada. El sistema registra ingresos, permite seguimiento en tiempo real y mantiene un historial completo de actividades.

## 🚀 Tecnologías Utilizadas

- **Ionic 8.0.0** - Framework híbrido para aplicaciones móviles y web
- **Angular 20.0.0** - Framework web con arquitectura de componentes standalone
- **TypeScript** - Lenguaje tipado basado en JavaScript
- **RxJS** - Programación reactiva con Observables
- **Ionicons** - Librería de iconos optimizada para Ionic
- **LocalStorage** - Persistencia de datos local del navegador

## 🎯 Funcionalidades Principales

### 🔐 Sistema de Autenticación
- Login seguro con roles diferenciados
- Gestión de sesiones de usuario
- Control de acceso por niveles de autorización

### 📊 Dashboard Central
- Estadísticas en tiempo real de ingresos
- Resumen de centros de datos activos
- Tickets pendientes y completados
- Accesos rápidos a funcionalidades principales

### 👥 Gestión de Ingresos de Técnicos
- Registro completo de técnicos visitantes
- Validación automática de RUT chileno
- Seguimiento de actividades realizadas
- Control de tiempos de entrada y salida

### 🏢 Administración de Data Centers
- Gestión de múltiples centros de datos
- Control de salas por ubicación
- Asignación de técnicos por área

## 📱 Páginas del Sistema

### 🏠 **Dashboard (Home)**
**Archivo:** `src/app/home/`
- **Función:** Página principal del sistema con resumen ejecutivo
- **Características:**
  - Estadísticas de ingresos del día
  - Resumen de tickets por estado
  - Accesos rápidos a registrar nuevo ingreso
  - Vista general de data centers activos
  - Gráficos de actividad reciente

### 🔑 **Login**
**Archivo:** `src/app/pages/login/`
- **Función:** Autenticación y acceso al sistema
- **Características:**
  - Formulario de login con validación
  - Gestión de roles de usuario (admin, seguridad, técnico)
  - Recordar sesión
  - Validación de credenciales
  - Redirección automática según rol

### ➕ **Registro de Ingreso (Agregar)**
**Archivo:** `src/app/pages/agregar/`
- **Función:** Registrar nuevo ingreso de técnico al data center
- **Características:**
  - **Información del técnico:**
    - Nombre completo
    - RUT con validación automática
    - Empresa de origen
    - Datos de contacto
  - **Detalles del ingreso:**
    - Selección de data center
    - Sala específica (Conmutación, Mainframe, CPD2, CPD1, CrossConnect, GSM)
    - Tipo de ticket (CRQ, INC, Visita Técnica)
    - Número de ticket
    - Responsable de actividad
    - Autorizador del ingreso
    - Propósito de la visita
    - Observaciones adicionales
  - **Validaciones:**
    - RUT chileno con dígito verificador
    - Campos obligatorios
    - Formato de datos
  - **Automatización:**
    - Fecha y hora automática de registro
    - Generación de ID único
    - Estado inicial: "Pendiente"

### 📋 **Lista de Ingresos (Listar)**
**Archivo:** `src/app/pages/listar/`
- **Función:** Visualizar y gestionar todos los registros de ingreso
- **Características:**
  - **Vista de tabla responsiva** con información clave
  - **Filtros avanzados:**
    - Por data center
    - Por sala
    - Por tipo de ticket
    - Por estado de ingreso
    - Por rango de fechas
    - Por empresa
  - **Búsqueda en tiempo real** por múltiples campos
  - **Acciones rápidas:**
    - Ver detalles completos
    - Editar registro
    - Cambiar estado
  - **Información mostrada:**
    - Técnico y empresa
    - Data center y sala
    - Ticket y responsable
    - Estado actual
    - Fecha de ingreso

### 🔍 **Detalles de Ingreso (Detalles)**
**Archivo:** `src/app/pages/detalles/`
- **Función:** Vista completa y detallada de un registro específico
- **Características:**
  - **Información completa del técnico:**
    - Datos personales
    - Empresa y contacto
    - Historial de visitas
  - **Detalles del ingreso:**
    - Data center y ubicación específica
    - Información del ticket
    - Responsables y autorizaciones
    - Tiempos de entrada/salida
    - Propósito y observaciones
  - **Historial de cambios:**
    - Registro de modificaciones
    - Cambios de estado
    - Usuarios que realizaron cambios
  - **Acciones disponibles:**
    - Editar información
    - Cambiar estado
    - Registrar salida
    - Agregar observaciones

### ✏️ **Edición de Registros (Editar)**
**Archivo:** `src/app/pages/editar/`
- **Función:** Modificar información de registros existentes
- **Características:**
  - **Formulario pre-poblado** con datos actuales
  - **Validaciones completas:**
    - RUT chileno
    - Campos obligatorios
    - Consistencia de datos
  - **Campos editables:**
    - Información del técnico
    - Detalles del ticket
    - Responsables
    - Estado del ingreso
    - Observaciones
  - **Control de cambios:**
    - Registro de modificaciones
    - Fecha de actualización
    - Usuario que realizó el cambio
  - **Confirmaciones:**
    - Validación antes de guardar
    - Mensajes de éxito/error
    - Navegación automática

## 🏗️ Arquitectura del Sistema

### 📁 Estructura de Archivos
```
src/
├── app/
│   ├── interfaces/          # Definiciones TypeScript
│   │   └── datacenter.interface.ts
│   ├── services/            # Servicios y lógica de negocio
│   │   └── datacenter.service.ts
│   ├── home/               # Dashboard principal
│   ├── pages/              # Páginas del sistema
│   │   ├── login/          # Autenticación
│   │   ├── agregar/        # Registro de ingresos
│   │   ├── listar/         # Lista de registros
│   │   ├── detalles/       # Vista detallada
│   │   └── editar/         # Edición de registros
│   └── app.routes.ts       # Configuración de rutas
```

### 🔧 Componentes Clave

#### **DataCenterService**
- **Ubicación:** `src/app/services/datacenter.service.ts`
- **Función:** Servicio principal para gestión de datos
- **Responsabilidades:**
  - CRUD de registros de ingreso
  - Gestión de data centers y salas
  - Autenticación de usuarios
  - Persistencia en LocalStorage
  - Validaciones de negocio

#### **Interfaces TypeScript**
- **Ubicación:** `src/app/interfaces/datacenter.interface.ts`
- **Definiciones:**
  - `RegistroIngreso` - Estructura de registros de acceso
  - `DataCenter` - Información de centros de datos
  - `Tecnico` - Datos de técnicos visitantes
  - `Usuario` - Información de usuarios del sistema
  - `TipoTicket` - Enumeración de tipos de tickets
  - `EstadoIngreso` - Estados posibles de registros

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Ionic CLI (`npm install -g @ionic/cli`)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd demo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   ionic serve
   ```

4. **Compilar para producción**
   ```bash
   npm run build
   ```

## 🎮 Uso del Sistema

### 1. **Acceso al Sistema**
- Navegar a la URL de la aplicación
- Ingresar credenciales en la página de login
- El sistema redirige al dashboard según el rol

### 2. **Registrar Nuevo Ingreso**
- Desde el dashboard, hacer clic en "Registrar Ingreso"
- Completar el formulario con información del técnico
- Seleccionar data center y sala de destino
- Proporcionar detalles del ticket y responsables
- El sistema genera automáticamente fecha/hora de ingreso

### 3. **Gestionar Registros**
- Acceder a "Lista de Ingresos" para ver todos los registros
- Usar filtros para encontrar registros específicos
- Hacer clic en cualquier registro para ver detalles completos
- Editar información según sea necesario

### 4. **Seguimiento y Control**
- Monitorear estados de ingresos desde el dashboard
- Actualizar estados conforme avanza el trabajo
- Registrar salidas y observaciones finales

## 🔐 Seguridad y Validaciones

### **Validación de RUT**
- Algoritmo estándar de validación chilena
- Verificación de dígito verificador
- Formato automático con puntos y guión

### **Control de Acceso**
- Autenticación requerida para todas las funciones
- Roles diferenciados con permisos específicos
- Sesiones seguras con timeout automático

### **Validación de Datos**
- Campos obligatorios claramente marcados
- Validación en tiempo real de formularios
- Mensajes de error descriptivos
- Prevención de datos inconsistentes

## 📊 Estados del Sistema

### **Estados de Registro**
- **Pendiente** - Ingreso registrado, esperando acceso
- **En Proceso** - Técnico trabajando en data center
- **Completado** - Trabajo finalizado y técnico retirado
- **Cancelado** - Ingreso cancelado por algún motivo

### **Tipos de Ticket**
- **CRQ** - Change Request (Solicitud de Cambio)
- **INC** - Incident (Incidente)
- **VISITA_INSPECTIVA** - Visita Técnica de Inspección
- **RONDA_TURINARIA** - Ronda de Mantenimiento

### **Salas Disponibles**
- **Conmutación** - Equipos de red y telecomunicaciones
- **Mainframe** - Servidores principales
- **CPD2** - Centro de Procesamiento de Datos 2
- **CPD1** - Centro de Procesamiento de Datos 1
- **CrossConnect** - Interconexiones de red
- **GSM** - Equipos de comunicaciones móviles

## 🚀 Características Avanzadas

### **Responsive Design**
- Adaptable a dispositivos móviles y desktop
- Interfaz optimizada para tablets
- Navegación táctil intuitiva

### **Persistencia de Datos**
- Almacenamiento local con LocalStorage
- Sincronización automática
- Respaldo de datos en tiempo real

### **Experiencia de Usuario**
- Formularios intuitivos con validación en tiempo real
- Navegación fluida entre páginas
- Feedback visual inmediato
- Iconografía consistente

### **Escalabilidad**
- Arquitectura modular y extensible
- Componentes reutilizables
- Servicios desacoplados
- Fácil integración con APIs externas

## 🛠️ Mantenimiento y Soporte

### **Actualizaciones**
- Actualizar dependencias regularmente
- Seguir versiones LTS de Angular e Ionic
- Revisar y actualizar validaciones

### **Respaldos**
- Los datos se almacenan localmente
- Implementar respaldos periódicos
- Considerar migración a base de datos externa

### **Monitoreo**
- Revisar logs de la aplicación
- Monitorear rendimiento
- Validar funcionalidad en diferentes navegadores

## 📞 Contacto y Soporte

Para soporte técnico o consultas sobre el sistema:
- Revisar documentación técnica en el código
- Consultar comentarios en servicios y componentes
- Verificar logs del navegador para debugging

---

## 📄 Licencia

Este proyecto es desarrollado como parte de un sistema de gestión empresarial. Todos los derechos reservados.

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025  
**Compatibilidad:** Ionic 8.0+ | Angular 20.0+ | TypeScript 5.0+