# VeciAyuda — Ilustre Municipalidad de Padre Las Casas

Plataforma digital B2G (Business-to-Government) para la gestión, emisión y validación digital de certificados de residencia y vinculación comunitaria.

🌐 **Sitio Web en Vivo (GitHub Pages):**  
[https://edu96toledo.github.io/munipadrelascasas/](https://edu96toledo.github.io/munipadrelascasas/)

---

## 📁 Estructura del Proyecto

```
munipadrelascasas/
├── index.html                  # Portal ciudadano / Landing municipal (punto de entrada)
├── README.md                   # Documentación general del repositorio
├── .gitignore                  # Reglas de exclusión para Git
├── css/
│   └── style.css               # Estilos globales, temas institucionales y componentes
├── js/
│   └── veciayuda-core.js       # Base de datos persistente (localStorage), Auth, PDF y UI
├── pages/                      # Módulos y vistas del sistema
│   ├── veciayuda-login.html    # Inicio de sesión con accesos rápidos de prueba
│   ├── veciayuda-registro.html # Registro de vecinos con validación de RUN chileno
│   ├── veciayuda-recuperar.html# Recuperación de clave municipal
│   ├── veciayuda-perfil.html   # Perfil de usuario y datos de contacto
│   ├── veciayuda-vecino.html   # Panel de solicitudes y descargas del vecino
│   ├── veciayuda-jjvv.html     # Panel de gestión de Junta de Vecinos
│   ├── veciayuda-admin.html    # Panel de control y administración municipal
│   ├── veciayuda-social.html   # Panel DIDECO (Asistente Social) e informes sociales
│   └── veciayuda-landing.html  # Versión alternativa de la landing municipal
└── archive/                    # Prototipos iniciales archivados
    ├── admin.html
    ├── bandeja.html
    └── login.html
```

---

## 👥 Perfiles y Cuentas de Acceso de Prueba

La plataforma incluye un panel flotante de **"Accesos Rápidos de Prueba"** (esquina inferior derecha) y botones rápidos en el login:

1. **🛡️ Administrador Municipal** (`admin@padrelascasas.cl`)
   - Control total, gestión de Juntas de Vecinos, derivación de trámites, métricas y auditoría.
2. **🤝 Funcionario Social DIDECO** (`social@padrelascasas.cl`)
   - Lic. Camila San Martín: evaluación por tramos RSH, visitas a terreno y emisión de Informes Sociales oficiales.
3. **👤 Funcionario Municipal** (`funcionario@padrelascasas.cl`)
   - Carlos Riquelme: revisión y derivación técnica comunitaria.
4. **🏘️ Presidente Junta de Vecinos** (`jjvv@padrelascasas.cl`)
   - Juan Pérez: revisión de expedientes domiciliarios (boletas, contratos), aprobación o rechazo fundado.
5. **🏠 Vecina Solicitante** (`maria.rodriguez@gmail.com`)
   - María Rodríguez: formulario guiado, seguimiento de solicitudes, corrección de observaciones y descarga de PDF con marca de agua reglamentaria.

---

## ⚙️ Tecnologías Utilizadas

- **HTML5 & CSS3**: Arquitectura Mobile-First, accesible y adaptativa (Dark Theme institucional).
- **JavaScript Moderno (ES6+)**: Base de datos reactiva en cliente con `localStorage` (`VeciDB`), autenticación por roles (RBAC) y validación de RUN chileno (Módulo 11).
- **Generación de Documentos**: Motor PDF cliente (`VeciPDF`) con folio único, marca de agua legal, sellos institucionales y códigos QR de validación.
