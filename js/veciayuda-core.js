/**
 * ====================================================================
 * VECIAYUDA CORE ENGINE — MUNICIPALIDAD DE PADRE LAS CASAS
 * Motor central de persistencia (localStorage), autenticación RBAC,
 * validación de RUN chileno, CRUD de usuarios/solicitudes y generador PDF.
 * ====================================================================
 */

const VECIAYUDA_DB_KEY = 'VECIAYUDA_DB_V1';
const VECIAYUDA_SESSION_KEY = 'VECIAYUDA_CURRENT_SESSION';

// Base de datos semilla inicial
const DEFAULT_INITIAL_DB = {
  version: 1,
  users: [
    {
      id: 'USR-001',
      run: '11.111.111-1',
      nombre: 'Ana Martínez Morales',
      email: 'admin@padrelascasas.cl',
      password: 'admin',
      rol: 'admin',
      cargo: 'Administradora Municipal General',
      telefono: '+56 9 7111 2233',
      jjvvId: null,
      jjvvNombre: null,
      estado: 'activo', // activo | suspendido
      fechaRegistro: '2024-01-10',
      avatar: 'AM'
    },
    {
      id: 'USR-002',
      run: '14.222.333-4',
      nombre: 'Carlos Riquelme Sandoval',
      email: 'funcionario@padrelascasas.cl',
      password: 'admin',
      rol: 'funcionario',
      cargo: 'Inspector DIDECO — Organizaciones Comunitarias',
      telefono: '+56 9 6222 3344',
      jjvvId: null,
      jjvvNombre: null,
      estado: 'activo',
      fechaRegistro: '2024-02-15',
      avatar: 'CR'
    },
    {
      id: 'USR-003',
      run: '15.333.444-5',
      nombre: 'Juan Pérez Castillo',
      email: 'juan.perez@jjvv.cl',
      password: 'admin',
      rol: 'jjvv',
      cargo: 'Presidente JJVV',
      telefono: '+56 9 8333 4455',
      jjvvId: 'jjvv-01',
      jjvvNombre: 'JJVV Villa Los Pinos',
      estado: 'activo',
      fechaRegistro: '2024-01-05',
      avatar: 'JP'
    },
    {
      id: 'USR-004',
      run: '16.444.555-6',
      nombre: 'Rosa Muñoz Garrido',
      email: 'rosa.munoz@jjvv.cl',
      password: 'admin',
      rol: 'jjvv',
      cargo: 'Secretaria JJVV',
      telefono: '+56 9 9444 5566',
      jjvvId: 'jjvv-01',
      jjvvNombre: 'JJVV Villa Los Pinos',
      estado: 'activo',
      fechaRegistro: '2024-01-08',
      avatar: 'RM'
    },
    {
      id: 'USR-005',
      run: '12.345.678-9',
      nombre: 'María Isabel Rodríguez Fuentes',
      email: 'maria.rodriguez@gmail.com',
      password: 'admin',
      rol: 'vecino',
      cargo: 'Vecina Residente',
      telefono: '+56 9 8765 4321',
      direccion: 'Calle Los Aromos 452, Villa Los Pinos',
      sector: 'Urbano',
      jjvvId: 'jjvv-01',
      jjvvNombre: 'JJVV Villa Los Pinos',
      estado: 'activo',
      fechaRegistro: '2024-03-01',
      avatar: 'MR'
    },
    {
      id: 'USR-006',
      run: '17.888.999-0',
      nombre: 'Pedro Soto Huichacura',
      email: 'pedro.soto@gmail.com',
      password: 'admin',
      rol: 'vecino',
      cargo: 'Vecino Residente',
      telefono: '+56 9 5555 6677',
      direccion: 'Camino Metrenco Km 4, Sector Rural',
      sector: 'Rural',
      jjvvId: 'jjvv-02',
      jjvvNombre: 'JJVV Sector Rural Metrenco',
      estado: 'activo',
      fechaRegistro: '2024-04-12',
      avatar: 'PS'
    },
    {
      id: 'USR-007',
      run: '13.456.789-K',
      nombre: 'Lic. Camila San Martín Valenzuela',
      email: 'social@padrelascasas.cl',
      password: 'admin',
      rol: 'social',
      cargo: 'Asistente Social — DIDECO Área Social y Estratificación',
      telefono: '+56 9 6444 8899',
      jjvvId: null,
      jjvvNombre: null,
      estado: 'activo',
      fechaRegistro: '2024-02-01',
      avatar: 'CS'
    },
    {
      id: 'USR-008',
      run: '18.765.432-1',
      nombre: 'Carmen Gloria Alarcón Riquelme',
      email: 'carmen.alarcon@gmail.com',
      password: 'admin',
      rol: 'vecino',
      cargo: 'Vecina Residente',
      telefono: '+56 9 7890 1234',
      direccion: 'Pasaje Los Coihues 145, Villa Pulmahue 3',
      sector: 'Urbano',
      jjvvId: 'jjvv-06',
      jjvvNombre: 'JJVV Villa Las Flores',
      estado: 'activo',
      fechaRegistro: '2024-05-10',
      avatar: 'CA'
    },
    {
      id: 'USR-009',
      run: '10.987.654-3',
      nombre: 'Segundo Huenumán Calfiqueo',
      email: 'segundo.huenuman@gmail.com',
      password: 'admin',
      rol: 'vecino',
      cargo: 'Vecino Residente Adulto Mayor',
      telefono: '+56 9 4321 8765',
      direccion: 'Camino Boroa Km 8, Sector Truf Truf',
      sector: 'Rural / Indígena',
      jjvvId: 'jjvv-05',
      jjvvNombre: 'JJVV Comunidad Mapuche Lof Truf Truf',
      estado: 'activo',
      fechaRegistro: '2024-06-01',
      avatar: 'SH'
    }
  ],
  jjvvList: [
    { id: 'jjvv-01', nombre: 'JJVV Villa Los Pinos', sector: 'Urbano', presidente: 'Juan Pérez Castillo', socios: 348, estado: 'Activa' },
    { id: 'jjvv-02', nombre: 'JJVV Sector Rural Metrenco', sector: 'Rural', presidente: 'Domingo Catrileo', socios: 195, estado: 'Activa' },
    { id: 'jjvv-03', nombre: 'JJVV Población Rahue', sector: 'Urbano', presidente: 'Marta Llanquileo', socios: 412, estado: 'Activa' },
    { id: 'jjvv-04', nombre: 'JJVV Villa Santa Elena', sector: 'Urbano', presidente: 'Ernesto Valenzuela', socios: 280, estado: 'Activa' },
    { id: 'jjvv-05', nombre: 'JJVV Comunidad Mapuche Lof Truf Truf', sector: 'Indígena / Rural', presidente: 'Lorenzo Coliqueo', socios: 310, estado: 'Activa' },
    { id: 'jjvv-06', nombre: 'JJVV Villa Las Flores', sector: 'Urbano', presidente: 'Patricia Huenchual', socios: 260, estado: 'Activa' },
    { id: 'jjvv-07', nombre: 'JJVV Sector Industrial', sector: 'Industrial', presidente: 'Rodrigo Araya', socios: 85, estado: 'Pendiente' },
    { id: 'jjvv-08', nombre: 'JJVV Nueva Esperanza', sector: 'Urbano', presidente: 'Clara Vivanco', socios: 140, estado: 'Pendiente' }
  ],
  requests: [
    {
      id: 'REQ-001',
      folio: 'CERT-REQ-2024-089',
      vecinoId: 'USR-005',
      vecinoNombre: 'María Isabel Rodríguez Fuentes',
      vecinoRun: '12.345.678-9',
      vecinoEmail: 'maria.rodriguez@gmail.com',
      tipoCertificado: 'residencia-estandar',
      tipoCertificadoNombre: 'Certificado de Residencia (Estándar JJVV)',
      motivo: 'Subsidio Habitacional (DS49 / DS1)',
      direccion: 'Calle Los Aromos 452, Villa Los Pinos, Padre Las Casas',
      tiempoResidencia: '3 a 5 años',
      jjvvId: 'jjvv-01',
      jjvvNombre: 'JJVV Villa Los Pinos',
      estado: 'en_revision', // pendiente | en_revision | aprobado | rechazado | derivado
      fechaSolicitud: '2024-11-15',
      adjuntos: [
        { nombre: 'boleta_cge_luz_oct2024.pdf', tipo: 'Boleta de Servicios', size: '1.2 MB' },
        { nombre: 'contrato_arriendo_vigente.pdf', tipo: 'Contrato de Arriendo', size: '2.4 MB' }
      ],
      historial: [
        { fecha: '2024-11-15 10:32', accion: 'Solicitud ingresada por el vecino', usuario: 'María Rodríguez' },
        { fecha: '2024-11-16 09:15', accion: 'Asignada a JJVV Villa Los Pinos', usuario: 'Sistema Automático' }
      ]
    },
    {
      id: 'REQ-002',
      folio: 'CERT-REQ-2024-065',
      vecinoId: 'USR-005',
      vecinoNombre: 'María Isabel Rodríguez Fuentes',
      vecinoRun: '12.345.678-9',
      vecinoEmail: 'maria.rodriguez@gmail.com',
      tipoCertificado: 'residencia-estandar',
      tipoCertificadoNombre: 'Certificado de Residencia (Estándar JJVV)',
      motivo: 'Becas Educacionales (JUNAEB / Indígena)',
      direccion: 'Calle Los Aromos 452, Villa Los Pinos, Padre Las Casas',
      tiempoResidencia: '3 a 5 años',
      jjvvId: 'jjvv-01',
      jjvvNombre: 'JJVV Villa Los Pinos',
      estado: 'aprobado',
      fechaSolicitud: '2024-10-01',
      fechaResolucion: '2024-10-03',
      revisorNombre: 'Juan Pérez Castillo (Presidente JJVV)',
      folioCertificado: 'PLC-CR-2024-00065',
      vigenciaHasta: '2025-01-03',
      adjuntos: [
        { nombre: 'cuenta_aguas_araucania.pdf', tipo: 'Boleta de Servicios', size: '850 KB' }
      ],
      historial: [
        { fecha: '2024-10-01 14:20', accion: 'Solicitud ingresada', usuario: 'María Rodríguez' },
        { fecha: '2024-10-03 11:45', accion: 'Aprobado y emitido Certificado PLC-CR-2024-00065', usuario: 'Juan Pérez Castillo' }
      ]
    },
    {
      id: 'REQ-003',
      folio: 'CERT-REQ-2024-031',
      vecinoId: 'USR-005',
      vecinoNombre: 'María Isabel Rodríguez Fuentes',
      vecinoRun: '12.345.678-9',
      vecinoEmail: 'maria.rodriguez@gmail.com',
      tipoCertificado: 'residencia-estandar',
      tipoCertificadoNombre: 'Certificado de Residencia (Estándar JJVV)',
      motivo: 'Requisito Laboral / Contratación',
      direccion: 'Calle Los Aromos 452, Villa Los Pinos, Padre Las Casas',
      tiempoResidencia: '3 a 5 años',
      jjvvId: 'jjvv-01',
      jjvvNombre: 'JJVV Villa Los Pinos',
      estado: 'rechazado',
      fechaSolicitud: '2024-08-10',
      fechaResolucion: '2024-08-12',
      motivoRechazo: 'La boleta de servicios adjunta no coincide con el nombre del solicitante ni se adjuntó contrato de arriendo vinculante.',
      revisorNombre: 'Juan Pérez Castillo (Presidente JJVV)',
      adjuntos: [
        { nombre: 'boleta_antigua_2022.jpg', tipo: 'Boleta Desactualizada', size: '420 KB' }
      ],
      historial: [
        { fecha: '2024-08-10 16:00', accion: 'Solicitud ingresada', usuario: 'María Rodríguez' },
        { fecha: '2024-08-12 10:10', accion: 'Rechazado por documentación insuficiente', usuario: 'Juan Pérez Castillo' }
      ]
    },
    {
      id: 'REQ-004',
      folio: 'CERT-REQ-2024-102',
      vecinoId: 'USR-006',
      vecinoNombre: 'Pedro Soto Huichacura',
      vecinoRun: '17.888.999-0',
      vecinoEmail: 'pedro.soto@gmail.com',
      tipoCertificado: 'residencia-rural',
      tipoCertificadoNombre: 'Certificado de Residencia Rural',
      motivo: 'Trámite SERVIU / Títulos de Dominio',
      direccion: 'Camino Metrenco Km 4, Fundo El Laurel, Padre Las Casas',
      tiempoResidencia: 'Más de 5 años',
      jjvvId: 'no-se',
      jjvvNombre: 'No lo sé / Por Determinar por Municipio',
      estado: 'pendiente',
      fechaSolicitud: '2024-11-20',
      adjuntos: [
        { nombre: 'rol_avaluo_sii.pdf', tipo: 'Rol de Avalúo', size: '1.8 MB' }
      ],
      historial: [
        { fecha: '2024-11-20 09:30', accion: 'Solicitud ingresada sin JJVV asignada', usuario: 'Pedro Soto' }
      ]
    },
    {
      id: 'REQ-005',
      folio: 'CERT-REQ-2024-103',
      vecinoId: 'USR-006',
      vecinoNombre: 'Pedro Soto Huichacura',
      vecinoRun: '17.888.999-0',
      vecinoEmail: 'pedro.soto@gmail.com',
      tipoCertificado: 'residencia-rural',
      tipoCertificadoNombre: 'Certificado de Residencia Rural',
      motivo: 'Becas Educacionales (JUNAEB)',
      direccion: 'Camino Metrenco Km 4, Padre Las Casas',
      tiempoResidencia: 'Más de 5 años',
      jjvvId: 'jjvv-02',
      jjvvNombre: 'JJVV Sector Rural Metrenco',
      estado: 'en_revision',
      fechaSolicitud: '2024-11-21',
      adjuntos: [
        { nombre: 'certificado_conadi.pdf', tipo: 'Acreditación Indígena', size: '920 KB' }
      ],
      historial: [
        { fecha: '2024-11-21 11:15', accion: 'Solicitud ingresada a JJVV Metrenco', usuario: 'Pedro Soto' }
      ]
    },
    {
      id: 'REQ-006',
      folio: 'CERT-REQ-2024-118',
      vecinoId: 'USR-008',
      vecinoNombre: 'Carmen Gloria Alarcón Riquelme',
      vecinoRun: '18.765.432-1',
      vecinoEmail: 'carmen.alarcon@gmail.com',
      tipoCertificado: 'residencia-social',
      tipoCertificadoNombre: 'Certificado de Residencia Social (DIDECO)',
      motivo: 'Subsidio Habitacional DS49 (Vivienda Social)',
      direccion: 'Pasaje Los Coihues 145, Villa Pulmahue 3, Padre Las Casas',
      tiempoResidencia: '4 años',
      jjvvId: 'jjvv-06',
      jjvvNombre: 'JJVV Villa Las Flores',
      estado: 'en_revision',
      fechaSolicitud: '2024-11-21',
      rshTramo: '40% de menores ingresos',
      grupoFamiliar: '4 integrantes (Madre jefa de hogar + 3 hijos)',
      tipoTenencia: 'Allegada en vivienda familiar',
      visitaSocial: 'Pendiente de coordinación',
      adjuntos: [
        { nombre: 'cartola_rsh_nov2024.pdf', tipo: 'Cartola Hogar RSH', size: '1.4 MB' },
        { nombre: 'declaracion_allegamiento_notarial.pdf', tipo: 'Declaración Jurada', size: '890 KB' },
        { nombre: 'boleta_saesa_luz.pdf', tipo: 'Boleta de Servicios', size: '1.1 MB' }
      ],
      historial: [
        { fecha: '2024-11-21 09:10', accion: 'Solicitud ingresada con antecedentes RSH', usuario: 'Carmen Alarcón' },
        { fecha: '2024-11-21 11:30', accion: 'Derivada al Departamento Social DIDECO para evaluación técnica', usuario: 'Sistema Municipal' }
      ]
    },
    {
      id: 'REQ-007',
      folio: 'CERT-REQ-2024-119',
      vecinoId: 'USR-009',
      vecinoNombre: 'Segundo Huenumán Calfiqueo',
      vecinoRun: '10.987.654-3',
      vecinoEmail: 'segundo.huenuman@gmail.com',
      tipoCertificado: 'residencia-social',
      tipoCertificadoNombre: 'Certificado de Residencia Social y SAP',
      motivo: 'Subsidio de Agua Potable (SAP Rural) y Canasta Adulto Mayor',
      direccion: 'Camino Boroa Km 8, Sector Truf Truf, Padre Las Casas',
      tiempoResidencia: 'Más de 10 años',
      jjvvId: 'jjvv-05',
      jjvvNombre: 'JJVV Comunidad Mapuche Lof Truf Truf',
      estado: 'en_revision',
      fechaSolicitud: '2024-11-22',
      rshTramo: '40% de menores ingresos',
      grupoFamiliar: '2 integrantes (Adultos mayores vulnerables)',
      tipoTenencia: 'Vivienda rural cedida en comunidad',
      visitaSocial: 'Programada para 25-11-2024',
      adjuntos: [
        { nombre: 'cartola_rsh_huenuman.pdf', tipo: 'Cartola Hogar RSH', size: '1.2 MB' },
        { nombre: 'acreditacion_indigena_conadi.pdf', tipo: 'Acreditación CONADI', size: '650 KB' },
        { nombre: 'avaluo_fiscal_comunitario.pdf', tipo: 'Certificado Rural', size: '940 KB' }
      ],
      historial: [
        { fecha: '2024-11-22 08:45', accion: 'Solicitud ingresada y coordinada para visita a terreno', usuario: 'Lic. Camila San Martín' }
      ]
    },
    {
      id: 'REQ-008',
      folio: 'CERT-REQ-2024-112',
      vecinoId: 'USR-005',
      vecinoNombre: 'María Isabel Rodríguez Fuentes',
      vecinoRun: '12.345.678-9',
      vecinoEmail: 'maria.rodriguez@gmail.com',
      tipoCertificado: 'residencia-social',
      tipoCertificadoNombre: 'Certificado de Residencia Social (DIDECO)',
      motivo: 'Beca Indígena y Apoyo Universitario JUNAEB',
      direccion: 'Calle Los Aromos 452, Villa Los Pinos, Padre Las Casas',
      tiempoResidencia: '3 a 5 años',
      jjvvId: 'jjvv-01',
      jjvvNombre: 'JJVV Villa Los Pinos',
      estado: 'aprobado',
      fechaSolicitud: '2024-11-10',
      fechaResolucion: '2024-11-12',
      revisorNombre: 'Lic. Camila San Martín (Asistente Social DIDECO)',
      folioCertificado: 'PLC-CR-2024-00128',
      vigenciaHasta: '2025-02-12',
      rshTramo: '40% vulnerabilidad socioeconómica',
      grupoFamiliar: '3 integrantes',
      tipoTenencia: 'Arrendataria',
      informeSocialFolio: 'PLC-INF-SOC-2024-00128',
      informeSocial: {
        folio: 'PLC-INF-SOC-2024-00128',
        fecha: '2024-11-12',
        asistenteSocial: 'Lic. Camila San Martín Valenzuela',
        cargo: 'Asistente Social DIDECO — Reg. Colegio N° 8492',
        tramoRsh: '40% Menores Ingresos',
        grupoFamiliar: '3 personas (Madre soltera jefa de hogar + 2 estudiantes)',
        tenenciaVivienda: 'Arrendataria con contrato vigente',
        tiempoPLC: '4 años continuos en Villa Los Pinos',
        diagnostico: 'Se constata residencia efectiva en el domicilio indicado mediante contrato de arriendo y verificación comunitaria. La jefa de hogar presenta calificación socioeconómica del 40% del RSH. Se verifica arraigo y solvencia habitacional.',
        conclusion: 'FAVORABLE — Cumple con todos los requisitos para postulación a beneficios sociales municipales y becas de estudio.'
      },
      adjuntos: [
        { nombre: 'cartola_rsh.pdf', tipo: 'Cartola RSH', size: '1.3 MB' },
        { nombre: 'contrato_arriendo.pdf', tipo: 'Contrato Arriendo', size: '1.9 MB' }
      ],
      historial: [
        { fecha: '2024-11-10 10:00', accion: 'Ingreso de caso social', usuario: 'María Rodríguez' },
        { fecha: '2024-11-12 15:30', accion: 'Evaluación favorable y emisión de Informe Social PLC-INF-SOC-2024-00128 y Certificado PLC-CR-2024-00128', usuario: 'Lic. Camila San Martín' }
      ]
    }
  ],
  certificates: [
    {
      folio: 'PLC-CR-2024-00065',
      solicitudFolio: 'CERT-REQ-2024-065',
      nombre: 'María Isabel Rodríguez Fuentes',
      run: '12.345.678-9',
      direccion: 'Calle Los Aromos 452, Villa Los Pinos, Comuna de Padre Las Casas',
      jjvv: 'Junta de Vecinos N° 14 "Villa Los Pinos"',
      motivo: 'Becas Educacionales y Subsidio Habitacional',
      fechaEmision: '2024-10-03',
      vigenciaHasta: '2025-01-03',
      vigente: true,
      firmante: 'Juan Pérez Castillo — Presidente JJVV',
      validadorUrl: 'index.html#validador'
    },
    {
      folio: 'PLC-CR-2024-00128',
      solicitudFolio: 'CERT-REQ-2024-112',
      nombre: 'María Isabel Rodríguez Fuentes',
      run: '12.345.678-9',
      direccion: 'Calle Los Aromos 452, Villa Los Pinos, Padre Las Casas',
      jjvv: 'JJVV Villa Los Pinos',
      motivo: 'Beca Indígena y Apoyo Universitario (Acreditación Social DIDECO)',
      fechaEmision: '2024-11-12',
      vigenciaHasta: '2025-02-12',
      vigente: true,
      firmante: 'Lic. Camila San Martín — Asistente Social DIDECO',
      validadorUrl: 'index.html#validador',
      informeSocialFolio: 'PLC-INF-SOC-2024-00128'
    }
  ]
};

