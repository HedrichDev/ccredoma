# Configuración de Supabase para ERP Centro Comercial

## Pasos para Configurar la Base de Datos

### 1. Crear el Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Crea un nuevo proyecto
4. Guarda las credenciales (ve a Settings > API):
   - `SUPABASE_URL` - Project URL
   - `SUPABASE_ANON_KEY` - anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` - service_role key (**mantén esta clave secreta, otorga acceso completo a la base de datos**)

### 2. Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a la pestaña **SQL Editor**
2. Crea una nueva query
3. Copia todo el contenido del archivo `supabase-schema.sql`
4. Pega el código en el editor
5. Haz clic en **Run** para ejecutar el script

Esto creará:
- ✅ Todas las tablas necesarias (roles, usuarios, centros_comerciales, locales_comerciales, contratos_alquiler, pagos_alquiler, solicitudes_informacion)
- ✅ Índices para optimizar las consultas
- ✅ Políticas RLS (Row Level Security) para control de acceso
- ✅ Datos iniciales (roles y un centro comercial de ejemplo)
- ✅ Función para actualizar pagos vencidos automáticamente

### 3. Configurar Autenticación

1. Ve a **Authentication** > **Providers** en Supabase
2. Habilita **Email** como proveedor de autenticación
3. Configura las opciones:
   - ✅ Enable email confirmations (opcional, desactiva para desarrollo)
   - ✅ Enable email signup

### 4. Crear Usuarios de Prueba

Ejecuta el siguiente SQL en el SQL Editor para crear usuarios de prueba:

```sql
-- Primero, obtén los IDs de los roles
SELECT id, nombre_rol FROM roles;

-- Usuario Administrador (reemplaza {admin_role_id} con el ID del rol CentroComercialAdmin)
INSERT INTO usuarios (email, password_hash, rol_id, datos_personales) VALUES
  ('admin@centrocomercial.com', crypt('admin123', gen_salt('bf')), '{admin_role_id}', '{"nombre": "Administrador Principal"}'::jsonb);

-- Usuario LocalOwner (reemplaza {owner_role_id} con el ID del rol LocalOwner)
INSERT INTO usuarios (email, password_hash, rol_id, datos_personales) VALUES
  ('owner@example.com', crypt('owner123', gen_salt('bf')), '{owner_role_id}', '{"nombre": "Juan Pérez", "negocio": "Tienda de Ropa"}'::jsonb);

-- Usuario Developer (reemplaza {dev_role_id} con el ID del rol SystemDeveloper)
INSERT INTO usuarios (email, password_hash, rol_id, datos_personales) VALUES
  ('dev@centrocomercial.com', crypt('dev123', gen_salt('bf')), '{dev_role_id}', '{"nombre": "Desarrollador Sistema"}'::jsonb);
```

**Importante**: También necesitas registrar estos usuarios en Supabase Auth. Ve a **Authentication** > **Users** y crea manualmente cada usuario con el mismo email y contraseña.

### 5. Crear Datos de Ejemplo (Opcional)

Para poblar la base de datos con datos de prueba:

```sql
-- Obtener el ID del centro comercial
SELECT id FROM centros_comerciales LIMIT 1;

-- Crear locales de ejemplo (reemplaza {centro_id} con el ID del centro)
INSERT INTO locales_comerciales (centro_comercial_id, codigo_local, area_m2, tipo_local, piso, estado, renta_mensual, fotos_urls) VALUES
  ('{centro_id}', 'LC-101', 150.00, 'tienda', '1', 'disponible', 5000.00, ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8']),
  ('{centro_id}', 'LC-102', 200.00, 'restaurante', '2', 'disponible', 7500.00, ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4']),
  ('{centro_id}', 'LC-103', 120.00, 'servicio', '1', 'ocupado', 4500.00, ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d']),
  ('{centro_id}', 'LC-104', 180.00, 'entretenimiento', '3', 'disponible', 6000.00, ARRAY['https://images.unsplash.com/photo-1514933651103-005eec06c04b']);
```

### 6. Verificar la Configuración

1. Ve a **Table Editor** en Supabase
2. Verifica que veas todas las tablas creadas
3. Haz clic en cada tabla para ver la estructura y los datos

### 7. Probar la Conexión

El sistema ya está configurado para conectarse a Supabase usando las variables de entorno que proporcionaste. Al iniciar el servidor, verás un mensaje confirmando la conexión.

## Políticas RLS Configuradas

El sistema implementa Row Level Security para proteger los datos:

### Roles y Permisos:

1. **CentroComercialAdmin**:
   - Ver todos los usuarios, locales, contratos, pagos y solicitudes
   - Crear/modificar locales
   - Actualizar estados de solicitudes

2. **LocalOwner**:
   - Ver solo su propio contrato
   - Ver solo sus propios pagos
   - No puede ver otros contratos ni pagos

3. **VisitanteExterno**:
   - Ver locales disponibles (público)
   - Crear solicitudes de información
   - No puede ver contratos ni pagos

4. **SystemDeveloper**:
   - Acceso completo a todas las tablas
   - Acceso a estadísticas del sistema

## Solución de Problemas

### Error: "relation does not exist"
- Asegúrate de haber ejecutado el script `supabase-schema.sql` completamente
- Verifica que todas las tablas se crearon en el Table Editor

### Error: "row-level security policy"
- Verifica que las políticas RLS se hayan creado correctamente
- Asegúrate de estar autenticado con un usuario válido

### Error de autenticación
- Verifica que el email del usuario exista tanto en la tabla `usuarios` como en Supabase Auth
- Asegúrate de que el `rol_id` del usuario sea correcto

## Estructura de la Base de Datos

```
roles
├── CentroComercialAdmin
├── LocalOwner
├── VisitanteExterno
└── SystemDeveloper

usuarios (conectado con Supabase Auth)
└── rol_id → roles

centros_comerciales
└── locales_comerciales
    ├── contratos_alquiler
    │   └── pagos_alquiler
    └── solicitudes_informacion
```

## Próximos Pasos

Una vez configurada la base de datos:

1. ✅ Las credenciales ya están configuradas en Replit Secrets
2. ✅ El backend ya está conectado a Supabase
3. ✅ El frontend ya tiene el cliente de Supabase configurado
4. ⏭️ Prueba el login con los usuarios creados
5. ⏭️ Explora todas las funcionalidades del sistema
