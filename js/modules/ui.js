/**
 * VeciAyuda — Módulo de Interfaz de Usuario, Toasts, Visor de Documentos y Tester Bar
 * Ilustre Municipalidad de Padre Las Casas
 */

export const VeciUI = {
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

export function initVeciAyudaTesterBar() {
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
