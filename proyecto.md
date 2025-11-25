# Proyecto CCredoma: Documentación Técnica y Funcional

## 1. Introducción

### Visión General del Proyecto
**CCredoma** es una plataforma de software integral diseñada específicamente para optimizar la administración y operación de centros comerciales. Nuestra solución busca centralizar y automatizar los procesos clave de gestión de propiedades, alquileres, contratos y comunicaciones, transformando la manera en que los administradores, inquilinos y potenciales clientes interactúan con el espacio comercial.

### Propósito y Audiencia Objetivo
El propósito de CCredoma es proporcionar una herramienta moderna y eficiente para la gestión de centros comerciales. La plataforma está dirigida a tres grupos de usuarios principales:
- **Administradores del Centro Comercial:** Para gestionar la operativa diaria del centro comercial.
- **Propietarios/Inquilinos de Locales:** Para acceder a la información de sus alquileres y comunicarse con la administración.
- **Potenciales Clientes/Inversionistas:** Para descubrir locales disponibles y solicitar información.

### Beneficios Clave
- **Eficiencia Operativa:** Automatización de tareas manuales y centralización de la información.
- **Mejora en la Comunicación:** Canales de comunicación directos y eficientes entre administradores e inquilinos.
- **Transparencia:** Acceso fácil y rápido a contratos, pagos y otra información relevante.
- **Toma de Decisiones Basada en Datos:** Generación de reportes y métricas en tiempo real.

## 2. Branding y Diseño

### Logo
El proyecto utiliza dos imágenes principales como logo:
- **Favicon:** `client/public/Favicon.png`
- **Logo Principal:** `client/public/redoma.jpg`

### Paleta de Colores
El sistema de diseño utiliza una paleta de colores basada en variables CSS, con soporte para modo claro y oscuro. Los colores principales se definen de la siguiente manera:

**Modo Claro:**
- `background`: `hsl(0 0% 100%)`
- `foreground`: `hsl(0 0% 9%)`
- `primary`: `hsl(210 85% 35%)`
- `secondary`: `hsl(210 6% 90%)`
- `destructive`: `hsl(0 75% 35%)`

**Modo Oscuro:**
- `background`: `hsl(0 0% 8%)`
- `foreground`: `hsl(0 0% 96%)`
- `primary`: `hsl(210 85% 35%)`
- `secondary`: `hsl(210 6% 18%)`
- `destructive`: `hsl(0 75% 32%)`

### Tipografía
- **Primaria (Encabezados y UI):** Inter
- **Secundaria (Cuerpo de texto):** Work Sans

### Estrategia de Diseño
CCredoma adopta una estrategia de diseño híbrida:
- **Páginas Públicas:** Inspiradas en plataformas de muestra de propiedades como **Airbnb** y **Zillow**, enfocadas en el atractivo visual y la experiencia del visitante.
- **Dashboards de Administración:** Siguen los principios de **Material Design**, optimizados para interfaces densas en datos y eficiencia en la gestión.

## 3. Arquitectura Tecnológica

### Stack Tecnológico
- **Backend:** Express.js con TypeScript.
- **Frontend:** React con Vite y TypeScript.
- **Base de Datos:** SQLite gestionada con Drizzle ORM.
- **Autenticación:** Sistema de autenticación JWT con Passport.js y hashing de contraseñas con bcrypt.

### Estructura del Proyecto (Monorepo)
El proyecto se organiza en una estructura de monorepo para separar las preocupaciones y compartir código de manera eficiente.
- **/client:** Contiene la aplicación de frontend de React.
- **/server:** Contiene la aplicación de backend de Express.js.
- **/shared:** Contiene código compartido entre el frontend y el backend, como los esquemas de validación de Zod.

## 4. Estructura y Flujo de la Base de Datos

### Esquema de la Base de Datos
La base de datos SQLite está definida por el esquema en `shared/schema.ts` y contiene las siguientes tablas principales:
- `users`: Almacena la información de los usuarios y sus roles.
- `locals`: Almacena información sobre los locales comerciales.
- `contracts`: Almacena información sobre los contratos de alquiler.
- `payments`: Registra los pagos de alquiler.
- `requests`: Almacena las solicitudes de información de clientes potenciales.

### ORM y Migraciones
Drizzle ORM se utiliza para interactuar con la base de datos de una manera `type-safe`. Las migraciones y la creación de la base de datos se gestionan a través de los scripts de npm (`npm run db:push`).

## 5. Funcionalidades Detalladas por Rol

