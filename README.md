# 🏢 CCredoma: Gestión Inteligente y Eficiente para Centros Comerciales

## Visión General del Proyecto

**CCredoma** es una plataforma de software integral diseñada específicamente para optimizar la administración y operación de centros comerciales. Nuestra solución busca centralizar y automatizar los procesos clave de gestión de propiedades, alquileres, contratos y comunicaciones, transformando la manera en que los administradores, inquilinos y potenciales clientes interactúan con el espacio comercial. Con CCredoma, su centro comercial operará con mayor eficiencia, transparencia y profesionalismo.

---

## ✨ Beneficios Clave y Funcionalidades Adaptadas por Rol

CCredoma está diseñado con una arquitectura basada en roles para asegurar que cada usuario tenga acceso a las herramientas e información más relevantes para sus necesidades, mejorando la productividad y la experiencia general.

### 🤵 Administrador del Centro Comercial (`CentroComercialAdmin`)

Nuestro módulo para administradores ofrece un control total y una visión 360 grados de la operación del centro comercial:

- **📊 Dashboard de Control Total:** Acceso a un panel intuitivo que proporciona métricas críticas en tiempo real sobre la ocupación, rentabilidad, estado de los locales y flujos de ingreso.
- **🏘️ Gestión Integral de Locales:** Herramientas completas para la administración del inventario de locales comerciales, incluyendo el seguimiento de disponibilidad, estado de mantenimiento, características detalladas y documentación asociada.
- **✒️ Administración Proactiva de Contratos y Pagos:** Centralización de todos los contratos de alquiler, con seguimiento automatizado de fechas de vencimiento, estados de pago y notificaciones, minimizando retrasos y optimizando la recaudación.
- **📈 Reportes Financieros y Operativos Automatizados:** Generación de informes personalizables y detallados sobre el rendimiento financiero, la ocupación y otras métricas operativas clave, facilitando la toma de decisiones estratégicas.

### 🧑‍💼 Propietario/Inquilino de Local (`LocalOwner`)

Ofrecemos un portal dedicado a los inquilinos, fomentando la transparencia y la autogestión:

- **📄 Portal Personalizado y Seguro:** Un espacio privado donde los inquilinos pueden consultar toda la información relacionada con su alquiler de forma organizada y segura.
- **📑 Acceso a Contratos y Documentos Digitales:** Disponibilidad inmediata de su contrato de alquiler, anexos y otra documentación relevante, eliminando la necesidad de trámites físicos.
- **💳 Historial de Pagos Detallado y Próximos Vencimientos:** Transparencia total sobre los movimientos financieros, con un registro claro de pagos realizados y recordatorios de próximos vencimientos.
- **🛠️ Gestión Eficiente de Solicitudes y Soporte:** Un canal directo para reportar incidencias, solicitar mantenimiento o comunicarse con la administración, asegurando una respuesta rápida y documentada.

### 🙋 Potencial Cliente/Inversionista (`VisitanteExterno`)

Diseñado para atraer y facilitar la interacción con interesados en arrendar un local:

- **🔍 Catálogo Interactivo de Locales Disponibles:** Una galería visual e intuitiva que permite explorar locales por tipo, tamaño, ubicación y otras características relevantes.
- **ℹ️ Información Detallada y Multimedia:** Fichas completas de cada local con descripciones, fotografías de alta calidad y planos, proporcionando una visión clara de las oportunidades.
- **📞 Canal de Contacto Directo y Simplificado:** Un formulario de solicitud de información o para agendar visitas, diseñado para captar el interés y facilitar el proceso de consulta.

---

## 🖥️ Experiencia de Usuario: Un Recorrido Visual

CCredoma ha sido diseñado pensando en la usabilidad y una estética moderna:

- **Página de Aterrizaje Pública:** Una introducción atractiva y profesional que sirve como escaparate digital del centro comercial y sus oportunidades.
- **Dashboard de Administración:** Una interfaz clara y funcional que pone el control en las manos del administrador, con acceso rápido a las funciones más utilizadas.
- **Panel del Inquilino:** Un diseño intuitivo que permite a los propietarios de locales gestionar sus asuntos de alquiler con facilidad, desde cualquier dispositivo.

---

## 🔒 Seguridad y Fiabilidad

La seguridad de sus datos es nuestra máxima prioridad. CCredoma implementa:

- **Autenticación Robusta:** Gestión de usuarios mediante JWT (JSON Web Tokens) con hash de contraseñas usando bcrypt.
- **Control de Acceso Basado en Roles (RBAC):** Permisos finos que aseguran que cada usuario solo pueda acceder a la información y funcionalidades pertinentes a su rol.
- **Base de Datos Local Segura:** SQLite con validación de esquemas y protección de claves foráneas.

---

## 🚀 Arquitectura Tecnológica de Vanguardia

Construido sobre un stack tecnológico moderno y escalable para garantizar rendimiento, seguridad y facilidad de mantenimiento:

- **Backend:** Desarrollado con **Express.js** en TypeScript, utilizando **SQLite** como base de datos local con **Drizzle ORM** para una gestión de datos eficiente y type-safe.
- **Autenticación:** Sistema de autenticación JWT con hash de contraseñas mediante **bcrypt**.
- **Frontend:** Una interfaz de usuario dinámica y responsiva creada con **React**, aprovechando la eficiencia de **Vite** para el desarrollo rápido.
- **Alojamiento y Despliegue:** Optimizado para **Netlify**, garantizando despliegues continuos y un rendimiento global excepcional.

---

## 🛠️ Instalación y Configuración

### Requisitos Previos

- Node.js 18+ y npm
- Git

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd ccredoma
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   DATABASE_URL=./database.sqlite
   JWT_SECRET=tu-clave-secreta-aqui
   JWT_EXPIRES_IN=7d
   PORT=5000
   VITE_API_URL=http://localhost:5000
   ```

4. **Crear la base de datos:**
   ```bash
   npm run db:push
   ```

5. **Poblar con datos de ejemplo:**
   ```bash
   npm run db:seed
   ```

6. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

El servidor estará disponible en `http://localhost:5000`

### Comandos Útiles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor en modo producción
- `npm run db:push` - Crea/actualiza las tablas de la base de datos
- `npm run db:seed` - Pobla la base de datos con datos de ejemplo
- `npm run db:check` - Verifica la conexión a la base de datos
- `npm run db:diagnose` - Ejecuta diagnósticos de la base de datos
- `npm run verify-env` - Verifica las variables de entorno

### Migración desde Supabase

Si estás migrando desde una versión anterior que usaba Supabase, consulta el archivo `MIGRATION_GUIDE.md` para instrucciones detalladas.

---

## 📞 Próximos Pasos

Estamos entusiasmados de presentarle CCredoma y discutir cómo esta solución puede potenciar la gestión de su centro comercial.

Para una demostración personalizada, responder a sus preguntas o explorar oportunidades de colaboración, por favor, no dude en contactarnos.
Estamos a su disposición para cualquier consulta.
