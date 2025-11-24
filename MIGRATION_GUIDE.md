# Guía de Migración: Supabase → SQLite Local

Este proyecto ha sido migrado de Supabase a una base de datos SQLite local con autenticación JWT.

## Cambios Principales

### Base de Datos
- **Antes**: PostgreSQL en Supabase (cloud)
- **Ahora**: SQLite local (archivo `database.sqlite`)

### Autenticación
- **Antes**: Supabase Auth
- **Ahora**: JWT + bcrypt

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
# Database Configuration
DATABASE_URL=./database.sqlite

# JWT Configuration
# IMPORTANT: Cambia esto a una cadena aleatoria segura en producción!
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Client API URL
VITE_API_URL=http://localhost:5000
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Crear la Base de Datos

```bash
# Crear las tablas
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 4. Iniciar el Servidor

```bash
npm run dev
```

## Estructura de la Base de Datos

La base de datos SQLite se crea automáticamente en `./database.sqlite` cuando ejecutas `npm run db:push`.

### Tablas
- `roles` - Roles de usuario
- `usuarios` - Usuarios del sistema
- `centros_comerciales` - Centros comerciales
- `locales_comerciales` - Locales comerciales
- `contratos_alquiler` - Contratos de alquiler
- `pagos_alquiler` - Pagos de alquiler
- `solicitudes_informacion` - Solicitudes de información

## Autenticación

### Registro de Usuario

```typescript
POST /api/auth/signup
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

### Inicio de Sesión

```typescript
POST /api/auth/signin
{
  "email": "juan@example.com",
  "password": "password123"
}

// Respuesta:
{
  "user": { ... },
  "token": "jwt-token-here"
}
```

El token JWT debe incluirse en las peticiones autenticadas:

```
Authorization: Bearer <token>
```

## Ventajas de SQLite Local

1. **Simplicidad**: No requiere configuración de servidor de base de datos
2. **Portabilidad**: La base de datos es un solo archivo
3. **Rapidez**: Muy rápido para desarrollo y aplicaciones pequeñas/medianas
4. **Sin dependencias externas**: No necesitas servicios cloud
5. **Fácil backup**: Solo copia el archivo `database.sqlite`

## Migración de Datos (Opcional)

Si tienes datos en Supabase que quieres migrar:

1. Exporta los datos de Supabase a JSON/CSV
2. Crea un script de migración que lea los datos exportados
3. Inserta los datos usando Drizzle ORM

## Notas Importantes

- **JWT_SECRET**: En producción, usa una cadena aleatoria segura (mínimo 32 caracteres)
- **Backup**: Haz backup regular del archivo `database.sqlite`
- **Escalabilidad**: SQLite es excelente para desarrollo y aplicaciones pequeñas/medianas. Para aplicaciones muy grandes, considera migrar a PostgreSQL o MySQL más adelante.

## Comandos Útiles

```bash
# Crear/actualizar tablas
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed

# Verificar conexión a la base de datos
npm run db:check

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

