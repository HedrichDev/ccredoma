-- ERP Centro Comercial - Schema SQL para Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_rol TEXT NOT NULL UNIQUE CHECK (nombre_rol IN ('CentroComercialAdmin', 'LocalOwner', 'VisitanteExterno', 'SystemDeveloper')),
  permisos JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol_id UUID NOT NULL REFERENCES roles(id),
  datos_personales JSONB NOT NULL DEFAULT '{}'::jsonb,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de centros comerciales
CREATE TABLE IF NOT EXISTS centros_comerciales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email_contacto TEXT NOT NULL,
  configuraciones JSONB NOT NULL DEFAULT '{}'::jsonb,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de locales comerciales
CREATE TABLE IF NOT EXISTS locales_comerciales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  centro_comercial_id UUID NOT NULL REFERENCES centros_comerciales(id),
  codigo_local TEXT NOT NULL UNIQUE,
  area_m2 DECIMAL(10, 2) NOT NULL,
  tipo_local TEXT NOT NULL CHECK (tipo_local IN ('tienda', 'restaurante', 'servicio', 'entretenimiento')),
  piso TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupado', 'en_mantenimiento')),
  caracteristicas JSONB NOT NULL DEFAULT '{}'::jsonb,
  fotos_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  renta_mensual DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de contratos de alquiler
CREATE TABLE IF NOT EXISTS contratos_alquiler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id UUID NOT NULL REFERENCES locales_comerciales(id),
  local_owner_id UUID NOT NULL REFERENCES usuarios(id),
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  renta_mensual DECIMAL(10, 2) NOT NULL,
  deposito_garantia DECIMAL(10, 2) NOT NULL,
  estado_contrato TEXT NOT NULL DEFAULT 'activo' CHECK (estado_contrato IN ('activo', 'vencido', 'terminado')),
  terminos_especiales JSONB NOT NULL DEFAULT '{}'::jsonb,
  documento_contrato_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de pagos de alquiler
CREATE TABLE IF NOT EXISTS pagos_alquiler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES contratos_alquiler(id),
  mes_anio TEXT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  fecha_vencimiento TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE,
  estado_pago TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'pagado', 'vencido')),
  metodo_pago TEXT,
  comprobante_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de solicitudes de información
CREATE TABLE IF NOT EXISTS solicitudes_informacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitante_id UUID REFERENCES usuarios(id),
  local_id UUID NOT NULL REFERENCES locales_comerciales(id),
  nombre_contacto TEXT NOT NULL,
  email_contacto TEXT NOT NULL,
  telefono_contacto TEXT,
  mensaje TEXT NOT NULL,
  estado_solicitud TEXT NOT NULL DEFAULT 'nueva' CHECK (estado_solicitud IN ('nueva', 'contactada', 'cerrada')),
  fecha_contacto TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_locales_codigo ON locales_comerciales(codigo_local);
CREATE INDEX IF NOT EXISTS idx_locales_estado ON locales_comerciales(estado);
CREATE INDEX IF NOT EXISTS idx_contratos_local_id ON contratos_alquiler(local_id);
CREATE INDEX IF NOT EXISTS idx_contratos_owner_id ON contratos_alquiler(local_owner_id);
CREATE INDEX IF NOT EXISTS idx_pagos_contrato_id ON pagos_alquiler(contrato_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_local_id ON solicitudes_informacion(local_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_informacion(estado_solicitud);

-- Insertar roles por defecto
INSERT INTO roles (nombre_rol, permisos) VALUES
  ('CentroComercialAdmin', '{"all": true}'::jsonb),
  ('LocalOwner', '{"read_own": true}'::jsonb),
  ('VisitanteExterno', '{"read_public": true}'::jsonb),
  ('SystemDeveloper', '{"all": true, "system": true}'::jsonb)
ON CONFLICT (nombre_rol) DO NOTHING;

-- Insertar un centro comercial de ejemplo
INSERT INTO centros_comerciales (nombre, direccion, telefono, email_contacto) VALUES
  ('Centro Comercial Plaza Mayor', 'Av. Principal 123, Ciudad', '+1 (555) 123-4567', 'info@plazamayor.com')
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) Policies

-- Habilitar RLS en todas las tablas
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE centros_comerciales ENABLE ROW LEVEL SECURITY;
ALTER TABLE locales_comerciales ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos_alquiler ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos_alquiler ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_informacion ENABLE ROW LEVEL SECURITY;

-- Políticas para roles (solo lectura para todos los autenticados)
CREATE POLICY "Roles son visibles para todos los autenticados"
  ON roles FOR SELECT
  USING (true);

-- Políticas para usuarios
CREATE POLICY "Usuarios pueden ver su propia información"
  ON usuarios FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins pueden ver todos los usuarios"
  ON usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE u.id::text = auth.uid()::text
      AND r.nombre_rol IN ('CentroComercialAdmin', 'SystemDeveloper')
    )
  );

