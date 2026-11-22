/**
 * VeciAyuda — Orquestador Central y Punto de Entrada
 * Ilustre Municipalidad de Padre Las Casas
 * 
 * Expone la arquitectura modular ES6 y garantiza compatibilidad global (window)
 * para transicionar gradualmente todas las vistas sin roturas.
 */

import { Validators } from './modules/validators.js';
import { VeciStorage } from './modules/storage.js';
import { StateMachine, ESTADOS_SOLICITUD, ESTADOS_META } from './modules/state-machine.js';
import { Database } from './modules/db.js';
import { Auth, AuthGuard, ROLES, DASHBOARD_BY_ROLE } from './modules/auth.js';
import { VeciPDF } from './modules/pdf.js';
import { VeciUI, initVeciAyudaTesterBar } from './modules/ui.js';

// Exportación como módulos ES6
export {
  Validators,
  VeciStorage,
  StateMachine,
  ESTADOS_SOLICITUD,
  ESTADOS_META,
  Database,
  Auth,
  AuthGuard,
  ROLES,
  DASHBOARD_BY_ROLE,
  VeciPDF,
  VeciUI,
  initVeciAyudaTesterBar
};

// Exposición en ámbito global (window) para compatibilidad total
if (typeof window !== 'undefined') {
  window.Validators = Validators;
  window.VeciValidators = Validators;
  window.VeciStorage = VeciStorage;
  window.StateMachine = StateMachine;
  window.ESTADOS_SOLICITUD = ESTADOS_SOLICITUD;
  window.ESTADOS_META = ESTADOS_META;
  window.VeciDB = Database;
  window.VeciAuth = Auth;
  window.AuthGuard = AuthGuard;
  window.VeciPDF = VeciPDF;
  window.VeciUI = VeciUI;
  window.initVeciAyudaTesterBar = initVeciAyudaTesterBar;

  // Inicialización de componentes al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostrar mensaje flash si hubo redirección por AuthGuard
    try {
      const flash = sessionStorage.getItem('VECIAYUDA_FLASH_MSG');
      if (flash) {
        sessionStorage.removeItem('VECIAYUDA_FLASH_MSG');
        const parsed = JSON.parse(flash);
        setTimeout(() => {
          if (VeciUI && typeof VeciUI.toast === 'function') {
            VeciUI.toast(parsed.text, parsed.type || 'info');
          }
        }, 300);
      }
    } catch (e) {}

    // 2. Inicializar barra flotante de tester
    if (typeof initVeciAyudaTesterBar === 'function') {
      initVeciAyudaTesterBar();
    }
  });
}
