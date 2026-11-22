/**
 * VeciAyuda — Módulo Generador de Certificados e Informes PDF (VeciPDF)
 * Ilustre Municipalidad de Padre Las Casas
 */

export const VeciPDF = {
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
    <span>Para verificar la autenticidad de este certificado ingrese a: <strong>pages/veciayuda-verificar.html</strong> con el folio <strong>${folio}</strong></span>
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
};
