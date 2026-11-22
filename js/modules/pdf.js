/**
 * VeciAyuda — Módulo Generador de Certificados e Informes PDF (VeciPDF)
 * Ilustre Municipalidad de Padre Las Casas
 */

export const VeciPDF = {

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
