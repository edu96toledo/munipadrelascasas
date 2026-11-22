/**
 * VeciAyuda — Máquina de Estados y Auditoría Inmutable
 * Ilustre Municipalidad de Padre Las Casas
 */

export const ESTADOS_SOLICITUD = Object.freeze({
  INGRESADA: 'ingresada',
  EN_REVISION_JJVV: 'en_revision_jjvv',
  OBSERVADA: 'observada',
  DERIVADA_DIDECO: 'derivada_dideco',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada'
});

export const ESTADOS_META = Object.freeze({
  [ESTADOS_SOLICITUD.INGRESADA]: {
    label: 'Ingresada',
    badgeClass: 'badge-pending',
    color: '#00D4E8',
    icon: '📥',
    descripcion: 'Solicitud ciudadana ingresada al sistema municipal'
  },
  [ESTADOS_SOLICITUD.EN_REVISION_JJVV]: {
    label: 'En Revisión JJVV',
    badgeClass: 'badge-process',
    color: '#3B7BF8',
    icon: '🏘️',
    descripcion: 'En evaluación de residencia por directiva de la Junta de Vecinos'
  },
  [ESTADOS_SOLICITUD.OBSERVADA]: {
    label: 'Observada',
    badgeClass: 'badge-warning',
    color: '#F59E0B',
    icon: '⚠️',
    descripcion: 'Requiere subsanación o actualización de documentos por el solicitante'
  },
  [ESTADOS_SOLICITUD.DERIVADA_DIDECO]: {
    label: 'Derivada a DIDECO',
    badgeClass: 'badge-social',
    color: '#EC4899',
    icon: '🤝',
    descripcion: 'Derivada a Trabajo Social DIDECO para informe sociohabitacional'
  },
  [ESTADOS_SOLICITUD.APROBADA]: {
    label: 'Aprobada',
    badgeClass: 'badge-resolved',
    color: '#10B981',
    icon: '✅',
    descripcion: 'Certificado de Residencia emitido legalmente con Folio y QR'
  },
  [ESTADOS_SOLICITUD.RECHAZADA]: {
    label: 'Rechazada',
    badgeClass: 'badge-rejected',
    color: '#EF4444',
    icon: '❌',
    descripcion: 'Solicitud rechazada con motivo técnico o territorial fundado'
  }
});

// Matriz de Transiciones Permitidas por Rol
const TRANSICIONES_POR_ROL = {
  vecino: {
    [ESTADOS_SOLICITUD.OBSERVADA]: [ESTADOS_SOLICITUD.EN_REVISION_JJVV]
  },
  jjvv: {
    [ESTADOS_SOLICITUD.EN_REVISION_JJVV]: [
      ESTADOS_SOLICITUD.APROBADA,
      ESTADOS_SOLICITUD.RECHAZADA,
      ESTADOS_SOLICITUD.OBSERVADA,
      ESTADOS_SOLICITUD.DERIVADA_DIDECO
    ]
  },
  funcionario: {
    [ESTADOS_SOLICITUD.INGRESADA]: [
      ESTADOS_SOLICITUD.EN_REVISION_JJVV,
      ESTADOS_SOLICITUD.DERIVADA_DIDECO,
      ESTADOS_SOLICITUD.APROBADA,
      ESTADOS_SOLICITUD.RECHAZADA,
      ESTADOS_SOLICITUD.OBSERVADA
    ],
    [ESTADOS_SOLICITUD.EN_REVISION_JJVV]: [
      ESTADOS_SOLICITUD.DERIVADA_DIDECO,
      ESTADOS_SOLICITUD.APROBADA,
      ESTADOS_SOLICITUD.RECHAZADA
    ],
    [ESTADOS_SOLICITUD.OBSERVADA]: [
      ESTADOS_SOLICITUD.EN_REVISION_JJVV
    ]
  },
  social: {
    [ESTADOS_SOLICITUD.DERIVADA_DIDECO]: [
      ESTADOS_SOLICITUD.APROBADA,
      ESTADOS_SOLICITUD.RECHAZADA,
      ESTADOS_SOLICITUD.OBSERVADA
    ]
  },
  admin: {
    // El administrador tiene facultades para gestionar cualquier estado
    [ESTADOS_SOLICITUD.INGRESADA]: Object.values(ESTADOS_SOLICITUD),
    [ESTADOS_SOLICITUD.EN_REVISION_JJVV]: Object.values(ESTADOS_SOLICITUD),
    [ESTADOS_SOLICITUD.OBSERVADA]: Object.values(ESTADOS_SOLICITUD),
    [ESTADOS_SOLICITUD.DERIVADA_DIDECO]: Object.values(ESTADOS_SOLICITUD),
    [ESTADOS_SOLICITUD.APROBADA]: [ESTADOS_SOLICITUD.OBSERVADA, ESTADOS_SOLICITUD.RECHAZADA],
    [ESTADOS_SOLICITUD.RECHAZADA]: [ESTADOS_SOLICITUD.EN_REVISION_JJVV, ESTADOS_SOLICITUD.DERIVADA_DIDECO]
  }
};

