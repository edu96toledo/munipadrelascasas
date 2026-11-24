# VeciAyuda — Ilustre Municipalidad de Padre Las Casas

Plataforma digital B2G (Business-to-Government) para la gestión, emisión, trazabilidad y validación digital de certificados de residencia e informes sociales.

🌐 **Sitio Web en Vivo (GitHub Pages):**  
[https://edu96toledo.github.io/munipadrelascasas/](https://edu96toledo.github.io/munipadrelascasas/)

---

## 📁 Estructura del Proyecto

```
munipadrelascasas/
├── index.html                      # Portal ciudadano / Landing municipal (punto de entrada)
├── README.md                       # Documentación general y arquitectura del sistema
├── .gitignore                      # Exclusiones de Git
│
├── css/
│   └── style.css                   # Sistema de diseño Mobile-First y tema oscuro institucional
│
├── js/
│   ├── app.js                      # Orquestador y Fachada ES6 central
│   ├── veciayuda-core.js           # Bundle de compatibilidad hacia atrás
│   └── modules/                    # Módulos limpios ES6
│       ├── validators.js           # Módulo 11 (RUN chileno) y censura Ley 19.628
│       ├── storage.js              # Almacenamiento IndexedDB y compresión de adjuntos
│       ├── state-machine.js        # Máquina de estados formal y auditoría inmutable
│       ├── auth.js                 # Autenticación RBAC y AuthGuard por vista
│       ├── db.js                   # Base de datos cliente reactiva (VeciDB)
│       ├── pdf.js                  # Motor VeciPDF: certificados, sellos y firmas
│       └── ui.js                   # Toasts, modales accesibles y visor de expedientes
│
├── pages/                          # Vistas del sistema protegidas con AuthGuard
│   ├── veciayuda-login.html        # Inicio de sesión con accesos rápidos de prueba
│   ├── veciayuda-registro.html     # Registro de vecinos con validación de RUN chileno
│   ├── veciayuda-recuperar.html    # Recuperación de contraseñas
│   ├── veciayuda-perfil.html       # Perfil del usuario y datos de contacto
│   ├── veciayuda-vecino.html       # [Rol: Vecino] Solicitudes y descargas de certificados
│   ├── veciayuda-jjvv.html         # [Rol: Presidente/Secretario JJVV] Bandeja comunitaria
│   ├── veciayuda-funcionario.html  # [Rol: Funcionario Municipal] Derivación y supervisión
│   ├── veciayuda-social.html       # [Rol: Social DIDECO] Informes de vulnerabilidad y visitas
│   ├── veciayuda-admin.html        # [Rol: Administrador] Control total y JJVV
│   ├── veciayuda-verificar.html    # Validador público de Folios y códigos QR (Ley 19.628)
│   └── veciayuda-landing.html      # Versión alternativa de la landing municipal
│
└── archive/                        # Prototipos iniciales archivados
    ├── admin.html
    ├── bandeja.html
    └── login.html
```

---

## 👥 Perfiles y Cuentas de Acceso de Prueba

La plataforma incluye un panel flotante de **"⚡ Accesos Rápidos de Prueba"** (esquina inferior derecha) y botones rápidos en el login:

1. **🛡️ Administrador Municipal** (`admin@padrelascasas.cl` / `admin`)
   - Control total, gestión de Juntas de Vecinos, derivación de trámites, métricas y auditoría.
2. **🤝 Funcionario Social DIDECO** (`social@padrelascasas.cl` / `admin`)
   - Lic. Camila San Martín: evaluación por tramos RSH, visitas a terreno y emisión de Informes Sociales oficiales.
3. **👤 Funcionario Municipal** (`funcionario@padrelascasas.cl` / `admin`)
   - Carlos Riquelme Sandoval: supervisión territorial, derivación a JJVV o DIDECO e inspección de expedientes.
4. **🏘️ Presidente Junta de Vecinos** (`jjvv@padrelascasas.cl` / `admin`)
   - Juan Pérez Castillo: revisión de expedientes domiciliarios (boletas CGE, contratos notariales), aprobación o rechazo fundado.
5. **🏠 Vecina Solicitante** (`maria.rodriguez@gmail.com` / `demo1234`)
   - María Rodríguez: formulario guiado, seguimiento de solicitudes, corrección de observaciones y descarga de PDF en su equipo.

---

## 🔍 Validador Público de Folios y Códigos QR

- **Ruta Pública:** [pages/veciayuda-verificar.html](pages/veciayuda-verificar.html)
- Accesible por terceros (Bancos, SERVIU, Notarías, Carabineros) sin requerir inicio de sesión.
- Lee automáticamente folios pasados por parámetro URL `?folio=PLC-CR-2024-00065`.
- **Cumplimiento Ley N° 19.628:** Muestra el estado de vigencia y los datos de identidad y domicilio parcialmente censurados para resguardo de la privacidad del vecino.
