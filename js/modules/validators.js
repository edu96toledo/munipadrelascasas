/**
 * VeciAyuda — Módulo de Validaciones y Sanitización (Chile)
 * Ilustre Municipalidad de Padre Las Casas
 */

export const Validators = {
  /**
   * Limpia el RUN eliminando puntos, guiones y espacios, dejando todo en mayúsculas.
   */
  cleanRUT(rut) {
    if (!rut) return '';
    return String(rut).replace(/[^0-9kK]/g, '').toUpperCase();
  },

  /**
   * Valida un RUN chileno mediante el algoritmo oficial Módulo 11.
   */
  validarRUT(rut) {
    const clean = this.cleanRUT(rut);
    if (!clean || clean.length < 8 || clean.length > 9) return false;

    const cuerpo = clean.slice(0, -1);
    const dvIngresado = clean.slice(-1).toUpperCase();

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvCalculado = '';
    if (dvEsperado === 11) dvCalculado = '0';
    else if (dvEsperado === 10) dvCalculado = 'K';
    else dvCalculado = String(dvEsperado);

    return dvCalculado === dvIngresado;
  },

  /**
   * Formatea un RUN chileno al estándar visual oficial: 12.345.678-K
   */
  formatRUT(rut) {
    const clean = this.cleanRUT(rut);
    if (!clean || clean.length < 2) return clean || '';

    const cuerpo = clean.slice(0, -1);
    const dv = clean.slice(-1).toUpperCase();

    let formatted = '';
    let count = 0;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      formatted = cuerpo[i] + formatted;
      count++;
      if (count === 3 && i > 0) {
        formatted = '.' + formatted;
        count = 0;
      }
    }
    return `${formatted}-${dv}`;
  },

  /**
   * Censura datos sensibles para cumplimiento estricto de la Ley 19.628
   * de Protección de la Vida Privada (usado en validador público).
   */
  maskData(value, type = 'text') {
    if (!value) return '—';
    const str = String(value).trim();

    switch (type) {
      case 'run': {
        const clean = this.cleanRUT(str);
        if (clean.length < 8) return '**.***.***-*';
        const formatted = this.formatRUT(clean);
        // Formato: 12.345.678-9 -> 12.***.***-9
        return formatted.replace(/^(\d{1,2})\.(\d{3})\.(\d{3})-([0-9K])$/, '$1.***.***-$4');
      }

      case 'name': {
        // María Isabel Rodríguez Fuentes -> M***a I***l R***z F***s
        return str.split(/\s+/).map(part => {
          if (part.length <= 2) return part[0] + '*';
          return part[0] + '***' + part[part.length - 1];
        }).join(' ');
      }

      case 'address': {
        // Calle Los Aromos 452 -> Calle L** A*** 452
        const parts = str.split(' ');
        if (parts.length <= 2) return str.slice(0, 4) + '***';
        return parts.map((p, idx) => {
          if (idx === 0 || /^\d+$/.test(p)) return p; // Mantiene "Calle" y número
          if (p.length <= 3) return p;
          return p.slice(0, 2) + '***';
        }).join(' ');
      }

      case 'email': {
        // usuario@dominio.cl -> u***o@dominio.cl
        const [user, domain] = str.split('@');
        if (!domain) return '***@***.cl';
        const maskedUser = user.length <= 2 ? user[0] + '***' : user[0] + '***' + user[user.length - 1];
        return `${maskedUser}@${domain}`;
      }

      default:
        return str.slice(0, 3) + '***';
    }
  },

  /**
   * Validación simple de correo electrónico
   */
  validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  },

  /**
   * Validación de teléfono chileno (+569 o 9 dígitos)
   */
  validarTelefono(tel) {
    const clean = String(tel).replace(/[^0-9]/g, '');
    return clean.length >= 8 && clean.length <= 11;
  }
};
