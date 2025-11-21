
# Explicación del Proyecto CCredoma

## Visión General del Proyecto

CCredoma es una aplicación web completa de gestión de bienes raíces comerciales, diseñada para administrar centros comerciales. La plataforma permite a los administradores de centros comerciales gestionar locales comerciales, contratos de alquiler y solicitudes de información. También proporciona a los inquilinos (propietarios de locales) un portal para ver sus contratos y su historial de pagos.

## Tecnologías Utilizadas

### Frontend

- **Framework:** React
- **Enrutamiento:** Wouter
- **Componentes UI:** Componentes Radix UI, Lucide React (iconos)
- **Estilos:** Tailwind CSS
- **Gestión de Estado:** TanStack React Query
- **Formularios:** React Hook Form con Zod para validación
- **Herramienta de Construcción:** Vite

### Backend

- **Framework:** Express.js
- **ORM de Base de Datos:** Drizzle ORM con base de datos PostgreSQL
- **Autenticación:** Passport.js para la autenticación de usuarios
- **Gestión de Sesiones:** express-session con connect-pg-simple
- **WebSockets:** ws para comunicación en tiempo real
- **Base de Datos:** Supabase (PostgreSQL)

### Compartido

- **Validación de Esquemas:** Zod

## Estructura del Proyecto

El proyecto está organizado en una estructura monorepo con tres directorios principales:

- **/client:** Contiene el código fuente del frontend de React.
- **/server:** Contiene el código fuente del backend de Express.js.
- **/shared:** Contiene código compartido entre el frontend y el backend (por ejemplo, esquemas de validación de Zod).

## Funcionalidad Principal

La aplicación cuenta con diferentes áreas funcionales según el rol del usuario:

### Área Pública

- **Página de Inicio:** Una página de destino pública para usuarios no autenticados.
- **Catálogo de Locales:** Permite a los visitantes navegar por los locales comerciales disponibles.
- **Solicitud de Información:** Un formulario para que los visitantes soliciten más información sobre un local.

### Área de Administración (Rol: `CentroComercialAdmin`)

- **Dashboard:** Un panel de control con una visión general de las principales métricas del sistema.
- **Gestión de Locales:** CRUD (Crear, Leer, Actualizar, Eliminar) para locales comerciales.
- **Gestión de Contratos:** Ver y gestionar contratos de alquiler.
- **Gestión de Solicitudes:** Ver y gestionar las solicitudes de información de clientes potenciales.

### Área del Propietario (Rol: `LocalOwner`)

- **Dashboard:** Un panel de control personalizado donde los inquilinos pueden:
  - Ver los detalles de su contrato de alquiler activo.
  - Consultar su historial de pagos.

### Área de Desarrollador (Rol: `SystemDeveloper`)

- **Dashboard:** Un panel de control con estadísticas del sistema, como el número total de usuarios, locales, contratos y pagos.

## Esquema de la Base de Datos

La base de datos (gestionada en Supabase) incluye las siguientes tablas principales:

- `locales_comerciales`: Almacena información sobre los locales comerciales.
- `contratos_alquiler`: Almacena información sobre los contratos de alquiler.
- `pagos_alquiler`: Registra los pagos de alquiler.
- `solicitudes_informacion`: Almacena las solicitudes de información de clientes potenciales.
- `usuarios`: Gestiona la información y los roles de los usuarios.
- `centros_comerciales`: Almacena información sobre los centros comerciales.

## Cómo Empezar

Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ccredoma
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto.
   - Añade las siguientes variables de entorno, reemplazando los valores con tus credenciales de Supabase:
     ```
     SUPABASE_URL=URL_DE_TU_PROYECTO_SUPABASE
     SUPABASE_KEY=TU_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY=TU_SUPABASE_SERVICE_ROLE_KEY
     ```

4. **Ejecuta la aplicación en modo de desarrollo:**
   ```bash
   npm run dev
   ```

   Esto iniciará el servidor de backend y el servidor de desarrollo de Vite para el frontend. La aplicación estará disponible en `http://localhost:5173`.