### **Visitante Externo (Público)**
- **Página de Aterrizaje:** Una página de bienvenida atractiva que presenta el centro comercial.
- **Catálogo de Locales:** Un catálogo interactivo para explorar los locales disponibles.
- **Solicitud de Información:** Un formulario para que los visitantes puedan contactar con la administración.

### **Administrador del Centro Comercial (`CentroComercialAdmin`)**
- **Dashboard de Control:** Un panel con métricas clave sobre la ocupación, ingresos y estado de los locales.
- **Gestión de Locales (CRUD):** Funcionalidad completa para crear, leer, actualizar y eliminar locales comerciales.
- **Gestión de Contratos:** Administración y seguimiento de los contratos de alquiler.
- **Reportes Financieros:** Generación de informes sobre el rendimiento financiero del centro comercial.
- **Gestión de Solicitudes:** Revisión y seguimiento de las solicitudes de información.

### **Propietario/Inquilino de Local (`LocalOwner`)**
- **Portal Personalizado:** Un portal privado para acceder a la información de su alquiler.
- **Consulta de Contratos y Pagos:** Acceso al contrato de alquiler y al historial de pagos.
- **Gestión de Solicitudes de Mantenimiento:** Un canal para solicitar mantenimiento y otros servicios.

### **Desarrollador del Sistema (`SystemDeveloper`)**
- **Dashboard de Monitoreo:** Un panel con estadísticas del sistema y métricas de salud de la aplicación.

## 6. Sistema de Autenticación y Seguridad

- **Autenticación basada en JWT:** Se utilizan JSON Web Tokens para asegurar las rutas de la API y gestionar las sesiones de los usuarios.
- **Control de Acceso Basado en Roles (RBAC):** Middleware en el backend que restringe el acceso a ciertas rutas y funcionalidades según el rol del usuario.
- **Hashing de Contraseñas (bcrypt):** Las contraseñas de los usuarios se almacenan de forma segura utilizando el algoritmo de hashing bcrypt.

## 7. Configuración del Entorno de Desarrollo

### Requisitos Previos
- Node.js 18+ y npm
- Git

### Pasos de Instalación
1.  **Clonar el repositorio:** `git clone <url-del-repositorio>`
2.  **Instalar dependencias:** `npm install`
3.  **Configurar variables de entorno:**
    - Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
      ```env
      DATABASE_URL=./database.sqlite
      JWT_SECRET=tu-clave-secreta-aqui
      JWT_EXPIRES_IN=7d
      PORT=5000
      VITE_API_URL=http://localhost:5000
      ```
4.  **Crear la base de datos:** `npm run db:push`
5.  **Poblar con datos de ejemplo:** `npm run db:seed`
6.  **Iniciar el servidor de desarrollo:** `npm run dev`

### Comandos Útiles
- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la aplicación para producción.
- `npm start`: Inicia el servidor en modo producción.
- `npm run lint`: Ejecuta el linter.
- `npm run test`: Ejecuta las pruebas.

## 8. Guía de Despliegue

### Proceso de Build
El comando `npm run build` se encarga de:
1.  Construir la aplicación de frontend de Vite en el directorio `dist`.
2.  Transpilar el código del backend de TypeScript a JavaScript en el directorio `dist/server`.

### Opciones de Alojamiento
La aplicación está optimizada para ser desplegada en plataformas como Netlify, Vercel o un servidor propio que soporte Node.js.

### Configuración para Producción
- Asegurarse de que las variables de entorno estén configuradas correctamente en el entorno de producción.
- El comando `npm start` inicia el servidor de Node.js en modo producción.

## 9. Replicación y Futuro Desarrollo

### Puntos Clave para la Replicación
Para replicar este proyecto, es fundamental entender la interacción entre el cliente y el servidor, la estructura de la base de datos y el sistema de autenticación. Los puntos clave son:
- **API del Backend:** La API de Express que sirve los datos y gestiona la lógica de negocio.
- **Componentes de React:** La librería de componentes de Shadcn UI y su integración.
- **Gestión de Estado:** El uso de React Query para la gestión del estado del servidor.

### Posibles Mejoras y Funcionalidades Futuras
- **Notificaciones en Tiempo Real:** Implementar WebSockets para notificaciones instantáneas.
- **Integración con Pasarelas de Pago:** Permitir a los inquilinos pagar su alquiler en línea.
- **Dashboard de Analíticas Avanzadas:** Añadir más métricas y gráficos para un análisis más profundo.
- **Soporte Multi-idioma:** Internacionalización de la plataforma.