export const StateMachine = {
  /**
   * Normaliza el estado para compatibilidad hacia atrás
   */
  normalizeEstado(estado) {
    if (!estado) return ESTADOS_SOLICITUD.INGRESADA;
    const s = String(estado).toLowerCase().trim();
    if (s === 'pendiente' || s === 'ingresada') return ESTADOS_SOLICITUD.INGRESADA;
    if (s === 'en_revision' || s === 'en_revision_jjvv') return ESTADOS_SOLICITUD.EN_REVISION_JJVV;
    if (s === 'observada' || s === 'corregir') return ESTADOS_SOLICITUD.OBSERVADA;
    if (s === 'derivada' || s === 'derivada_dideco' || s === 'social') return ESTADOS_SOLICITUD.DERIVADA_DIDECO;
    if (s === 'aprobado' || s === 'aprobada') return ESTADOS_SOLICITUD.APROBADA;
    if (s === 'rechazado' || s === 'rechazada') return ESTADOS_SOLICITUD.RECHAZADA;
    return ESTADOS_SOLICITUD.INGRESADA;
  },

  /**
   * Verifica si un rol puede ejecutar la transición solicitada
   */
  canTransition(estadoActual, nuevoEstado, userRole) {
    const rol = (userRole || 'vecino').toLowerCase();
    const actual = this.normalizeEstado(estadoActual);
    const destino = this.normalizeEstado(nuevoEstado);

    if (actual === destino) return true;

    const matrix = TRANSICIONES_POR_ROL[rol] || {};
    const permitidos = matrix[actual] || [];
    return permitidos.includes(destino);
  },

  /**
   * Ejecuta la transición de estado e inyecta un registro inmutable de auditoría
   */
  transition(solicitud, nuevoEstado, actor, motivo = '') {
    const estadoActual = this.normalizeEstado(solicitud.estado);
    const estadoDestino = this.normalizeEstado(nuevoEstado);
    const rol = actor ? actor.rol : 'sistema';

    if (!this.canTransition(estadoActual, estadoDestino, rol)) {
      throw new Error(`Permiso denegado: El rol "${rol}" no puede transicionar de "${estadoActual}" a "${estadoDestino}".`);
    }

    const now = new Date();
    const registroAuditoria = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now.toISOString(),
      fecha: now.toLocaleDateString('es-CL'),
      hora: now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      estadoAnterior: estadoActual,
      estadoNuevo: estadoDestino,
      actorId: actor ? actor.id : 'system',
      actorNombre: actor ? actor.nombre : 'Sistema VeciAyuda',
      actorRol: rol,
      motivo: motivo || 'Transición de trámite regular',
      accion: `${ESTADOS_META[estadoDestino].icon} Cambiado a ${ESTADOS_META[estadoDestino].label}`
    };

    solicitud.estado = estadoDestino;
    if (!solicitud.historial) solicitud.historial = [];
    solicitud.historial.unshift(registroAuditoria);

    return {
      solicitud,
      auditoria: registroAuditoria
    };
  }
};