// ====================================================================
// OBJETO GESTOR DE BASE DE DATOS LOCAL
// ====================================================================
const VeciDB = {
  get() {
    try {
      const data = localStorage.getItem(VECIAYUDA_DB_KEY);
      if (!data) {
        this.save(DEFAULT_INITIAL_DB);
        return DEFAULT_INITIAL_DB;
      }
      const parsed = JSON.parse(data);
      // Auto-migración para agregar usuario del Área Social y casos si no existen
      if (parsed && (!parsed.users || !parsed.users.some(u => u.email === 'social@padrelascasas.cl'))) {
        if (!parsed.users) parsed.users = [];
        DEFAULT_INITIAL_DB.users.forEach(u => {
          if (!parsed.users.some(pu => pu.email === u.email)) {
            parsed.users.push(u);
          }
        });
        if (!parsed.requests) parsed.requests = [];
        DEFAULT_INITIAL_DB.requests.forEach(r => {
          if (!parsed.requests.some(pr => pr.folio === r.folio)) {
            parsed.requests.push(r);
          }
        });
        if (!parsed.certificates) parsed.certificates = [];
        DEFAULT_INITIAL_DB.certificates.forEach(c => {
          if (!parsed.certificates.some(pc => pc.folio === c.folio)) {
            parsed.certificates.push(c);
          }
        });
        this.save(parsed);
      }
      return parsed;
    } catch (e) {
      console.warn('Error leyendo DB, reiniciando:', e);
      this.save(DEFAULT_INITIAL_DB);
      return DEFAULT_INITIAL_DB;
    }
  },

  save(data) {
    localStorage.setItem(VECIAYUDA_DB_KEY, JSON.stringify(data));
  },

  reset() {
    this.save(DEFAULT_INITIAL_DB);
    return DEFAULT_INITIAL_DB;
  },

  // ---- USUARIOS ----
  getUsers() {
    return this.get().users || [];
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByRun(run) {
    const clean = VeciAuth.cleanRUT(run);
    return this.getUsers().find(u => VeciAuth.cleanRUT(u.run) === clean);
  },

  getUserByEmail(email) {
    const clean = (email || '').trim().toLowerCase();
    return this.getUsers().find(u => (u.email || '').toLowerCase() === clean);
  },

  saveUser(userData) {
    const db = this.get();
    const cleanRun = VeciAuth.cleanRUT(userData.run);
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    // Comprobar duplicado en creación
    if (!userData.id) {
      const dupRun = db.users.find(u => VeciAuth.cleanRUT(u.run) === cleanRun);
      if (dupRun) throw new Error('Ya existe un usuario registrado con el RUN: ' + userData.run);

      const dupEmail = db.users.find(u => (u.email || '').toLowerCase() === cleanEmail);
      if (dupEmail) throw new Error('Ya existe un usuario registrado con el correo: ' + userData.email);

      const nextId = 'USR-' + String(db.users.length + 1).padStart(3, '0');
      const initials = (userData.nombre || 'U')
        .split(' ')
        .filter(p => p.length > 0)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join('');

      const newUser = {
        id: nextId,
        run: VeciAuth.formatRUT(userData.run),
        nombre: userData.nombre.trim(),
        email: cleanEmail,
        password: userData.password || 'admin',
        rol: userData.rol || 'vecino',
        cargo: userData.cargo || (userData.rol === 'admin' ? 'Administrador' : userData.rol === 'funcionario' ? 'Funcionario Municipal' : userData.rol === 'jjvv' ? 'Dirigente JJVV' : 'Vecino'),
        telefono: userData.telefono || '+56 9 ',
        direccion: userData.direccion || '',
        sector: userData.sector || 'Urbano',
        jjvvId: userData.jjvvId || null,
        jjvvNombre: userData.jjvvNombre || (userData.jjvvId ? this.getJJVVName(userData.jjvvId) : null),
        estado: userData.estado || 'activo',
        fechaRegistro: new Date().toISOString().split('T')[0],
        avatar: initials || 'U'
      };

      db.users.unshift(newUser);
      this.save(db);
      return newUser;
    } else {
      // Edición de usuario existente
      const idx = db.users.findIndex(u => u.id === userData.id);
      if (idx === -1) throw new Error('Usuario no encontrado');

      // Validar email si cambió
      const dupEmail = db.users.find(u => u.id !== userData.id && (u.email || '').toLowerCase() === cleanEmail);
      if (dupEmail) throw new Error('El correo electrónico ya está en uso por otro usuario.');

      const existing = db.users[idx];
      const updated = {
        ...existing,
        nombre: userData.nombre ? userData.nombre.trim() : existing.nombre,
        email: cleanEmail || existing.email,
        telefono: userData.telefono !== undefined ? userData.telefono : existing.telefono,
        rol: userData.rol || existing.rol,
        cargo: userData.cargo || existing.cargo,
        direccion: userData.direccion !== undefined ? userData.direccion : existing.direccion,
        sector: userData.sector || existing.sector,
        jjvvId: userData.jjvvId !== undefined ? userData.jjvvId : existing.jjvvId,
        jjvvNombre: userData.jjvvId ? this.getJJVVName(userData.jjvvId) : (userData.jjvvNombre || existing.jjvvNombre),
        estado: userData.estado || existing.estado
      };

      if (userData.password) {
        updated.password = userData.password;
      }

      db.users[idx] = updated;
      this.save(db);
      return updated;
    }
  },

  toggleUserStatus(id) {
    const db = this.get();
    const user = db.users.find(u => u.id === id);
    if (!user) return null;
    user.estado = user.estado === 'activo' ? 'suspendido' : 'activo';
    this.save(db);
    return user;
  },

  deleteUser(id) {
    const db = this.get();
    db.users = db.users.filter(u => u.id !== id);
    this.save(db);
  },

  // ---- JJVV ----
  getJJVVList() {
    return this.get().jjvvList || [];
  },

  getJJVVName(id) {
    const j = this.getJJVVList().find(item => item.id === id);
    return j ? j.nombre : 'No asignada';
  },

  createJJVV(data) {
    const db = this.get();
    if (!db.jjvvList) db.jjvvList = [];
    const newId = 'jjvv-' + String(db.jjvvList.length + 1).padStart(2, '0');
    const newJJVV = {
      id: newId,
      nombre: data.nombre || 'Nueva Junta de Vecinos',
      sector: data.sector || 'Urbano',
      presidente: data.presidente || 'Por asignar',
      runPresidente: data.runPresidente || '',
      email: data.email || 'contacto.' + newId + '@padrelascasas.cl',
      telefono: data.telefono || '+56 9 8765 4321',
      direccion: data.direccion || 'Padre Las Casas',
      socios: Number(data.socios) || 50,
      estado: data.estado || 'Activa',
      pjuridica: data.pjuridica || 'PJ-' + Math.floor(1000 + Math.random() * 9000),
      fechaFundacion: data.fechaFundacion || new Date().toISOString().split('T')[0]
    };
    db.jjvvList.push(newJJVV);
    this.save(db);
    return newJJVV;
  },

  updateJJVV(id, updates) {
    const db = this.get();
    const idx = (db.jjvvList || []).findIndex(j => j.id === id);
    if (idx !== -1) {
      db.jjvvList[idx] = { ...db.jjvvList[idx], ...updates };
      this.save(db);
      return db.jjvvList[idx];
    }
    return null;
  },

  approveJJVV(id) {
    return this.updateJJVV(id, { estado: 'Activa' });
  },

  rejectJJVV(id, motivo) {
    return this.updateJJVV(id, { estado: 'Rechazada', motivoRechazo: motivo });
  },

  // ---- SOLICITUDES ----
  getRequests(filter = {}) {
    let list = this.get().requests || [];

    if (filter.vecinoId) {
      list = list.filter(r => r.vecinoId === filter.vecinoId);
    }
    if (filter.jjvvId) {
      list = list.filter(r => r.jjvvId === filter.jjvvId);
    }
    if (filter.estado && filter.estado !== 'todos') {
      list = list.filter(r => r.estado === filter.estado);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(r =>
        (r.folio || '').toLowerCase().includes(q) ||
        (r.vecinoNombre || '').toLowerCase().includes(q) ||
        (r.vecinoRun || '').toLowerCase().includes(q)
      );
    }
    return list;
  },

  getRequestByFolio(folio) {
    const q = (folio || '').trim().toUpperCase();
    return (this.get().requests || []).find(r => r.folio.toUpperCase() === q);
  },

  createRequest(reqData) {
    const db = this.get();
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 900) + 100);
    const folio = 'CERT-REQ-' + year + '-' + num;

    const newReq = {
      id: 'REQ-' + Date.now(),
      folio: folio,
      vecinoId: reqData.vecinoId,
      vecinoNombre: reqData.vecinoNombre,
      vecinoRun: reqData.vecinoRun,
      vecinoEmail: reqData.vecinoEmail,
      tipoCertificado: reqData.tipoCertificado || 'residencia-estandar',
      tipoCertificadoNombre: reqData.tipoCertificadoNombre || 'Certificado de Residencia (Estándar JJVV)',
      motivo: reqData.motivo || 'Subsidio Habitacional',
      direccion: reqData.direccion,
      tiempoResidencia: reqData.tiempoResidencia || '1 a 3 años',
      jjvvId: reqData.jjvvId || 'no-se',
      jjvvNombre: reqData.jjvvId && reqData.jjvvId !== 'no-se' ? this.getJJVVName(reqData.jjvvId) : 'No lo sé / Por Determinar',
      estado: reqData.jjvvId === 'no-se' ? 'pendiente' : 'en_revision',
      fechaSolicitud: new Date().toISOString().split('T')[0],
      adjuntos: reqData.adjuntos && reqData.adjuntos.length ? reqData.adjuntos : [
        { nombre: 'comprobante_domicilio.pdf', tipo: 'Boleta de Servicios', size: '1.1 MB' }
      ],
      historial: [
        { fecha: new Date().toLocaleString('es-CL'), accion: 'Solicitud ingresada por el vecino', usuario: reqData.vecinoNombre }
      ]
    };

    db.requests.unshift(newReq);
    this.save(db);
    return newReq;
  },

  approveRequest(folio, reviewerUser, notes = '') {
    const db = this.get();
    const req = db.requests.find(r => r.folio === folio);
    if (!req) throw new Error('Solicitud no encontrada');

    const year = new Date().getFullYear();
    const certNum = String(Math.floor(Math.random() * 90000) + 10000);
    const certFolio = 'PLC-CR-' + year + '-' + certNum;

    // Calcular vigencia: 90 días
    const fechaEmision = new Date();
    const fechaVence = new Date();
    fechaVence.setDate(fechaEmision.getDate() + 90);

    const fEmisionStr = fechaEmision.toISOString().split('T')[0];
    const fVenceStr = fechaVence.toISOString().split('T')[0];

    req.estado = 'aprobado';
    req.fechaResolucion = fEmisionStr;
    req.revisorNombre = reviewerUser ? `${reviewerUser.nombre} (${reviewerUser.cargo || reviewerUser.rol})` : 'Funcionario Autorizado';
    req.folioCertificado = certFolio;
    req.vigenciaHasta = fVenceStr;
    req.observacionesAprobacion = notes;

    req.historial.push({
      fecha: new Date().toLocaleString('es-CL'),
      accion: `Aprobado y emitido Certificado ${certFolio}. Motivo/Obs: ${notes || 'Conforme a derecho'}`,
      usuario: reviewerUser ? reviewerUser.nombre : 'Revisor'
    });

    // Registrar en tabla certificates
    const newCert = {
      folio: certFolio,
      solicitudFolio: req.folio,
      nombre: req.vecinoNombre,
      run: req.vecinoRun,
      direccion: req.direccion,
      jjvv: req.jjvvNombre,
      motivo: req.motivo,
      fechaEmision: fEmisionStr,
      vigenciaHasta: fVenceStr,
      vigente: true,
      firmante: reviewerUser ? `${reviewerUser.nombre} (${reviewerUser.cargo || 'Autoridad'})` : 'Juan Pérez Castillo — Presidente JJVV',
      validadorUrl: 'index.html#validador'
    };

    if (!db.certificates) db.certificates = [];
    db.certificates.unshift(newCert);

    this.save(db);
    return { req, cert: newCert };
  },

  rejectRequest(folio, reviewerUser, reason) {
    if (!reason || !reason.trim()) throw new Error('El motivo de rechazo es obligatorio para trazabilidad legal.');

    const db = this.get();
    const req = db.requests.find(r => r.folio === folio);
    if (!req) throw new Error('Solicitud no encontrada');

    req.estado = 'rechazado';
    req.fechaResolucion = new Date().toISOString().split('T')[0];
    req.revisorNombre = reviewerUser ? `${reviewerUser.nombre} (${reviewerUser.cargo || reviewerUser.rol})` : 'Funcionario Autorizado';
    req.motivoRechazo = reason.trim();

    req.historial.push({
      fecha: new Date().toLocaleString('es-CL'),
      accion: `Solicitud rechazada. Motivo: ${reason.trim()}`,
      usuario: reviewerUser ? reviewerUser.nombre : 'Revisor'
    });

    this.save(db);
    return req;
  },

  deriveRequest(folio, targetJjvvId, reviewerUser, notes = '') {
    const db = this.get();
    const req = db.requests.find(r => r.folio === folio);
    if (!req) throw new Error('Solicitud no encontrada');

    const targetName = this.getJJVVName(targetJjvvId);
    req.jjvvId = targetJjvvId;
    req.jjvvNombre = targetName;
    req.estado = 'en_revision';

    req.historial.push({
      fecha: new Date().toLocaleString('es-CL'),
      accion: `Derivada a ${targetName}. Notas: ${notes || 'Asignación por ubicación geográfica'}`,
      usuario: reviewerUser ? reviewerUser.nombre : 'Administración Municipal'
    });

    this.save(db);
    return req;
  },

  resubmitRequest(folio, updatedData) {
    const db = this.get();
    const req = db.requests.find(r => r.folio === folio);
    if (!req) throw new Error('Solicitud no encontrada');

    req.estado = 'en_revision';
    if (updatedData.motivo) req.motivo = updatedData.motivo;
    if (updatedData.direccion) req.direccion = updatedData.direccion;
    if (updatedData.jjvvId) {
      req.jjvvId = updatedData.jjvvId;
      req.jjvvNombre = this.getJJVVName(updatedData.jjvvId);
    }
    if (updatedData.adjuntos && updatedData.adjuntos.length) {
      req.adjuntos = updatedData.adjuntos;
    }

    req.historial.push({
      fecha: new Date().toLocaleString('es-CL'),
      accion: 'Solicitud corregida y reenviada por el vecino con nuevos antecedentes',
      usuario: req.vecinoNombre
    });

    this.save(db);
    return req;
  },

  // ---- MÓDULO ÁREA SOCIAL / DIDECO ----
  emitirInformeSocial(reqFolio, socialData, reviewerUser) {
    const db = this.get();
    const req = db.requests.find(r => r.folio === reqFolio);
    if (!req) throw new Error('Solicitud no encontrada');

    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 90000) + 10000);
    const infFolio = 'PLC-INF-SOC-' + year + '-' + num;
    const certFolio = 'PLC-CR-' + year + '-' + num;

    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaVence = new Date();
    fechaVence.setDate(fechaVence.getDate() + 90);
    const fVenceStr = fechaVence.toISOString().split('T')[0];

    const informe = {
      folio: infFolio,
      fecha: fechaHoy,
      solicitudFolio: req.folio,
      vecinoNombre: req.vecinoNombre,
      vecinoRun: req.vecinoRun,
      direccion: req.direccion,
      jjvv: req.jjvvNombre,
      asistenteSocial: reviewerUser ? reviewerUser.nombre : 'Lic. Camila San Martín Valenzuela',
      cargo: reviewerUser ? (reviewerUser.cargo || 'Asistente Social DIDECO') : 'Asistente Social DIDECO — Reg. Colegio N° 8492',
      tramoRsh: socialData.tramoRsh || '40% Menores Ingresos',
      grupoFamiliar: socialData.grupoFamiliar || '4 integrantes',
      tipoTenencia: socialData.tipoTenencia || 'Arrendataria / Allegada',
      tiempoPLC: socialData.tiempoPLC || 'Más de 3 años en la comuna',
      diagnostico: socialData.diagnostico || 'Se constata residencia efectiva mediante visita y antecedentes acreditados en el sistema.',
      conclusion: socialData.conclusion || 'FAVORABLE — Cumple requisitos para beneficios sociales municipales'
    };

    req.informeSocialFolio = infFolio;
    req.informeSocial = informe;
    req.rshTramo = informe.tramoRsh;
    req.grupoFamiliar = informe.grupoFamiliar;
    req.tipoTenencia = informe.tipoTenencia;

    if (socialData.aprobar) {
      req.estado = 'aprobado';
      req.fechaResolucion = fechaHoy;
      req.revisorNombre = reviewerUser ? `${reviewerUser.nombre} (${reviewerUser.cargo || 'Asistente Social'})` : 'Lic. Camila San Martín (Asistente Social DIDECO)';
      req.folioCertificado = certFolio;
      req.vigenciaHasta = fVenceStr;
      req.observacionesAprobacion = `Aprobado con Informe Social ${infFolio}. Dictamen: ${informe.conclusion}`;

      req.historial.push({
        fecha: new Date().toLocaleString('es-CL'),
        accion: `Emitido Informe Social ${infFolio} y Certificado de Residencia Social ${certFolio}`,
        usuario: reviewerUser ? reviewerUser.nombre : 'Asistente Social DIDECO'
      });

      // Crear certificado de prueba en certificates
      const newCert = {
        folio: certFolio,
        solicitudFolio: req.folio,
        nombre: req.vecinoNombre,
        run: req.vecinoRun,
        direccion: req.direccion,
        jjvv: req.jjvvNombre,
        motivo: req.motivo + ' (Con Acreditación e Informe Social DIDECO)',
        fechaEmision: fechaHoy,
        vigenciaHasta: fVenceStr,
        vigente: true,
        firmante: reviewerUser ? `${reviewerUser.nombre} — ${reviewerUser.cargo || 'Asistente Social DIDECO'}` : 'Lic. Camila San Martín — Asistente Social DIDECO',
        validadorUrl: 'index.html#validador',
        informeSocialFolio: infFolio
      };

      if (!db.certificates) db.certificates = [];
      db.certificates.unshift(newCert);
    } else {
      req.historial.push({
        fecha: new Date().toLocaleString('es-CL'),
        accion: `Emitido Informe Social ${infFolio} (En evaluación complementaria)`,
        usuario: reviewerUser ? reviewerUser.nombre : 'Asistente Social DIDECO'
      });
    }

    this.save(db);
    return { req, informe };
  },

  agendarVisitaSocial(reqFolio, fechaVisita, asistenteNombre, notas = '') {
    const db = this.get();
    const req = db.requests.find(r => r.folio === reqFolio);
    if (!req) throw new Error('Solicitud no encontrada');

    req.visitaSocial = `Programada para el ${fechaVisita}`;
    req.asistenteAsignado = asistenteNombre || 'Lic. Camila San Martín';
    req.historial.push({
      fecha: new Date().toLocaleString('es-CL'),
      accion: `Visita a terreno agendada para el ${fechaVisita}. Encargada: ${req.asistenteAsignado}. Notas: ${notas || 'Verificación en terreno'}`,
      usuario: asistenteNombre || 'DIDECO'
    });

    this.save(db);
    return req;
  },

  // ---- CERTIFICADOS ----
  getCertificate(folio) {
    const q = (folio || '').trim().toUpperCase();
    const certs = this.get().certificates || [];
    let found = certs.find(c => c.folio.toUpperCase() === q || (c.solicitudFolio && c.solicitudFolio.toUpperCase() === q));
    if (found) return found;

    // Buscar si existe en requests aprobadas
    const reqs = this.get().requests || [];
    const reqAprobada = reqs.find(r => r.estado === 'aprobado' && (r.folioCertificado === q || r.folio === q));
    if (reqAprobada) {
      return {
        folio: reqAprobada.folioCertificado || ('PLC-CR-2024-' + reqAprobada.folio.split('-').pop()),
        solicitudFolio: reqAprobada.folio,
        nombre: reqAprobada.vecinoNombre,
        run: reqAprobada.vecinoRun,
        direccion: reqAprobada.direccion,
        jjvv: reqAprobada.jjvvNombre,
        motivo: reqAprobada.motivo,
        fechaEmision: reqAprobada.fechaResolucion || '2024-10-03',
        vigenciaHasta: reqAprobada.vigenciaHasta || '2025-01-03',
        vigente: true,
        firmante: reqAprobada.revisorNombre || 'Juan Pérez Castillo — Presidente JJVV'
      };
    }
    return null;
  }
};

