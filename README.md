# FieldOps Frontend

Bienvenido al frontend de **FieldOps**, una plataforma moderna para la gestión y validación de reportes de campo, diseñada para equipos de supervisión, ingeniería y gestión territorial.

## 🚀 Tecnologías principales

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) (desarrollo ultrarrápido)
- [Sass/SCSS](https://sass-lang.com/) para estilos avanzados y responsivos
- [React Router](https://reactrouter.com/) para navegación SPA
- [React Icons](https://react-icons.github.io/react-icons/) para iconografía profesional
- Arquitectura de componentes reutilizables y hooks personalizados

## ✨ Características destacadas

- **Login tecnológico y cálido:**
  - Diseño responsive, moderno, con fondo geométrico, colores de marca y recordatorio de usuario.
- **Dashboard de supervisor y admin:**
  - Métricas visuales, cards coloridos, filtros avanzados y tablas interactivas.
- **Gestión de reportes:**
  - Filtros por tipo (Postes, Predios), estado, encargado, fecha y búsqueda instantánea.
- **Exportación de datos:**
  - Descarga de reportes en Excel, CSV y PDF.
- **Modal de detalle:**
  - Visualización y validación de reportes con historial y fotos.
- **Sidebar inteligente:**
  - Navegación por secciones con resaltado automático y filtros contextuales.
- **Estilos adaptativos:**
  - Interfaz 100% responsive y accesible, con soporte para dispositivos móviles y escritorio.
- **Configuración y gestión de usuarios:**
  - Administración de supervisores, encargados, zonas, distritos y más.

## 📦 Estructura del proyecto

```
src/
├── assets/                # Imágenes y recursos estáticos
├── components/            # Componentes reutilizables (Table, Card, Sidebar, etc.)
│   └── layout/Sidebar/    # Sidebar de navegación
├── hooks/                 # Hooks personalizados (useAuth, etc.)
├── pages/                 # Vistas principales (auth, supervisor, admin, etc.)
│   ├── auth/              # Login y autenticación
│   ├── admin/             # Panel de administración
│   └── supervisor/        # Dashboard, Reports, etc.
├── styles/                # Variables y estilos globales SCSS
├── utils/                 # Utilidades (exportación, helpers, etc.)
└── routes.jsx             # Definición de rutas principales
```

## 🛠️ Instalación y uso

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/fieldops-frontend.git
   cd fieldops-frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Inicia el entorno de desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abre en tu navegador:**
   [http://localhost:5173](http://localhost:5173)

## 🧑‍💻 Scripts útiles

- `dev` – Inicia el servidor de desarrollo con HMR.
- `build` – Genera la versión optimizada para producción.
- `preview` – Previsualiza el build de producción.
- `lint` – Ejecuta ESLint para mantener la calidad del código.

## 📝 Notas de desarrollo

- El login recuerda el DNI si marcas "Recordar DNI".
- El diseño es adaptable y mantiene la identidad visual de la marca (azul y naranja).
- Puedes personalizar los colores y el fondo en `src/pages/auth/Login.scss`.
- Los filtros y la navegación del sidebar están sincronizados con la URL.
- El proyecto está listo para integrarse con APIs RESTful.

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para el equipo de FieldOps.

---

**¿Dudas o sugerencias?**
Contacta al equipo de desarrollo o abre un issue en el repositorio.
