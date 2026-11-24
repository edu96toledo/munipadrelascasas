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

  /**
   * Genera y descarga un archivo binario PDF real directamente a la computadora
   */
  descargarArchivoPDFDirecto(filename, title, lines) {
    const textStream = [
      'BT',
      '/F1 15 Tf',
      '40 790 Td',
      `(${title}) Tj`,
      '/F1 10 Tf',
      '0 -24 Td'
    ];

    lines.forEach(line => {
      const safe = String(line)
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Compatibilidad caracteres estándar PDF
      textStream.push(`(${safe}) Tj`);
      textStream.push('0 -16 Td');
    });

    textStream.push('ET');
    const streamData = textStream.join('\n');
    const streamLength = new TextEncoder().encode(streamData).length;

    let pdf = '%PDF-1.4\n';
    const offsets = [];

    function addObj(content) {
      offsets.push(pdf.length);
      pdf += content + '\n';
    }

    addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
    addObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
    addObj('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj');
    addObj(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamData}\nendstream\nendobj`);
    addObj('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');

    const xrefOffset = pdf.length;
    pdf += 'xref\n0 6\n0000000000 65535 f \n';
    offsets.forEach(off => {
      pdf += String(off).padStart(10, '0') + ' 00000 n \n';
    });
    pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.pdf') ? filename : (filename + '.pdf');
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 1000);

    if (typeof VeciUI !== 'undefined' && typeof VeciUI.toast === 'function') {
      VeciUI.toast(`📥 Descargando archivo ${a.download} en tu computadora...`, 'success');
    }
  },

  descargarCertificado(certData) {
    if (!certData) {
      if (typeof VeciUI !== 'undefined') VeciUI.toast('Error: Datos del certificado no disponibles.', 'danger');
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

    const lines = [
      'REPUBLICA DE CHILE - REGION DE LA ARAUCANIA',
      'SISTEMA B2G DIGITAL VECIAYUDA - MUNICIPALIDAD DE PADRE LAS CASAS',
      '================================================================================',
      'CERTIFICADO OFICIAL DE RESIDENCIA DOMICILIARIA',
      '================================================================================',
      `FOLIO OFICIAL: ${folio}`,
      `FECHA EMISION: ${emision}       VIGENCIA: 90 DIAS CORRIDOS (HASTA ${vencimiento})`,
      '',
      'CERTIFICACION COMUNITARIA Y MUNICIPAL:',
      `El Presidente de la ${jjvv}, en conjunto con la Direccion de Desarrollo`,
      'Comunitario (DIDECO) de la Ilustre Municipalidad de Padre Las Casas, certifican que:',
      '',
      `DON/DONA: ${nombre}`,
      `CEDULA NACIONAL DE IDENTIDAD (RUN): ${run}`,
      'Tiene residencia fija, permanente y continua en el siguiente domicilio:',
      `DIRECCION: ${direccion}`,
      'Comuna de Padre Las Casas, Region de La Araucania.',
      '',
      `FINALIDAD DECLARADA: ${motivo}`,
      '',
      '--------------------------------------------------------------------------------',
      '** CERTIFICADO DE PRUEBA - SIN VALIDEZ LEGAL - ENTORNO DE TESTEO CIUDADANO **',
      '--------------------------------------------------------------------------------',
      `Firma Digital Responsable: ${firmante}`,
      `Verificacion Publica QR: https://edu96toledo.github.io/munipadrelascasas/pages/veciayuda-verificar.html?folio=${folio}`,
      'Conforme a Ley 19.418 de Juntas de Vecinos y D.S. N 58.'
    ];

    this.descargarArchivoPDFDirecto(`Certificado_Residencia_${folio}.pdf`, 'ILUSTRE MUNICIPALIDAD DE PADRE LAS CASAS', lines);
  },

  descargarInformeSocial(infData) {
    if (!infData) {
      if (typeof VeciUI !== 'undefined') VeciUI.toast('Informe Social no encontrado para este folio.', 'danger');
      return;
    }

    const folio = infData.folio || 'PLC-INF-2024-0001';
    const lines = [
      'REPUBLICA DE CHILE - ILUSTRE MUNICIPALIDAD DE PADRE LAS CASAS',
      'DIRECCION DE DESARROLLO COMUNITARIO (DIDECO) - TRABAJO SOCIAL',
      '================================================================================',
      'INFORME SOCIAL OFICIAL DE VULNERABILIDAD Y RESIDENCIA',
      '================================================================================',
      `FOLIO INFORME: ${folio}        FECHA EVALUACION: ${infData.fecha || '2024-11-20'}`,
      `SOLICITANTE: ${infData.vecinoNombre} (RUN: ${infData.vecinoRun})`,
      `DOMICILIO SOCIAL: ${infData.direccion || 'Padre Las Casas'}`,
      `TRAMO RSH: ${infData.tramoRSH || 'Tramo 40% Vulnerabilidad'}`,
      `PUNTAJE SOCIOHABITACIONAL: ${infData.puntajeSocial || 88} / 100`,
      `ESTADO RESIDENCIAL: ${infData.estadoVivienda || 'Vivienda Familiar Acreditada'}`,
      '',
      'CONCLUSION TECNICA DEL ASISTENTE SOCIAL:',
      infData.diagnostico || 'Se constata residencia efectiva del grupo familiar en la direccion acreditada.',
      '',
      '--------------------------------------------------------------------------------',
      '** INFORME SOCIAL DE PRUEBA - SIN VALIDEZ LEGAL - ENTORNO TESTEO **',
      '--------------------------------------------------------------------------------',
      `Evaluador Responsable: ${infData.profesional || 'Lic. Camila San Martin - Trabajadora Social DIDECO'}`,
      'Validacion: https://edu96toledo.github.io/munipadrelascasas/pages/veciayuda-verificar.html'
    ];

    this.descargarArchivoPDFDirecto(`Informe_Social_DIDECO_${folio}.pdf`, 'MUNICIPALIDAD DE PADRE LAS CASAS - DIDECO', lines);
  }
};


function AuthGuard(allowedRoles = []) {
  if (typeof window === 'undefined') return true;
  const user = VeciAuth.getCurrentUser();
  const inPages = window.location.pathname.includes('/pages/');
  const loginUrl = inPages ? 'veciayuda-login.html' : 'pages/veciayuda-login.html';

  if (!user) {
    window.location.replace(loginUrl);
    return false;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    let dest = 'veciayuda-vecino.html';
    if (user.rol === 'admin') dest = 'veciayuda-admin.html';
    else if (user.rol === 'social') dest = 'veciayuda-social.html';
    else if (user.rol === 'funcionario') dest = 'veciayuda-funcionario.html';
    else if (user.rol === 'jjvv') dest = 'veciayuda-jjvv.html';

    const redirectUrl = inPages ? dest : ('pages/' + dest);
    try {
      sessionStorage.setItem('VECIAYUDA_FLASH_MSG', JSON.stringify({
        text: 'Acceso restringido: Redirigido al panel de su rol (' + user.rol.toUpperCase() + ').',
        type: 'warning'
      }));
    } catch (e) {}

    window.location.replace(redirectUrl);
    return false;
  }
  return true;
}
