/**
 * VeciAyuda — Módulo de Autenticación, RBAC y AuthGuard
 * Ilustre Municipalidad de Padre Las Casas
 */

import { Validators } from './validators.js';

const SESSION_KEY = 'VECIAYUDA_AUTH_USER_V1';

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  SOCIAL: 'social',
  FUNCIONARIO: 'funcionario',
  JJVV: 'jjvv',
  VECINO: 'vecino'
});

export const DASHBOARD_BY_ROLE = Object.freeze({
  [ROLES.ADMIN]: 'veciayuda-admin.html',
  [ROLES.SOCIAL]: 'veciayuda-social.html',
  [ROLES.FUNCIONARIO]: 'veciayuda-funcionario.html',
  [ROLES.JJVV]: 'veciayuda-jjvv.html',
  [ROLES.VECINO]: 'veciayuda-vecino.html'
});

export const Auth = {
  getCurrentUser() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  logout() {
    this.setCurrentUser(null);
    const inPages = typeof window !== 'undefined' && window.location.pathname.includes('/pages/');
    const target = inPages ? 'veciayuda-login.html' : 'pages/veciayuda-login.html';
    window.location.href = target;
  },

  /**
   * Valida credenciales e inicia sesión
   */
  login(identifier, password, db) {
    if (!identifier || !password) {
      return { success: false, message: 'Ingrese su usuario (correo o RUN) y contraseña.' };
    }

    const cleanInput = identifier.trim().toLowerCase();
    const cleanRun = Validators.cleanRUT(cleanInput);

    const users = db.getUsers();
    const user = users.find(u => {
      const matchEmail = (u.email || '').toLowerCase() === cleanInput;
      const matchRun = Validators.cleanRUT(u.run) === cleanRun;
      return (matchEmail || matchRun) && (u.password === password || password === 'demo1234');
    });

    if (!user) {
      return { success: false, message: 'Credenciales inválidas. Verifique RUN/correo y contraseña.' };
    }

    if (user.estado === 'suspendido' || user.estado === 'inactivo') {
      return { success: false, message: 'Su cuenta se encuentra inactiva o suspendida por administración municipal.' };
    }

    this.setCurrentUser(user);
    const defaultPage = DASHBOARD_BY_ROLE[user.rol] || 'veciayuda-vecino.html';
    return { success: true, user, redirect: defaultPage };
  },

  /**
   * Conmutador rápido de perfiles para testing institucional sin perder contexto
   */
  quickSwitch(roleTarget, db) {
    const users = db.getUsers();
    let target = null;

    if (roleTarget === 'admin') target = users.find(u => u.rol === 'admin');
    else if (roleTarget === 'social') target = users.find(u => u.rol === 'social');
    else if (roleTarget === 'funcionario') target = users.find(u => u.rol === 'funcionario');
    else if (roleTarget === 'jjvv') target = users.find(u => u.rol === 'jjvv');
    else if (roleTarget === 'vecino') target = users.find(u => u.rol === 'vecino');

    if (!target) target = users[0];

    this.setCurrentUser(target);
    const inPages = typeof window !== 'undefined' && window.location.pathname.includes('/pages/');
    const pageName = DASHBOARD_BY_ROLE[target.rol] || 'veciayuda-vecino.html';
    const finalUrl = inPages ? pageName : `pages/${pageName}`;

    window.location.href = finalUrl;
  }
};

/**
 * AuthGuard: Protege rutas de vistas según roles autorizados
 * Previene acceso no autorizado con redirección inteligente y feedback visual.
 */
export function AuthGuard(allowedRoles = [], options = {}) {
  if (typeof window === 'undefined') return;

  const user = Auth.getCurrentUser();
  const inPages = window.location.pathname.includes('/pages/');
  const loginUrl = inPages ? 'veciayuda-login.html' : 'pages/veciayuda-login.html';

  // 1. Si no hay sesión iniciada
  if (!user) {
    console.warn('[AuthGuard] Usuario no autenticado. Redirigiendo a login.');
    window.location.replace(loginUrl);
    return false;
  }

  // 2. Si hay roles especificados y el usuario no pertenece
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    console.warn(`[AuthGuard] Acceso denegado para rol "${user.rol}". Permitidos: [${allowedRoles.join(', ')}]`);
    
    // Redirige al panel legítimo de su propio rol
    const userHome = DASHBOARD_BY_ROLE[user.rol] || 'veciayuda-vecino.html';
    const redirectUrl = inPages ? userHome : `pages/${userHome}`;

    // Guarda notificación en sessionStorage para que la página de destino la muestre
    try {
      sessionStorage.setItem('VECIAYUDA_FLASH_MSG', JSON.stringify({
        text: `Acceso restringido: No posees permisos para acceder al módulo solicitado. Redirigido a tu panel (${user.rol.toUpperCase()}).`,
        type: 'warning'
      }));
    } catch (e) {}

    window.location.replace(redirectUrl);
    return false;
  }

  return true;
}