-- Políticas para centros comerciales (visible para todos)
CREATE POLICY "Centros comerciales son públicos"
  ON centros_comerciales FOR SELECT
  USING (true);

-- Políticas para locales comerciales (visible para todos en lectura)
CREATE POLICY "Locales son visibles para todos"
  ON locales_comerciales FOR SELECT
  USING (true);

CREATE POLICY "Solo admins pueden crear/modificar locales"
  ON locales_comerciales FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE u.id::text = auth.uid()::text
      AND r.nombre_rol IN ('CentroComercialAdmin', 'SystemDeveloper')
    )
  );

-- Políticas para contratos
CREATE POLICY "LocalOwner puede ver su propio contrato"
  ON contratos_alquiler FOR SELECT
  USING (
    local_owner_id::text = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE u.id::text = auth.uid()::text
      AND r.nombre_rol IN ('CentroComercialAdmin', 'SystemDeveloper')
    )
  );

-- Políticas para pagos
CREATE POLICY "LocalOwner puede ver sus propios pagos"
  ON pagos_alquiler FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contratos_alquiler c
      WHERE c.id = pagos_alquiler.contrato_id
      AND c.local_owner_id::text = auth.uid()::text
    )
    OR EXISTS (
      SELECT 1 FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE u.id::text = auth.uid()::text
      AND r.nombre_rol IN ('CentroComercialAdmin', 'SystemDeveloper')
    )
  );

-- Políticas para solicitudes
CREATE POLICY "Todos pueden crear solicitudes"
  ON solicitudes_informacion FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins pueden ver todas las solicitudes"
  ON solicitudes_informacion FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE u.id::text = auth.uid()::text
      AND r.nombre_rol IN ('CentroComercialAdmin', 'SystemDeveloper')
    )
  );

CREATE POLICY "Admins pueden actualizar solicitudes"
  ON solicitudes_informacion FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE u.id::text = auth.uid()::text
      AND r.nombre_rol IN ('CentroComercialAdmin', 'SystemDeveloper')
    )
  );

-- Función para actualizar automáticamente los estados de pago vencidos
CREATE OR REPLACE FUNCTION actualizar_pagos_vencidos()
RETURNS void AS $$
BEGIN
  UPDATE pagos_alquiler
  SET estado_pago = 'vencido'
  WHERE estado_pago = 'pendiente'
  AND fecha_vencimiento < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comentarios de documentación
COMMENT ON TABLE roles IS 'Roles del sistema: CentroComercialAdmin, LocalOwner, VisitanteExterno, SystemDeveloper';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema con autenticación y autorización basada en roles';
COMMENT ON TABLE centros_comerciales IS 'Información de los centros comerciales administrados';
COMMENT ON TABLE locales_comerciales IS 'Locales comerciales disponibles para alquiler';
COMMENT ON TABLE contratos_alquiler IS 'Contratos de alquiler entre el centro y los arrendatarios';
COMMENT ON TABLE pagos_alquiler IS 'Registro de pagos mensuales de los contratos';
COMMENT ON TABLE solicitudes_informacion IS 'Solicitudes de información de visitantes interesados';
