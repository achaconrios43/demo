import { Routes } from '@angular/router';

/**
 * Configuración de rutas principales de la aplicación
 * Define todas las rutas disponibles y sus componentes correspondientes
 * Utiliza lazy loading para optimizar la carga de la aplicación
 * 
 * @constant routes - Array de objetos Route que define las rutas de navegación
 */
export const routes: Routes = [
  
  /**
   * Ruta de login/autenticación
   * @route /login
   * @component LoginPage
   * @description Página de inicio de sesión para autenticar usuarios
   */
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  
  /**
   * Ruta principal/dashboard
   * @route /home
   * @component HomePage  
   * @description Página principal que muestra el dashboard del usuario
   */
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  
  /**
   * Ruta para agregar nuevos registros
   * @route /agregar
   * @component AgregarPage
   * @description Formulario para crear nuevos ingresos de técnicos
   */
  {
    path: 'agregar',
    loadComponent: () => import('./pages/agregar/agregar.page').then( m => m.AgregarPage)
  },
  
  /**
   * Ruta para listar registros existentes
   * @route /listar
   * @component ListarPage
   * @description Lista todos los registros de ingresos con opciones de filtrado
   */
  {
    path: 'listar',
    loadComponent: () => import('./pages/listar/listar.page').then( m => m.ListarPage)
  },
  
  /**
   * Ruta para ver detalles de un registro específico
   * @route /detalles/:id
   * @param {string} id - Identificador único del registro a mostrar
   * @component DetallesPage
   * @description Muestra información completa de un registro específico
   */
  {
    path: 'detalles/:id',
    loadComponent: () => import('./pages/detalles/detalles.page').then( m => m.DetallesPage)
  },
  
  /**
   * Ruta para editar un registro existente
   * @route /editar/:id
   * @param {string} id - Identificador único del registro a editar
   * @component EditarPage
   * @description Formulario de edición para modificar registros existentes
   */
  {
    path: 'editar/:id',
    loadComponent: () => import('./pages/editar/editar.page').then( m => m.EditarPage)
  },
  
  /**
   * Ruta por defecto - Redirección
   * @route '' (ruta vacía)
   * @redirectTo login
   * @description Redirige automáticamente a la página de login cuando no se especifica ruta
   * pathMatch: 'full' asegura que solo coincida con la ruta exactamente vacía
   */
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  
  /**
   * Ruta de prueba para funcionalidad de cámara
   * @route /testcamara
   * @component TestcamaraPage
   * @description Página de prueba para captura de fotos y selección de galería
   * @features
   * - Tomar fotos con la cámara del dispositivo
   * - Seleccionar imágenes desde la galería
   * - Mostrar imagen capturada/seleccionada
   * - Limpiar imagen actual
   */
  {
    path: 'testcamara',
    loadComponent: () => import('./pages/testcamara/testcamara.page').then( m => m.TestcamaraPage)
  },
  
  /**
   * Ruta de prueba para funcionalidad de geolocalización
   * @route /testgeo  
   * @component TestgeoPage
   * @description Página de prueba para obtener ubicación GPS del dispositivo
   * @features
   * - Solicitar permisos de ubicación
   * - Obtener coordenadas GPS actuales
   * - Mostrar latitud, longitud, precisión y timestamp
   * - Abrir ubicación en Google Maps
   * - Formatear coordenadas para visualización
   */
  {
    path: 'testgeo',
    loadComponent: () => import('./pages/testgeo/testgeo.page').then( m => m.TestgeoPage)
  }
];