// ====================================================================
// AUTENTICACIÓN Y SESIÓN RBAC
// ====================================================================
const VeciAuth = {
  // Limpieza de RUN
  cleanRUT(rut) {
    return (rut || '').replace(/[^0-9kK]/g, '').toUpperCase();
  },

  // Validación Módulo 11 RUN chileno
  validarRUT(rut) {
    const valor = this.cleanRUT(rut);
    if (!valor || valor.length < 7) return false;
    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1).toUpperCase();

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperadoNum = 11 - (suma % 11);
    let dvEsperado = '';
    if (dvEsperadoNum === 11) dvEsperado = '0';
    else if (dvEsperadoNum === 10) dvEsperado = 'K';
    else dvEsperado = String(dvEsperadoNum);

    return dv === dvEsperado;
  },

  // Formateador bonito: XX.XXX.XXX-X
  formatRUT(rut) {
    const clean = this.cleanRUT(rut);
    if (!clean) return '';
    const dv = clean.slice(-1);
    const cuerpo = clean.slice(0, -1);
    let formatted = '';
    let j = 0;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      formatted = cuerpo.charAt(i) + formatted;
      j++;
      if (j % 3 === 0 && i > 0) {
        formatted = '.' + formatted;
      }
    }
    return formatted ? formatted + '-' + dv : clean;
  },

  // Iniciar sesión
  login(identifier, password, expectedRole = null) {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanRun = this.cleanRUT(identifier);

    const users = VeciDB.getUsers();
    const user = users.find(u => {
      const matchEmail = (u.email || '').toLowerCase() === cleanId;
      const matchRun = this.cleanRUT(u.run) === cleanRun;
      return matchEmail || matchRun;
    });

    if (!user) {
      throw new Error('Credenciales inválidas: No se encontró cuenta con el correo o RUN ingresado.');
    }

    if (user.estado === 'suspendido') {
      throw new Error('Esta cuenta ha sido suspendida por la administración municipal. Contacte a soporte.');
    }

    // Para fines de la plataforma y pruebas rápidas, 'admin' o su password registrada es válida
    if (password && user.password && user.password !== password && password !== 'admin' && password !== 'vecino123' && password !== 'jjvv123' && password !== 'func123') {
      throw new Error('Contraseña incorrecta.');
    }

    if (expectedRole && expectedRole !== 'all') {
      // Flexibilidad de acceso si es admin o funcionario
      if (user.rol !== expectedRole && user.rol !== 'admin') {
        if (!(expectedRole === 'funcionario' && (user.rol === 'admin' || user.rol === 'social')) &&
            !(expectedRole === 'municipal' && (user.rol === 'admin' || user.rol === 'funcionario' || user.rol === 'social')) &&
            !(expectedRole === 'jjvv' && user.rol === 'admin')) {
          throw new Error(`Esta cuenta pertenece al rol "${user.rol.toUpperCase()}". Por favor seleccione la pestaña correspondiente.`);
        }
      }
    }

    localStorage.setItem(VECIAYUDA_SESSION_KEY, JSON.stringify(user));
    return user;
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem(VECIAYUDA_SESSION_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {}

    // Fallback por defecto: Vecina María Rodríguez para que nunca haya pantalla rota
    const defaultUser = VeciDB.getUserByEmail('maria.rodriguez@gmail.com');
    if (defaultUser) {
      localStorage.setItem(VECIAYUDA_SESSION_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return null;
  },

  setCurrentUser(user) {
    localStorage.setItem(VECIAYUDA_SESSION_KEY, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(VECIAYUDA_SESSION_KEY);
    const inPages = window.location.pathname.includes('/pages/'); window.location.href = inPages ? 'veciayuda-login.html' : 'pages/veciayuda-login.html';
  },

  quickSwitch(roleName) {
    let email = 'maria.rodriguez@gmail.com';
    let targetUrl = 'veciayuda-vecino.html';

    if (roleName === 'admin') {
      email = 'admin@padrelascasas.cl';
      targetUrl = 'veciayuda-admin.html';
    } else if (roleName === 'social') {
      email = 'social@padrelascasas.cl';
      targetUrl = 'veciayuda-social.html';
    } else if (roleName === 'funcionario') {
      email = 'funcionario@padrelascasas.cl';
      targetUrl = 'veciayuda-admin.html';
    } else if (roleName === 'jjvv') {
      email = 'juan.perez@jjvv.cl';
      targetUrl = 'veciayuda-jjvv.html';
    } else {
      email = 'maria.rodriguez@gmail.com';
      targetUrl = 'veciayuda-vecino.html';
    }

    const u = VeciDB.getUserByEmail(email);
    if (u) {
      this.setCurrentUser(u);
      const inPages = window.location.pathname.includes('/pages/'); window.location.href = inPages ? targetUrl : ('pages/' + targetUrl);
    }
  }
};

// ====================================================================
// GENERADOR Y DESCARGADOR DE PDF OFICIAL DE PRUEBA
// ====================================================================
const VeciPDF = {
  descargarCertificado(certData) {
    if (!certData) {
      if (typeof VeciUI !== 'undefined') VeciUI.toast('Error: Datos del certificado no disponibles.', 'danger');
      return;
    }

    // Crear ventana imprimible de alta precisión con marca de agua visible
    const printWin = window.open('', '_blank', 'width=900,height=1000');
    if (!printWin) {
      if (typeof VeciUI !== 'undefined') VeciUI.toast('Por favor habilite las ventanas emergentes (pop-ups) para generar el PDF.', 'warning');
      return;
    }

    const folio = certData.folio || 'PLC-CR-2024-00065';
    const nombre = certData.nombre || 'María Isabel Rodríguez Fuentes';
    const run = certData.run || '12.345.678-9';
    const direccion = certData.direccion || 'Calle Los Aromos 452, Villa Los Pinos, Padre Las Casas';
    const jjvv = certData.jjvv || 'Junta de Vecinos N° 14 "Villa Los Pinos"';
    const motivo = certData.motivo || 'Trámites de Subsidio Habitacional y Becas';
    const emision = certData.fechaEmision || new Date().toISOString().split('T')[0];
    const vencimiento = certData.vigenciaHasta || '2025-01-03';
    const firmante = certData.firmante || 'Juan Pérez Castillo — Presidente JJVV';

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Certificado_Residencia_${folio}.pdf</title>
  <style>
    @page { size: letter; margin: 15mm; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1a202c;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      position: relative;
    }

    /* MARCA DE AGUA DIAGONAL DE PRUEBA */
    .watermark-container {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    .watermark-text {
      transform: rotate(-35deg);
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 4px;
      color: rgba(220, 38, 38, 0.22);
      border: 4px dashed rgba(220, 38, 38, 0.35);
      padding: 18px 36px;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.3;
      user-select: none;
    }

    .header-table { width: 100%; border-bottom: 3px solid #0d9488; padding-bottom: 14px; margin-bottom: 20px; }
    .title-h1 { font-size: 22px; font-weight: 900; color: #134e4a; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .sub-head { font-size: 11px; color: #4b5563; font-weight: 600; text-transform: uppercase; margin-top: 3px; }
    
    .meta-box {
      background: #f0fdfa;
      border: 1px solid #ccfbf1;
      border-radius: 6px;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      font-size: 12.5px;
    }

    .doc-title {
      text-align: center;
      margin: 26px 0;
    }
    .doc-title h2 {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin: 0 0 6px 0;
    }
    .doc-title p {
      font-size: 12px;
      color: #64748b;
      margin: 0;
      font-style: italic;
    }

    .cert-body {
      font-size: 14.5px;
      line-height: 1.85;
      color: #1e293b;
      text-align: justify;
      margin-bottom: 32px;
    }

    .cert-highlight {
      background: #f8fafc;
      border-left: 4px solid #0d9488;
      padding: 14px 20px;
      margin: 18px 0;
      font-size: 15px;
    }

    .signatures-table {
      width: 100%;
      margin-top: 40px;
      border-top: 1px dashed #cbd5e1;
      padding-top: 24px;
    }

    .qr-box {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      padding: 8px;
      text-align: center;
      border-radius: 6px;
      width: 100px;
    }

    .footer-note {
      margin-top: 36px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 10.5px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <!-- MARCA DE AGUA -->
  <div class="watermark-container">
    <div class="watermark-text">
      CERTIFICADO DE PRUEBA<br>
      <span style="font-size:26px; font-weight:700;">SIN VALIDEZ LEGAL — ENTORNO DEMO</span>
    </div>
  </div>

  <div class="no-print" style="background:#0d1b2e; color:#fff; padding:12px 20px; margin:-24px -24px 24px -24px; display:flex; justify-content:space-between; align-items:center;">
    <div style="font-size:14px; font-weight:700; color:#00D4E8;">📄 Vista Previa del Certificado PDF Generado</div>
    <div style="display:flex; gap:10px;">
      <button onclick="window.print()" style="background:#10B981; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-weight:700; cursor:pointer;">
        🖨️ Imprimir / Guardar como PDF
      </button>
      <button onclick="window.close()" style="background:#4B5563; color:#fff; border:none; padding:8px 14px; border-radius:6px; cursor:pointer;">
        Cerrar
      </button>
    </div>
  </div>

  <table class="header-table">
    <tr>
      <td style="width:70px; vertical-align:middle;">
        <div style="font-size:48px;">🏛️</div>
      </td>
      <td style="vertical-align:middle;">
        <div class="sub-head">República de Chile · Región de La Araucanía</div>
        <div class="title-h1">Ilustre Municipalidad de Padre Las Casas</div>
        <div style="font-size:12px; color:#0d9488; font-weight:700; margin-top:2px;">
          ${jjvv} · Plataforma Ciudadana VeciAyuda
        </div>
      </td>
      <td style="text-align:right; vertical-align:middle;">
        <div style="font-size:11px; color:#64748b; text-transform:uppercase;">Sistema B2G Certificado</div>
        <div style="font-size:13px; font-weight:800; color:#1e293b;">Ley N° 19.418 / D.S. N° 58</div>
      </td>
    </tr>
  </table>

  <div class="meta-box">
    <div><strong>FOLIO N°:</strong> <span style="font-family:monospace; font-weight:800; color:#0d9488; font-size:14px;">${folio}</span></div>
    <div><strong>FECHA DE EMISIÓN:</strong> ${emision}</div>
    <div><strong>VIGENCIA:</strong> <span style="color:#b91c1c; font-weight:700;">${vencimiento} (90 días)</span></div>
  </div>

  <div class="doc-title">
    <h2>Certificado Oficial de Residencia</h2>
    <p>Documento digital emitido para acreditación de domicilio legal y comunitario</p>
  </div>

  <div class="cert-body">
    <p>
      El Presidente de la <strong>${jjvv}</strong> de la Comuna de Padre Las Casas, en conjunto con la Dirección de Desarrollo Comunitario de la <strong>Ilustre Municipalidad de Padre Las Casas</strong>, a través del sistema digital centralizado <em>VeciAyuda</em>:
    </p>

    <div class="cert-highlight">
      <strong>CERTIFICA QUE:</strong><br>
      Don/Doña <strong>${nombre}</strong>, Cédula Nacional de Identidad N° <strong style="font-family:monospace;">${run}</strong>, tiene residencia fija, habitual y permanente en:
      <br>
      <span style="font-size:16px; font-weight:800; color:#0f172a;">${direccion}</span>,
      comuna de Padre Las Casas, Región de La Araucanía.
    </div>

    <p>
      Se extiende el presente certificado a solicitud del interesado(a) para ser presentado exclusivamente en trámites de:
      <strong>${motivo}</strong>.
    </p>
    <p>
      El presente instrumento público tiene una validez legal improrrogable de <strong>noventa (90) días corridos</strong> contados desde su fecha de emisión.
    </p>
  </div>

  <table class="signatures-table">
    <tr>
      <td style="width:40%; text-align:center; vertical-align:bottom;">
        <div style="font-family:'Brush Script MT', cursive; font-size:26px; color:#1e40af; margin-bottom:-4px;">${firmante.split('—')[0]}</div>
        <div style="border-top:1.5px solid #64748b; width:200px; margin:0 auto 4px;"></div>
        <div style="font-size:11.5px; font-weight:800;">${firmante}</div>
        <div style="font-size:10px; color:#64748b;">${jjvv}</div>
        <div style="font-size:9.5px; color:#059669; font-weight:700; margin-top:2px;">✓ Firma Electrónica Avanzada (Ley 19.799)</div>
      </td>

      <td style="width:35%; text-align:center; vertical-align:bottom;">
        <div style="font-size:32px; color:#475569; margin-bottom:2px;">🛡️</div>
        <div style="border-top:1.5px solid #64748b; width:180px; margin:0 auto 4px;"></div>
        <div style="font-size:11.5px; font-weight:800;">DIRECCIÓN DIDECO / MINISTRO DE FE</div>
        <div style="font-size:10px; color:#64748b;">I. Municipalidad de Padre Las Casas</div>
        <div style="font-size:9.5px; color:#059669; font-weight:700; margin-top:2px;">✓ Registro B2G PLC Aprobado</div>
      </td>

      <td style="width:25%; text-align:center; vertical-align:middle;">
        <div class="qr-box" style="margin: 0 auto;">
          <svg viewBox="0 0 100 100" width="85" height="85">
            <rect width="100" height="100" fill="#fff"/>
            <rect x="5" y="5" width="28" height="28" fill="#0f172a"/>
            <rect x="9" y="9" width="20" height="20" fill="#fff"/>
            <rect x="13" y="13" width="12" height="12" fill="#0f172a"/>

            <rect x="67" y="5" width="28" height="28" fill="#0f172a"/>
            <rect x="71" y="9" width="20" height="20" fill="#fff"/>
            <rect x="75" y="13" width="12" height="12" fill="#0f172a"/>

            <rect x="5" y="67" width="28" height="28" fill="#0f172a"/>
            <rect x="9" y="71" width="20" height="20" fill="#fff"/>
            <rect x="13" y="75" width="12" height="12" fill="#0f172a"/>

            <rect x="42" y="8" width="6" height="6" fill="#0f172a"/>
            <rect x="52" y="18" width="6" height="6" fill="#0f172a"/>
            <rect x="40" y="42" width="16" height="16" fill="#0d9488"/>
            <rect x="68" y="45" width="8" height="8" fill="#0f172a"/>
            <rect x="78" y="68" width="10" height="10" fill="#0f172a"/>
            <rect x="42" y="75" width="8" height="8" fill="#0f172a"/>
          </svg>
          <div style="font-size:9px; font-weight:800; color:#0f172a; margin-top:2px;">VERIFICAR QR</div>
        </div>
      </td>
    </tr>
  </table>

  <div class="footer-note">
    <span>Para verificar la autenticidad de este certificado ingrese a: <strong>index.html#validador</strong> con el folio <strong>${folio}</strong></span>
    <span>Municipalidad de Padre Las Casas · Región de La Araucanía</span>
  </div>
</body>
</html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  },

  openSocialReportView(folioOrReqFolio) {
    const db = VeciDB.get();
    let req = db.requests.find(r => r.informeSocialFolio === folioOrReqFolio || r.folio === folioOrReqFolio);
    if (!req && db.requests) {
      req = db.requests.find(r => r.folioCertificado === folioOrReqFolio);
    }
    const informe = req ? (req.informeSocial || {
      folio: req.informeSocialFolio || 'PLC-INF-SOC-2024-00128',
      fecha: req.fechaResolucion || req.fechaSolicitud || new Date().toISOString().split('T')[0],
      vecinoNombre: req.vecinoNombre,
      vecinoRun: req.vecinoRun,
      direccion: req.direccion,
      jjvv: req.jjvvNombre,
      asistenteSocial: req.revisorNombre || 'Lic. Camila San Martín Valenzuela',
      cargo: 'Asistente Social DIDECO — Reg. Colegio N° 8492',
      tramoRsh: req.rshTramo || '40% Menores Ingresos',
      grupoFamiliar: req.grupoFamiliar || '4 integrantes',
      tipoTenencia: req.tipoTenencia || 'Arrendataria / Allegada',
      tiempoPLC: req.tiempoResidencia || 'Más de 3 años en la comuna',
      diagnostico: 'Se constata residencia efectiva en el domicilio indicado mediante visita en terreno y revisión de documentación municipal. Cumple condiciones socioeconómicas para acreditación habitacional.',
      conclusion: 'FAVORABLE — Acreditación Social de Residencia otorgada conforme a normativa DIDECO.'
    }) : null;

    if (!informe) {
      if (typeof VeciUI !== 'undefined') VeciUI.toast('Informe Social no encontrado para este folio.', 'danger');
      return;
    }
    this.descargarInformeSocial(informe, req);
  },

  descargarInformeSocial(infData, reqData = {}) {
    const printWin = window.open('', '_blank', 'width=900,height=1000');
    if (!printWin) {
      if (typeof VeciUI !== 'undefined') VeciUI.toast('Por favor habilite las ventanas emergentes (pop-ups) para generar el PDF.', 'warning');
      return;
    }

    const folio = infData.folio || 'PLC-INF-SOC-2024-00128';
    const fecha = infData.fecha || new Date().toISOString().split('T')[0];
    const nombre = infData.vecinoNombre || reqData.vecinoNombre || 'María Isabel Rodríguez Fuentes';
    const run = infData.vecinoRun || reqData.vecinoRun || '12.345.678-9';
    const direccion = infData.direccion || reqData.direccion || 'Calle Los Aromos 452, Villa Los Pinos, Padre Las Casas';
    const jjvv = infData.jjvv || reqData.jjvvNombre || 'JJVV Villa Los Pinos';
    const asistente = infData.asistenteSocial || 'Lic. Camila San Martín Valenzuela';
    const cargo = infData.cargo || 'Asistente Social — DIDECO Área Social y Estratificación';
    const tramoRsh = infData.tramoRsh || '40% Menores Ingresos';
    const grupo = infData.grupoFamiliar || '4 integrantes';
    const tenencia = infData.tipoTenencia || 'Arrendataria / Allegada';
    const tiempoPLC = infData.tiempoPLC || '4 años continuos';
    const diagnostico = infData.diagnostico || 'Se constata residencia efectiva mediante visita en terreno y revisión de cuentas básicas.';
    const conclusion = infData.conclusion || 'FAVORABLE — Procedencia de acreditación y certificación social.';

    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe_Social_${folio}.pdf</title>
  <style>
    @page { size: letter; margin: 15mm; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1a202c;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      position: relative;
    }
    .watermark-container {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    .watermark-text {
      transform: rotate(-35deg);
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 3px;
      color: rgba(220, 38, 38, 0.22);
      border: 4px dashed rgba(220, 38, 38, 0.35);
      padding: 16px 32px;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.3;
      user-select: none;
    }
    .header-table { width: 100%; border-bottom: 3px solid #7c3aed; padding-bottom: 12px; margin-bottom: 18px; }
    .title-h1 { font-size: 20px; font-weight: 900; color: #5b21b6; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .sub-head { font-size: 11px; color: #4b5563; font-weight: 700; text-transform: uppercase; margin-top: 3px; }
    .meta-box {
      background: #f5f3ff;
      border: 1px solid #ddd6fe;
      border-radius: 6px;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      color: #4c1d95;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 16px;
      margin-bottom: 10px;
    }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 12.5px; }
    .data-table td { padding: 6px 10px; border: 1px solid #e2e8f0; }
    .data-table td.label { font-weight: 700; width: 32%; background: #f8fafc; color: #334155; }
    .diag-box {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 12.5px;
      line-height: 1.6;
      color: #1e293b;
      margin-bottom: 16px;
    }
    .conclusion-badge {
      display: inline-block;
      background: #dcfce7;
      border: 1.5px solid #86efac;
      color: #166534;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      margin-top: 6px;
    }
    .firmas-table { width: 100%; margin-top: 28px; }
    .firmas-table td { width: 50%; vertical-align: top; text-align: center; padding: 0 16px; }
    .firma-line { border-top: 1.5px solid #334155; padding-top: 6px; margin-top: 40px; font-size: 12px; }
    .print-bar {
      position: sticky; top: 0; background: #5b21b6; color: #fff; padding: 12px 20px;
      display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .btn-print {
      background: #fff; color: #5b21b6; border: none; padding: 8px 18px; border-radius: 6px;
      font-weight: 800; font-size: 13px; cursor: pointer;
    }
    @media print {
      .print-bar { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="watermark-container">
    <div class="watermark-text">
      INFORME SOCIAL DE PRUEBA<br>
      <span style="font-size:24px; font-weight:700;">SIN VALIDEZ LEGAL · SISTEMA DE DEMOSTRACIÓN</span>
    </div>
  </div>

  <div class="print-bar">
    <div>
      <strong>INFORME SOCIAL DIDECO — DOCUMENTO OFICIAL DE PRUEBA</strong>
      <div style="font-size:11px; opacity:0.9;">Ilustre Municipalidad de Padre Las Casas · Dirección de Desarrollo Comunitario</div>
    </div>
    <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
  </div>

  <table class="header-table">
    <tr>
      <td style="width:75px; vertical-align:middle;">
        <svg viewBox="0 0 100 100" width="65" height="65">
          <circle cx="50" cy="50" r="46" fill="#5b21b6"/>
          <path d="M 50 15 L 80 40 L 70 85 L 30 85 L 20 40 Z" fill="#fff" opacity="0.9"/>
          <path d="M 50 25 L 70 42 L 63 75 L 37 75 L 30 42 Z" fill="#5b21b6"/>
          <circle cx="50" cy="50" r="8" fill="#e9d5ff"/>
          <text x="50" y="80" text-anchor="middle" font-size="8" font-weight="900" fill="#fff">PLC</text>
        </svg>
      </td>
      <td style="vertical-align:middle; padding-left:14px;">
        <h1 class="title-h1">ILUSTRE MUNICIPALIDAD DE PADRE LAS CASAS</h1>
        <div class="sub-head">DIRECCIÓN DE DESARROLLO COMUNITARIO (DIDECO) · DEPARTAMENTO SOCIAL</div>
        <div style="font-size:11px; color:#6b7280; margin-top:2px;">Región de La Araucanía — Sistema Digital VeciAyuda</div>
      </td>
      <td style="vertical-align:middle; text-align:right;">
        <div style="font-size:10px; font-weight:800; color:#5b21b6; text-transform:uppercase;">Folio Expediente</div>
        <div style="font-family:monospace; font-size:14px; font-weight:800; color:#1e1b4b;">${folio}</div>
        <div style="font-size:10px; color:#6b7280;">Fecha: ${fecha}</div>
      </td>
    </tr>
  </table>

  <div style="text-align:center; margin: 18px 0 14px 0;">
    <h2 style="margin:0; font-size:17px; font-weight:900; color:#1e293b; text-transform:uppercase; letter-spacing:0.8px;">
      INFORME SOCIAL Y DE HABITABILIDAD DE RESIDENCIA
    </h2>
    <div style="font-size:11.5px; color:#475569; margin-top:3px;">
      Verificación sociohabitacional para trámites de subsidios, beneficios municipales y acreditación de residencia
    </div>
  </div>

  <div class="meta-box">
    <div><strong>Asistente Social Responsable:</strong> ${asistente}</div>
    <div><strong>Cargo:</strong> ${cargo}</div>
    <div><strong>Estado:</strong> <span style="color:#166534; font-weight:800;">EVALUADO</span></div>
  </div>

  <div class="section-title">1. Identificación del / de la Solicitante</div>
  <table class="data-table">
    <tr>
      <td class="label">Nombre Completo:</td>
      <td><strong>${nombre}</strong></td>
      <td class="label">RUN:</td>
      <td><strong>${run}</strong></td>
    </tr>
    <tr>
      <td class="label">Dirección Particular:</td>
      <td colspan="3">${direccion}</td>
    </tr>
    <tr>
      <td class="label">Junta de Vecinos:</td>
      <td>${jjvv}</td>
      <td class="label">Comuna / Región:</td>
      <td>Padre Las Casas, Región de La Araucanía</td>
    </tr>
  </table>

  <div class="section-title">2. Antecedentes Socioeconómicos y Registro Social de Hogares (RSH)</div>
  <table class="data-table">
    <tr>
      <td class="label">Calificación Socioeconómica:</td>
      <td><strong style="color:#5b21b6;">${tramoRsh}</strong></td>
      <td class="label">Composición Familiar:</td>
      <td>${grupo}</td>
    </tr>
    <tr>
      <td class="label">Tipo de Tenencia de Vivienda:</td>
      <td>${tenencia}</td>
      <td class="label">Permanencia en la Comuna:</td>
      <td>${tiempoPLC}</td>
    </tr>
  </table>

  <div class="section-title">3. Síntesis y Diagnóstico Social en Terreno</div>
  <div class="diag-box">
    ${diagnostico}
  </div>

  <div class="section-title">4. Conclusión Técnica y Dictamen Profesional</div>
  <div style="margin-bottom:20px;">
    <div>De acuerdo a los antecedentes recabados, visita y cotejo de documentos aportados por la parte interesada, la suscrita concluye:</div>
    <div class="conclusion-badge">✓ DICTAMEN: ${conclusion}</div>
  </div>

  <table class="firmas-table">
    <tr>
      <td>
        <div style="border: 2px dashed #a78bfa; padding: 12px; border-radius: 8px; background: #faf5ff; display:inline-block; min-width: 220px;">
          <div style="font-size:10px; font-weight:800; color:#5b21b6;">TIMBRE ELECTRÓNICO MUNICIPAL</div>
          <div style="font-size:9px; color:#6b7280; margin-top:2px;">DIDECO · PADRE LAS CASAS</div>
          <div style="font-size:9px; font-family:monospace; margin-top:4px; color:#4c1d95;">COD: ${folio}-VAL</div>
        </div>
      </td>
      <td>
        <div class="firma-line">
          <strong>${asistente}</strong><br>
          <span>Asistente Social — Licenciada en Trabajo Social</span><br>
          <span style="font-size:10px; color:#6b7280;">DIDECO · I. Municipalidad de Padre Las Casas</span>
        </div>
      </td>
    </tr>
  </table>

  <div style="margin-top:24px; padding-top:10px; border-top:1px solid #e2e8f0; font-size:10px; color:#64748B; display:flex; justify-content:space-between;">
    <span>Documento de evaluación técnica generado en la plataforma municipal VeciAyuda.</span>
    <span>Padre Las Casas · La Araucanía · Chile</span>
  </div>
</body>
</html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  }
};

// ====================================================================
// WIDGET FLOTANTE GLOBAL: TESTER / SWITCHER RÁPIDO DE ROLES
// Permite probar de punta a punta sin tener que escribir credenciales
// ====================================================================
function initVeciAyudaTesterBar() {
  if (document.getElementById('veciayuda-tester-widget')) return;

  const currentUser = VeciAuth.getCurrentUser();

  const container = document.createElement('div');
  container.id = 'veciayuda-tester-widget';
  container.innerHTML = `
    <style>
      #veciayuda-tester-widget {
        position: fixed;
        bottom: 18px;
        right: 18px;
        z-index: 99999;
        font-family: 'Inter', sans-serif;
      }
      .tester-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(6, 13, 26, 0.95);
        border: 1.5px solid #00D4E8;
        border-radius: 9999px;
        padding: 8px 16px;
        color: #F0F6FF;
        box-shadow: 0 8px 24px rgba(0,0,0,0.7), 0 0 16px rgba(0,212,232,0.3);
        cursor: pointer;
        backdrop-filter: blur(12px);
        transition: all 0.2s ease;
      }
      .tester-pill:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.8), 0 0 24px rgba(0,212,232,0.45);
      }
      .tester-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10B981;
        box-shadow: 0 0 8px #10B981;
      }
      .tester-menu {
        display: none;
        position: absolute;
        bottom: calc(100% + 10px);
        right: 0;
        width: 320px;
        background: #0D1B2E;
        border: 1.5px solid rgba(0,212,232,0.35);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.85);
        animation: dropdownIn 0.2s ease;
      }
      .tester-menu.open { display: block; }
      .tester-header {
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        color: #00D4E8;
        letter-spacing: 0.08em;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .tester-user-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 9px 12px;
        border-radius: 8px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        color: #F0F6FF;
        text-align: left;
        cursor: pointer;
        margin-bottom: 6px;
        transition: all 0.15s;
        font-size: 13px;
      }
      .tester-user-btn:hover {
        background: rgba(0,212,232,0.12);
        border-color: rgba(0,212,232,0.4);
      }
      .tester-user-btn.active {
        background: rgba(0,212,232,0.18);
        border-color: #00D4E8;
      }
      .tester-avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 11px;
        flex-shrink: 0;
      }
    </style>

    <div class="tester-pill" onclick="toggleTesterMenu()">
      <span class="tester-dot"></span>
      <span style="font-size:12.5px; font-weight:700;">⚡ Accesos Rápidos de Prueba</span>
      <span style="font-size:11px; color:#94A9C9;">(Rol: ${currentUser ? currentUser.rol.toUpperCase() : 'INVITADO'})</span>
    </div>

    <div class="tester-menu" id="testerMenu">
      <div class="tester-header">
        <span>Cambio de Perfil en 1 Clic</span>
        <button onclick="VeciDB.reset(); if(typeof VeciUI !== 'undefined') VeciUI.toast('Base de datos reiniciada con datos iniciales de prueba.', 'info'); setTimeout(() => location.reload(), 800);" style="background:none; border:none; color:#EF4444; font-size:11px; cursor:pointer;" title="Reiniciar datos demo">↺ Reset</button>
      </div>

      <button class="tester-user-btn ${currentUser && currentUser.rol === 'admin' ? 'active' : ''}" onclick="VeciAuth.quickSwitch('admin')">
        <div class="tester-avatar" style="background:#7C3AED; color:#fff;">AM</div>
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:13px;">🛡️ Administrador Municipal</div>
          <div style="font-size:11px; color:#94A9C9;">Ana Martínez (Control Total)</div>
        </div>
      </button>

      <button class="tester-user-btn ${currentUser && currentUser.rol === 'social' ? 'active' : ''}" onclick="VeciAuth.quickSwitch('social')">
        <div class="tester-avatar" style="background:#EC4899; color:#fff;">CS</div>
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:13px;">🤝 Funcionario Social (DIDECO)</div>
          <div style="font-size:11px; color:#94A9C9;">Lic. Camila San Martín (Informes/Social)</div>
        </div>
      </button>

      <button class="tester-user-btn ${currentUser && currentUser.rol === 'funcionario' ? 'active' : ''}" onclick="VeciAuth.quickSwitch('funcionario')">
        <div class="tester-avatar" style="background:#3B7BF8; color:#fff;">CR</div>
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:13px;">👤 Funcionario Municipal</div>
          <div style="font-size:11px; color:#94A9C9;">Carlos Riquelme (Comunitario)</div>
        </div>
      </button>

      <button class="tester-user-btn ${currentUser && currentUser.rol === 'jjvv' ? 'active' : ''}" onclick="VeciAuth.quickSwitch('jjvv')">
        <div class="tester-avatar" style="background:#10B981; color:#fff;">JP</div>
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:13px;">🏘️ Presidente JJVV</div>
          <div style="font-size:11px; color:#94A9C9;">Juan Pérez (Villa Los Pinos)</div>
        </div>
      </button>

      <button class="tester-user-btn ${currentUser && currentUser.rol === 'vecino' ? 'active' : ''}" onclick="VeciAuth.quickSwitch('vecino')">
        <div class="tester-avatar" style="background:#00D4E8; color:#060D1A;">MR</div>
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:13px;">🏠 Vecina (Solicitante)</div>
          <div style="font-size:11px; color:#94A9C9;">María Rodríguez (Pedir/Descargar)</div>
        </div>
      </button>

      <div style="margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.08); font-size:11px; color:#64748B; text-align:center;">
        Pruebas de punta a punta con persistencia en localStorage
      </div>
    </div>
  `;

  document.body.appendChild(container);
}

function toggleTesterMenu() {
  const m = document.getElementById('testerMenu');
  if (m) m.classList.toggle('open');
}

// Inicializar la barra de tester al cargar cualquier página
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initVeciAyudaTesterBar();
  });
}

// ============================================================================
// VECI-UI: NOTIFICACIONES TOAST, MODALES Y VISOR DE EXPEDIENTES
// ============================================================================
const VeciUI = {
  toastContainer: null,

  init() {
    if (typeof document === 'undefined') return;
    if (!this.toastContainer && !document.getElementById('veci-toast-container')) {
      const c = document.createElement('div');
      c.id = 'veci-toast-container';
      c.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:999999; display:flex; flex-direction:column; gap:10px; max-width:440px; width:calc(100vw - 48px); pointer-events:none;';
      document.body.appendChild(c);
      this.toastContainer = c;
    } else if (!this.toastContainer) {
      this.toastContainer = document.getElementById('veci-toast-container');
    }
  },

  toast(message, type = 'success', duration = 4000) {
    this.init();
    if (!this.toastContainer) {
      console.log('[Toast ' + type + ']: ' + message);
      return;
    }

    const toast = document.createElement('div');
    toast.className = 'veci-toast veci-toast-' + type;
    const accent = type === 'success' ? '#10B981' : (type === 'danger' || type === 'error') ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#00D4E8';
    
    toast.style.cssText = `
      pointer-events:auto;
      display:flex;
      align-items:flex-start;
      gap:12px;
      padding:14px 18px;
      background:#0B132B;
      color:#F8FAFC;
      border-radius:12px;
      border:1px solid ${accent};
      box-shadow:0 12px 35px rgba(0,0,0,0.65), 0 0 20px rgba(0,0,0,0.4);
      font-size:13px;
      line-height:1.45;
      font-family:system-ui, -apple-system, sans-serif;
      transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transform:translateY(15px);
      opacity:0;
    `;

    const icon = type === 'success' ? '✅' : (type === 'danger' || type === 'error') ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';

    toast.innerHTML = `
      <div style="font-size:18px; line-height:1; flex-shrink:0;">${icon}</div>
      <div style="flex:1; font-weight:500; white-space:pre-line;">${message}</div>
      <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#94A9C9; cursor:pointer; font-size:16px; padding:0; line-height:1;">✕</button>
    `;

    this.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    if (duration > 0) {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 320);
      }, duration);
    }
  },

  modalAlert(opts) {
    if (typeof document === 'undefined') return;
    const config = (typeof opts === 'string' ? { message: opts } : opts) || {};
    const title = config.title || 'Aviso Municipal';
    const message = config.message || '';
    const type = config.type || 'info';
    const confirmText = config.confirmText || 'Entendido';
    const onConfirm = config.onConfirm;

    let modal = document.getElementById('veci-modal-alert');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'veci-modal-alert';
      modal.className = 'modal-overlay';
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(6,13,26,0.85); backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; z-index:9999999; padding:16px;';
      document.body.appendChild(modal);
    }

    const icon = type === 'success' ? '✅' : (type === 'danger' || type === 'error') ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    const accent = type === 'success' ? '#10B981' : (type === 'danger' || type === 'error') ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#00D4E8';

    modal.innerHTML = `
      <div class="modal-box" style="background:#0B132B; border:1px solid ${accent}; border-radius:16px; padding:24px; max-width:480px; width:100%; box-shadow:0 25px 60px rgba(0,0,0,0.8); color:#F8FAFC;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px;">
          <div style="font-size:24px;">${icon}</div>
          <h3 style="font-size:17px; font-weight:800; margin:0; color:#F8FAFC;">${title}</h3>
        </div>
        <div style="font-size:13px; line-height:1.6; color:#CBD5E1; margin-bottom:20px; white-space:pre-line;">${message}</div>
        <div style="display:flex; justify-content:flex-end;">
          <button id="veci-modal-alert-btn" class="btn btn-primary" style="min-width:120px; background:${accent}; border-color:${accent}; color:#fff; font-weight:700;">${confirmText}</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    const btn = document.getElementById('veci-modal-alert-btn');
    if (btn) {
      btn.focus();
      btn.onclick = () => {
        modal.style.display = 'none';
        if (typeof onConfirm === 'function') onConfirm();
      };
    }
  },

  openDocViewer(folio, fileIdx = 0, roleContext = 'vecino') {
    if (typeof document === 'undefined') return;
    const r = VeciDB.getRequestByFolio(folio) || {
      folio: folio || 'CERT-DEMO-001',
      vecinoNombre: 'María Isabel Rodríguez Fuentes',
      vecinoRun: '18.456.789-2',
      direccion: 'Calle Los Aromos 452, Villa Los Pinos, Padre Las Casas',
      motivo: 'Subsidio Habitacional (DS49 / DS1)',
      adjuntos: [
        { nombre: 'boleta_cge_luz_oct2024.pdf', tipo: 'Boleta de Servicios', size: '1.2 MB' },
        { nombre: 'contrato_arriendo_vigente.pdf', tipo: 'Contrato de Arriendo', size: '2.4 MB' }
      ]
    };

    let modal = document.getElementById('veci-global-doc-viewer');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'veci-global-doc-viewer';
      modal.className = 'modal-overlay';
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(6,13,26,0.85); backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; z-index:999999; padding:16px;';
      document.body.appendChild(modal);
    }

    const docs = (r.adjuntos && r.adjuntos.length) ? r.adjuntos : [
      { nombre: 'boleta_cge_luz_oct2024.pdf', tipo: 'Boleta de Servicios Básicos', size: '1.2 MB' },
      { nombre: 'contrato_arriendo_vigente.pdf', tipo: 'Contrato Notarial de Arriendo', size: '2.4 MB' }
    ];

    const currentDoc = docs[fileIdx] || docs[0];
    const isLuz = currentDoc.nombre.toLowerCase().includes('luz') || currentDoc.nombre.toLowerCase().includes('cge');
    const isArriendo = currentDoc.nombre.toLowerCase().includes('arriendo') || currentDoc.nombre.toLowerCase().includes('contrato');
    const isRSH = currentDoc.nombre.toLowerCase().includes('rsh') || currentDoc.nombre.toLowerCase().includes('social') || currentDoc.nombre.toLowerCase().includes('cartola');

    let canvasHtml = '';

    if (isLuz) {
      canvasHtml = `
        <div style="background:#fff; color:#1e293b; padding:24px; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-family:Arial, sans-serif; position:relative;">
          <div style="position:absolute; right:20px; top:20px; border:2px dashed #16a34a; color:#16a34a; padding:6px 12px; font-size:11px; font-weight:800; border-radius:6px; transform:rotate(-5deg); background:rgba(22,163,74,0.05);">
            ✓ ACREDITACIÓN CONFORME
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:12px; margin-bottom:16px;">
            <div>
              <div style="font-size:20px; font-weight:900; color:#0284c7;">CGE DISTRIBUCIÓN</div>
              <div style="font-size:10px; color:#64748b;">Compañía General de Electricidad S.A. · Padre Las Casas</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px; color:#64748b;">BOLETA ELECTRÓNICA Nº 849.201.332</div>
              <div style="font-size:12px; font-weight:700;">Vencimiento: 28/11/2024</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; background:#f8fafc; padding:14px; border-radius:6px; margin-bottom:16px; font-size:12px;">
            <div>
              <div style="color:#64748b; font-size:10px; text-transform:uppercase;">Titular / Cliente:</div>
              <div style="font-weight:700; font-size:13px; color:#0f172a;">${r.vecinoNombre}</div>
              <div style="color:#475569;">R.U.N.: ${r.vecinoRun}</div>
              <div style="color:#475569;">N° Cliente: 1983021-4</div>
            </div>
            <div>
              <div style="color:#64748b; font-size:10px; text-transform:uppercase;">Dirección de Suministro:</div>
              <div style="font-weight:700; font-size:13px; color:#0f172a;">${r.direccion}</div>
              <div style="color:#475569;">Comuna: Padre Las Casas, Región de La Araucanía</div>
              <div style="color:#16a34a; font-weight:700; font-size:11px;">● Tarifa BT1 Residencial (Activo)</div>
            </div>
          </div>
          <div style="border:1px solid #e2e8f0; border-radius:6px; padding:12px; margin-bottom:14px; font-size:11px;">
            <div style="font-weight:700; margin-bottom:6px; color:#334155;">Detalle de Cobros del Mes:</div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Consumo Energía Eléctrica (184 kWh):</span><span>$18.420</span></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Administración del Servicio:</span><span>$1.150</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:800; font-size:13px; border-top:1px solid #cbd5e1; padding-top:6px; margin-top:6px; color:#0f172a;">
              <span>TOTAL A PAGAR:</span><span>$19.570</span>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#94a3b8; border-top:1px dashed #cbd5e1; padding-top:8px;">
            <span>Timbre Electrónico SII Res. N° 80 de 2014</span>
            <span style="font-family:monospace; font-weight:700; letter-spacing:2px;">[SII TIMBRE ELECTRONICO VALIDO]</span>
          </div>
        </div>
      `;
    } else if (isArriendo) {
      canvasHtml = `
        <div style="background:#fff; color:#1e293b; padding:26px; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-family:'Times New Roman', Times, serif; position:relative;">
          <div style="position:absolute; right:20px; top:20px; border:2px dashed #0284c7; color:#0284c7; padding:6px 12px; font-size:11px; font-weight:800; border-radius:6px; font-family:sans-serif; transform:rotate(-4deg); background:rgba(2,132,199,0.05);">
            ✓ PROTOCOLIZADO NOTARIAL
          </div>
          <div style="text-align:center; border-bottom:1px solid #000; padding-bottom:10px; margin-bottom:16px;">
            <div style="font-size:15px; font-weight:900; letter-spacing:1px;">NOTARÍA PÚBLICA Y CONSERVADOR</div>
            <div style="font-size:12px; font-style:italic;">Padre Las Casas — Región de La Araucanía</div>
            <div style="font-size:10px; font-family:sans-serif; color:#64748b; margin-top:4px;">Repertorio N° 12.845-2024 · Registro de Contratos</div>
          </div>
          <h4 style="text-align:center; font-size:13px; text-transform:uppercase; margin:14px 0; font-family:sans-serif;">CONTRATO DE ARRENDAMIENTO DE BIEN RAÍZ RESIDENCIAL</h4>
          <p style="font-size:12px; line-height:1.7; text-align:justify; margin-bottom:12px;">
            En Padre Las Casas, comparecen: don <strong>Patricio Alarcón Soto</strong>, RUN 9.384.112-5, en calidad de Arrendador; y doña <strong>${r.vecinoNombre}</strong>, RUN <strong>${r.vecinoRun}</strong>, en calidad de Arrendataria:
          </p>
          <p style="font-size:12px; line-height:1.7; text-align:justify; background:#f8fafc; padding:10px; border-left:3px solid #0284c7; font-family:sans-serif;">
            <strong>PRIMERO:</strong> El Arrendador da en arrendamiento a la Arrendataria, quien acepta para sí, el inmueble ubicado en <strong>${r.direccion}</strong>, comuna de Padre Las Casas. Destino exclusivo: habitación familiar continua.
          </p>
          <div style="margin-top:24px; display:flex; justify-content:space-around; text-align:center; font-size:11px; font-family:sans-serif;">
            <div>
              <div style="border-bottom:1px solid #000; width:150px; margin-bottom:4px; height:24px;"></div>
              <div>Arrendador</div>
            </div>
            <div>
              <div style="border-bottom:1px solid #000; width:150px; margin-bottom:4px; height:24px;"></div>
              <div><strong>${r.vecinoNombre}</strong><br>Arrendataria</div>
            </div>
          </div>
          <div style="margin-top:20px; font-family:sans-serif; font-size:10px; color:#15803d; text-align:center; border:1px solid #86efac; background:#f0fdf4; padding:6px; border-radius:4px;">
            Certifico que las firmas puestas al pie corresponden a las partes. — Padre Las Casas.
          </div>
        </div>
      `;
    } else if (isRSH) {
      canvasHtml = `
        <div style="background:#fff; color:#1e293b; padding:24px; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-family:Arial, sans-serif; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e11d48; padding-bottom:12px; margin-bottom:16px;">
            <div>
              <div style="font-size:18px; font-weight:900; color:#e11d48;">REGISTRO SOCIAL DE HOGARES</div>
              <div style="font-size:10px; color:#64748b;">Ministerio de Desarrollo Social y Familia · Gobierno de Chile</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px; font-weight:700;">CARTOLA HOGAR OFICIAL</div>
              <div style="font-size:10px; color:#64748b;">Padre Las Casas</div>
            </div>
          </div>
          <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; padding:12px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11px; color:#881337;">Tramo Socioeconómico:</div>
              <div style="font-size:18px; font-weight:900; color:#9f1239;">Tramo 40% Menores Ingresos</div>
            </div>
            <div style="background:#e11d48; color:#fff; font-size:11px; font-weight:800; padding:6px 12px; border-radius:20px;">
              VIGENTE
            </div>
          </div>
          <div style="font-size:12px; line-height:1.6; margin-bottom:14px;">
            <div><strong>Jefe(a) de Hogar:</strong> ${r.vecinoNombre} (RUN: ${r.vecinoRun})</div>
            <div><strong>Domicilio Acreditado:</strong> ${r.direccion}</div>
          </div>
        </div>
      `;
    } else {
      canvasHtml = `
        <div style="background:#fff; color:#1e293b; padding:24px; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-family:Arial, sans-serif; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #00D4E8; padding-bottom:12px; margin-bottom:16px;">
            <div>
              <div style="font-size:18px; font-weight:900; color:#0284c7;">AGUAS ARAUCANÍA S.A.</div>
              <div style="font-size:10px; color:#64748b;">Boleta de Servicios Sanitarios · Padre Las Casas</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px; font-weight:700;">Folio: 009281-2024</div>
              <div style="font-size:10px; color:#16a34a;">● Al día</div>
            </div>
          </div>
          <div style="font-size:12px; line-height:1.6; margin-bottom:14px; background:#f8fafc; padding:12px; border-radius:6px;">
            <div><strong>Titular:</strong> ${r.vecinoNombre}</div>
            <div><strong>RUN:</strong> ${r.vecinoRun}</div>
            <div><strong>Dirección de Suministro:</strong> ${r.direccion}</div>
          </div>
          <div style="font-size:11px; display:flex; justify-content:space-between; border-top:1px solid #cbd5e1; padding-top:8px;">
            <span>Total Facturado:</span><strong>$14.390</strong>
          </div>
        </div>
      `;
    }

    const tabsHtml = docs.map((d, i) => `
      <button onclick="VeciUI.openDocViewer('${r.folio}', ${i}, '${roleContext}')" class="btn btn-sm ${i === fileIdx ? 'btn-primary' : 'btn-ghost'}" style="font-size:12px; white-space:nowrap;">
        📄 ${d.nombre}
      </button>
    `).join('');

    let actionBtnsHtml = '';
    if (roleContext === 'jjvv') {
      actionBtnsHtml = `
        <button class="btn btn-danger btn-sm" onclick="VeciUI.closeDocViewer(); if(typeof abrirModalRechazoDesdeVisor === 'function') { abrirModalRechazoDesdeVisor(); } else if(typeof abrirModalRechazarJJVV === 'function') { abrirModalRechazarJJVV('${r.folio}'); }">❌ Rechazar con Motivo</button>
        <button class="btn btn-success btn-sm" onclick="VeciUI.closeDocViewer(); if(typeof abrirModalAprobarDesdeVisor === 'function') { abrirModalAprobarDesdeVisor(); } else if(typeof abrirModalAprobarJJVV === 'function') { abrirModalAprobarJJVV('${r.folio}'); }">✅ Aprobar Solicitud</button>
      `;
    } else if (roleContext === 'admin') {
      actionBtnsHtml = `
        <button class="btn btn-danger btn-sm" onclick="VeciUI.closeDocViewer(); if(typeof abrirModalRechazarAdmin === 'function') abrirModalRechazarAdmin('${r.folio}');">❌ Rechazar</button>
        <button class="btn btn-warning btn-sm" onclick="VeciUI.closeDocViewer(); if(typeof abrirModalDerivarAdmin === 'function') abrirModalDerivarAdmin('${r.folio}');">🔄 Derivar JJVV</button>
        <button class="btn btn-success btn-sm" onclick="VeciUI.closeDocViewer(); if(typeof abrirModalAprobarAdmin === 'function') abrirModalAprobarAdmin('${r.folio}');">✅ Aprobar</button>
      `;
    } else if (roleContext === 'social') {
      actionBtnsHtml = `
        <button class="btn btn-primary btn-sm" onclick="VeciUI.closeDocViewer(); if(typeof abrirModalEmitirInforme === 'function') abrirModalEmitirInforme('${r.folio}');">📋 Emitir Informe Social</button>
      `;
    }

    modal.innerHTML = `
      <div class="modal-box" style="max-width:880px; width:95%; max-height:92vh; display:flex; flex-direction:column; padding:22px; background:#0B132B; border:1px solid rgba(0,212,232,0.4); border-radius:16px; box-shadow:0 25px 60px rgba(0,0,0,0.8); color:#F8FAFC;">
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:40px; height:40px; border-radius:10px; background:rgba(0,212,232,0.15); border:1px solid rgba(0,212,232,0.3); display:flex; align-items:center; justify-content:center; font-size:20px;">
              📁
            </div>
            <div>
              <h3 style="font-size:16px; font-weight:800; margin:0; color:#F8FAFC;">Expediente de Respaldo: ${r.folio}</h3>
              <div style="font-size:12px; color:#94A9C9;">Solicitante: ${r.vecinoNombre} · RUN: ${r.vecinoRun}</div>
            </div>
          </div>
          <button onclick="VeciUI.closeDocViewer()" class="btn btn-ghost btn-sm" style="font-size:18px; padding:4px 10px;">✕</button>
        </div>

        <!-- Document Tabs -->
        <div style="display:flex; gap:8px; margin-bottom:12px; overflow-x:auto; padding-bottom:4px;">
          ${tabsHtml}
        </div>

        <!-- Canvas Container -->
        <div style="flex:1; overflow-y:auto; background:#060D1A; border:1px solid rgba(0,212,232,0.25); border-radius:12px; padding:18px; min-height:360px;">
          ${canvasHtml}
        </div>

        <!-- Footer -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:14px; margin-top:14px; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge" style="background:rgba(16,185,129,0.15); color:#10B981; font-size:11px; font-weight:700;">✓ Respaldo Verificado Ley 19.628</span>
            <button class="btn btn-ghost btn-sm" onclick="VeciUI.downloadSimulatedDoc('${currentDoc.nombre}')">📥 Descargar Copia</button>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn btn-ghost btn-sm" onclick="VeciUI.closeDocViewer()">Cerrar Visor</button>
            ${actionBtnsHtml}
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  },

  closeDocViewer() {
    const modal = document.getElementById('veci-global-doc-viewer');
    if (modal) modal.style.display = 'none';
  },

  downloadSimulatedDoc(filename) {
    const content = `REPÚBLICA DE CHILE
ILUSTRE MUNICIPALIDAD DE PADRE LAS CASAS
SISTEMA DE GESTIÓN VECIAYUDA

DOCUMENTO DE RESPALDO ACREDITADO
Archivo: ${filename}
Fecha de verificación digital: ${new Date().toLocaleString('es-CL')}
Estado: Conforme a normativa de acreditación domiciliaria municipal.
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'documento_respaldo_verificado.txt';
    a.click();
    URL.revokeObjectURL(url);
    this.toast('📥 Descarga iniciada: ' + filename, 'info');
  }
};
