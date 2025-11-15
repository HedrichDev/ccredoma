# ccredoma

# ERP Simplificado para Centro Comercial - Proyecto 2 Semanas ## 
🎯 **Enfoque Principal: Sistema de Alquileres** 

### **Roles del Sistema**
🏢 CentroComercialAdmin (Administrador del Centro Comercial)

Gestiona todos los locales y contratos
Supervisa pagos y estados de alquiler
Configura el sistema
🏪 LocalOwner (Dueño/Arrendatario del Local)

Visualiza su contrato y estado de pagos
Reporta incidencias del local
Accede a documentos contractuales
👥 VisitanteExterno (Potencial Cliente/Inversionista)

Explora locales disponibles
Solicita información para alquiler
Ve promociones y disponibilidad
👨‍💻 SystemDeveloper (Desarrollador del Sistema)

Acceso técnico completo
Monitoreo y mantenimiento
Resolución de problemas técnicos

## 📊 **Base de Datos Supabase - Estructura Completa** 

### **Tablas Principales** 

#### **1. roles**
id (UUID, PK)
nombre_rol (CentroComercialAdmin, LocalOwner, VisitanteExterno, SystemDeveloper)
permisos (JSON)
created_at

#### **2. usuarios**
id (UUID, PK)
email
password_hash
rol_id (FK a roles)
datos_personales (JSON)
estado (activo/inactivo)
created_at

#### **3. centros_comerciales**
id (UUID, PK)
nombre
direccion
telefono
email_contacto
configuraciones (JSON)
logo_url


#### **4. locales_comerciales**
id (UUID, PK)
centro_comercial_id (FK)
codigo_local (ej: "LC-101")
area_m2
tipo_local (tienda, restaurante, servicio, entretenimiento)
piso
estado (disponible, ocupado, en_mantenimiento)
caracteristicas (JSON)
fotos_urls (Array)

#### **5. contratos_alquiler**
id (UUID, PK)
local_id (FK)
local_owner_id (FK a usuarios)
fecha_inicio
fecha_fin
renta_mensual
deposito_garantia
estado_contrato (activo, vencido, terminado)
terminos_especiales (JSON)
documento_contrato_url

#### **6. pagos_alquiler**
id (UUID, PK)
contrato_id (FK)
mes_año (ej: "2024-03")
monto
fecha_vencimiento
fecha_pago
estado_pago (pendiente, pagado, vencido)
metodo_pago
comprobante_url

#### **7. solicitudes_informacion**
id (UUID, PK)
visitante_id (FK a usuarios)
local_id (FK)
mensaje
estado_solicitud (nueva, contactada, cerrada)
fecha_contacto

--- ## 🚀 **Funcionalidades por Rol**

 ### **Para CentroComercialAdmin:**
Dashboard de ocupación y rentabilidad
Gestión completa de locales
Aprobación de nuevos LocalOwners
Reportes financieros automáticos
Configuración de tarifas y promociones

### **Para LocalOwner:**
Panel personalizado de su local
Estado de pagos y vencimientos
Solicitudes de mantenimiento
Documentos contractuales digitales
Historial de transacciones

### **Para VisitanteExterno:**
Catálogo visual de locales disponibles
Filtros por tipo, área y precio
Formulario de contacto automatizado
Información del centro comercial
Simulador de costos de alquiler

### **Para SystemDeveloper:**
Monitoreo de rendimiento
Logs del sistema
Mantenimiento de base de datos
Actualizaciones y parches

--- ## 📱 **Vistas Principales** 
### **Página Pública (VisitanteExterno)**
Hero section con centros comerciales
Galería de locales disponibles
Filtros avanzados
Formulario de solicitud

### **Dashboard CentroComercialAdmin**
Métricas clave (ocupación, ingresos)
Lista de locales con estados
Calendario de vencimientos
Reportes ejecutivos

### **Panel LocalOwner**
Resumen de contrato activo
Estado de pagos
Documentos importantes
Soporte y contacto

--- ## 🔐 **Seguridad y Autenticación**
Autenticación: Supabase Auth con confirmación por email
Autorización: RBAC (Role-Based Access Control)
Políticas RLS: Row Level Security en todas las tablas
Auditoría: Triggers para logs de cambios críticos

--- ## 📈 **Métricas y KPIs** 

### **Para Centro Comercial:**
Tasa de ocupación (%)
Ingresos mensuales por alquiler
Locales disponibles vs ocupados
Pagos pendientes vs completados

### **Para LocalOwner:**
Próximos vencimientos
Historial de pagos
Estado de contrato
Documentos pendientes

--- ## 🛠 **Tecnologías y Herramientas**
Backend: Supabase (PostgreSQL + Auth + Storage)
Frontend: React/Next.js o Vue/Nuxt
Hosting: Netlify
Email: Supabase Edge Functions
Pagos: Stripe Connect (para futuras expansiones)

--- ## 📅 **Plan de 2 Semanas** 
### **Semana 1:**
Día 1-2: Configuración Supabase y autenticación
Día 3-4: Estructura base de datos y RLS
Día 5: Vistas públicas para VisitanteExterno

### **Semana 2:**
Día 6-7: Dashboard CentroComercialAdmin
Día 8-9: Panel LocalOwner
Día 10: Testing, ajustes y deployment
