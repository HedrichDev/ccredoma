# ERP Centro Comercial - Sistema de Gestión de Alquileres

## Overview

Sistema ERP completo para la gestión integral de centros comerciales, enfocado en el manejo de alquileres, contratos, pagos y solicitudes de información. El sistema cuenta con 4 roles de usuario diferentes con interfaces y funcionalidades específicas.

## Roles del Sistema

1. **CentroComercialAdmin**: Administrador del centro comercial con acceso completo a gestión de locales, contratos, pagos, solicitudes y usuarios.

2. **LocalOwner**: Arrendatario que puede visualizar su contrato, estado de pagos, documentos y realizar solicitudes de soporte.

3. **VisitanteExterno**: Visitante público que puede explorar locales disponibles y solicitar información.

4. **SystemDeveloper**: Desarrollador con acceso técnico para monitoreo del sistema, logs y mantenimiento.

## Stack Tecnológico

### Frontend

- React 18 con TypeScript
- Tailwind CSS + Shadcn UI
- React Query (TanStack Query v5)
- Wouter para routing
- React Hook Form + Zod para validación
- Fuentes: Inter (UI) y Work Sans (texto)

### Backend

- Supabase (PostgreSQL + Auth + Storage)
- Express.js para API routes
- Drizzle ORM para tipos y validación
- Row Level Security (RLS) en Supabase

### Integrations

- Supabase para base de datos y autenticación
- GitHub para control de versiones

## Estructura de la Base de Datos

### Tablas Principales

1. **roles**: Gestión de roles del sistema (CentroComercialAdmin, LocalOwner, VisitanteExterno, SystemDeveloper)
2. **usuarios**: Usuarios del sistema con autenticación y datos personales
3. **centros_comerciales**: Información de los centros comerciales
4. **locales_comerciales**: Locales disponibles para alquiler con fotos, características y precios
5. **contratos_alquiler**: Contratos entre el centro y los arrendatarios
6. **pagos_alquiler**: Registro de pagos mensuales con estados y comprobantes
7. **solicitudes_informacion**: Solicitudes de información de visitantes interesados

## Variables de Entorno

### Backend

- `SUPABASE_URL`: URL del proyecto de Supabase
- `SUPABASE_ANON_KEY`: Clave pública de Supabase
- `SESSION_SECRET`: Secreto para sesiones de Express

### Frontend (Vite)

Las variables se pasan automáticamente desde las variables de entorno de Replit:

- `VITE_SUPABASE_URL` (se mapea desde `SUPABASE_URL`)
- `VITE_SUPABASE_ANON_KEY` (se mapea desde `SUPABASE_ANON_KEY`)

## Páginas y Rutas

### Públicas

- `/` - Landing page con hero, catálogo de locales y formulario de contacto
- `/login` - Página de inicio de sesión

### CentroComercialAdmin

- `/admin/dashboard` - Dashboard con métricas y resumen
- `/admin/locales` - Gestión de locales comerciales
- `/admin/contratos` - Gestión de contratos
- `/admin/pagos` - Control de pagos
- `/admin/solicitudes` - Solicitudes de información
- `/admin/usuarios` - Gestión de usuarios

### LocalOwner

- `/owner/dashboard` - Dashboard con información del contrato y pagos
- `/owner/contrato` - Detalles del contrato
- `/owner/pagos` - Historial de pagos

### SystemDeveloper

- `/developer/dashboard` - Monitoreo del sistema
- `/developer/logs` - Logs técnicos

## Características Principales

1. **Autenticación Multi-Rol**: Sistema de autenticación con Supabase Auth que redirige automáticamente según el rol del usuario.

2. **Dashboard Personalizado**: Cada rol tiene su propio dashboard con información relevante y métricas específicas.

3. **Gestión de Locales**: Administración completa de locales comerciales con fotos, características, precios y estados (disponible, ocupado, en mantenimiento).

4. **Sistema de Contratos**: Creación y gestión de contratos de alquiler con fechas, montos, depósitos y documentos adjuntos.

5. **Control de Pagos**: Seguimiento de pagos mensuales con estados, vencimientos y comprobantes.

6. **Solicitudes Públicas**: Sistema para que visitantes soliciten información sobre locales disponibles.

7. **Seguridad RLS**: Políticas de Row Level Security en Supabase para controlar el acceso a datos según el rol.

## Diseño y UI/UX

Siguiendo las guías en `design_guidelines.md`:

- Sistema de diseño híbrido: estilo Airbnb/Zillow para público, Material Design para dashboards
- Paleta de colores profesional con primary blue (#2563EB)
- Componentes reutilizables de Shadcn UI
- Badges de estado con códigos de color semántico
- Diseño responsivo mobile-first
- Dark mode incluido

## Comandos

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Notas de Desarrollo

- Las imágenes generadas están en `attached_assets/generated_images/`
- Se debe importar usando el alias `@assets`
- El sistema de autenticación requiere que primero se creen los roles en Supabase
- Las políticas RLS deben configurarse en Supabase para seguridad apropiada

## Estado Actual

- ✅ Esquema de datos completo definido
- ✅ Sistema de autenticación implementado
- ✅ Componentes UI reutilizables creados
- ✅ Páginas principales para todos los roles
- ✅ Integración con Supabase configurada
- ⏳ Pendiente: Backend API routes
- ⏳ Pendiente: Configuración de base de datos en Supabase
- ⏳ Pendiente: Políticas RLS en Supabase
