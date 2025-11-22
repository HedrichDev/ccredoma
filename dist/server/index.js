// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env file."
  );
}
var supabase = createClient(supabaseUrl, supabaseAnonKey);
var supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
async function initializeDatabase() {
  try {
    const { data: roles2, error: rolesError } = await supabase.from("roles").select("*").limit(1);
    if (rolesError) {
      console.log(
        "Database tables might not exist yet. Please create them in Supabase."
      );
      console.log("Error:", rolesError.message);
    } else {
      console.log("\u2713 Successfully connected to Supabase database");
    }
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
  }
}

// shared/schema.ts
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  decimal,
  jsonb,
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var roles = pgTable("roles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombreRol: text("nombre_rol").notNull().unique(),
  permisos: jsonb("permisos").notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  rolId: uuid("rol_id").notNull().references(() => roles.id),
  datosPersonales: jsonb("datos_personales").notNull().default(sql`'{}'::jsonb`),
  estado: text("estado").notNull().default("activo"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var centrosComerciales = pgTable("centros_comerciales", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  direccion: text("direccion").notNull(),
  telefono: text("telefono").notNull(),
  emailContacto: text("email_contacto").notNull(),
  configuraciones: jsonb("configuraciones").notNull().default(sql`'{}'::jsonb`),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var localesComerciales = pgTable("locales_comerciales", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  centroComercialId: uuid("centro_comercial_id").notNull().references(() => centrosComerciales.id),
  codigoLocal: text("codigo_local").notNull().unique(),
  areaM2: decimal("area_m2", { precision: 10, scale: 2 }).notNull(),
  tipoLocal: text("tipo_local").notNull(),
  piso: text("piso").notNull(),
  estado: text("estado").notNull().default("disponible"),
  caracteristicas: jsonb("caracteristicas").notNull().default(sql`'{}'::jsonb`),
  fotosUrls: text("fotos_urls").array().notNull().default(sql`ARRAY[]::text[]`),
  rentaMensual: decimal("renta_mensual", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var contratosAlquiler = pgTable("contratos_alquiler", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  localId: uuid("local_id").notNull().references(() => localesComerciales.id),
  localOwnerId: uuid("local_owner_id").notNull().references(() => usuarios.id),
  fechaInicio: timestamp("fecha_inicio").notNull(),
  fechaFin: timestamp("fecha_fin").notNull(),
  rentaMensual: decimal("renta_mensual", { precision: 10, scale: 2 }).notNull(),
  depositoGarantia: decimal("deposito_garantia", {
    precision: 10,
    scale: 2
  }).notNull(),
  estadoContrato: text("estado_contrato").notNull().default("activo"),
  terminosEspeciales: jsonb("terminos_especiales").notNull().default(sql`'{}'::jsonb`),
  documentoContratoUrl: text("documento_contrato_url"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var pagosAlquiler = pgTable("pagos_alquiler", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contratoId: uuid("contrato_id").notNull().references(() => contratosAlquiler.id),
  mesAnio: text("mes_anio").notNull(),
  monto: decimal("monto", { precision: 10, scale: 2 }).notNull(),
  fechaVencimiento: timestamp("fecha_vencimiento").notNull(),
  fechaPago: timestamp("fecha_pago"),
  estadoPago: text("estado_pago").notNull().default("pendiente"),
  metodoPago: text("metodo_pago"),
  comprobanteUrl: text("comprobante_url"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var solicitudesInformacion = pgTable("solicitudes_informacion", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  visitanteId: uuid("visitante_id").references(() => usuarios.id),
  localId: uuid("local_id").notNull().references(() => localesComerciales.id),
  nombreContacto: text("nombre_contacto").notNull(),
  emailContacto: text("email_contacto").notNull(),
  telefonoContacto: text("telefono_contacto"),
  mensaje: text("mensaje").notNull(),
  estadoSolicitud: text("estado_solicitud").notNull().default("nueva"),
  fechaContacto: timestamp("fecha_contacto"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertRolSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true
});
var insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  createdAt: true
});
var insertCentroComercialSchema = createInsertSchema(
  centrosComerciales
).omit({
  id: true,
  createdAt: true
});
var insertLocalComercialSchema = createInsertSchema(
  localesComerciales
).omit({
  id: true,
  createdAt: true
});
var insertContratoAlquilerSchema = createInsertSchema(
  contratosAlquiler
).omit({
  id: true,
  createdAt: true
});
var insertPagoAlquilerSchema = createInsertSchema(pagosAlquiler).omit({
  id: true,
  createdAt: true
});
var insertSolicitudInformacionSchema = createInsertSchema(
  solicitudesInformacion
).omit({
  id: true,
  createdAt: true
});

// server/middleware/auth.ts
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autorizado - Token requerido" });
    }
    const token = authHeader.substring(7);
    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "Token inv\xE1lido" });
    }
    const { data: userData, error: userError } = await supabase.from("usuarios").select(
      `
        id,
        email,
        rol_id,
        roles (nombre_rol)
      `
    ).eq("email", user.email).single();
    if (userError || !userData || !userData.roles || !Array.isArray(userData.roles) || userData.roles.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado o sin rol asignado" });
    }
    req.user = {
      id: userData.id,
      email: userData.email,
      rol: userData.roles[0].nombre_rol
    };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Error de autenticaci\xF3n" });
  }
}
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado" });
    }
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: "Acceso denegado - Permisos insuficientes" });
    }
    next();
  };
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/locales", authenticateUser, async (req, res) => {
    try {
      const { data, error } = await supabase.from("locales_comerciales").select(
        `
          *,
          centroComercial:centros_comerciales(nombre)
        `
      ).order("created_at", { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error("Error fetching locales:", error);
      res.status(500).json({ error: "Error al obtener locales" });
    }
  });
  app2.post(
    "/api/locales",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const validatedData = insertLocalComercialSchema.parse(req.body);
        const { data, error } = await supabaseAdmin.from("locales_comerciales").insert([
          {
            centro_comercial_id: validatedData.centroComercialId,
            codigo_local: validatedData.codigoLocal,
            area_m2: validatedData.areaM2,
            tipo_local: validatedData.tipoLocal,
            piso: validatedData.piso,
            estado: validatedData.estado,
            renta_mensual: validatedData.rentaMensual,
            caracteristicas: validatedData.caracteristicas,
            fotos_urls: validatedData.fotosUrls
          }
        ]).select().single();
        if (error) throw error;
        res.json(data);
      } catch (error) {
        console.error("Error creating local:", error);
        res.status(400).json({
          error: error instanceof Error ? error.message : "Error al crear local"
        });
      }
    }
  );
  app2.get(
    "/api/contratos",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { data, error } = await supabase.from("contratos_alquiler").select(
          `
          *,
          local:locales_comerciales(codigo_local, area_m2, tipo_local),
          usuario:usuarios(email, datos_personales)
        `
        ).order("created_at", { ascending: false });
        if (error) throw error;
        res.json(data || []);
      } catch (error) {
        console.error("Error fetching contratos:", error);
        res.status(500).json({ error: "Error al obtener contratos" });
      }
    }
  );
  app2.get(
    "/api/pagos",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { data, error } = await supabase.from("pagos_alquiler").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        res.json(data || []);
      } catch (error) {
        console.error("Error fetching pagos:", error);
        res.status(500).json({ error: "Error al obtener pagos" });
      }
    }
  );
  app2.get(
    "/api/solicitudes",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { data, error } = await supabase.from("solicitudes_informacion").select(
          `
          *,
          local:locales_comerciales(codigo_local, tipo_local)
        `
        ).order("created_at", { ascending: false });
        if (error) throw error;
        res.json(data || []);
      } catch (error) {
        console.error("Error fetching solicitudes:", error);
        res.status(500).json({ error: "Error al obtener solicitudes" });
      }
    }
  );
  app2.post("/api/solicitudes", async (req, res) => {
    try {
      const validatedData = insertSolicitudInformacionSchema.parse(req.body);
      const { data, error } = await supabase.from("solicitudes_informacion").insert([
        {
          local_id: validatedData.localId,
          nombre_contacto: validatedData.nombreContacto,
          email_contacto: validatedData.emailContacto,
          telefono_contacto: validatedData.telefonoContacto,
          mensaje: validatedData.mensaje,
          estado_solicitud: "nueva"
        }
      ]).select().single();
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Error creating solicitud:", error);
      res.status(400).json({
        error: error instanceof Error ? error.message : "Error al crear solicitud"
      });
    }
  });
  app2.patch(
    "/api/solicitudes/:id",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { estadoSolicitud } = req.body;
        const { data, error } = await supabaseAdmin.from("solicitudes_informacion").update({
          estado_solicitud: estadoSolicitud,
          fecha_contacto: estadoSolicitud === "contactada" ? (/* @__PURE__ */ new Date()).toISOString() : void 0
        }).eq("id", id).select().single();
        if (error) throw error;
        res.json(data);
      } catch (error) {
        console.error("Error updating solicitud:", error);
        res.status(400).json({ error: "Error al actualizar solicitud" });
      }
    }
  );
  app2.get("/api/centros", authenticateUser, async (req, res) => {
    try {
      const { data, error } = await supabase.from("centros_comerciales").select("id, nombre, direccion").order("nombre");
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error("Error fetching centros:", error);
      res.status(500).json({ error: "Error al obtener centros" });
    }
  });
  app2.put(
    "/api/locales/:id",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabaseAdmin.from("locales_comerciales").update(updates).eq("id", id).select().single();
        if (error) throw error;
        res.json(data);
      } catch (error) {
        console.error("Error updating local:", error);
        res.status(400).json({ error: "Error al actualizar local" });
      }
    }
  );
  app2.delete(
    "/api/locales/:id",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { error } = await supabaseAdmin.from("locales_comerciales").delete().eq("id", id);
        if (error) throw error;
        res.json({ success: true });
      } catch (error) {
        console.error("Error deleting local:", error);
        res.status(400).json({ error: "Error al eliminar local" });
      }
    }
  );
  app2.get(
    "/api/mi-contrato",
    authenticateUser,
    requireRole("LocalOwner"),
    async (req, res) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res.status(401).json({ error: "No autorizado - ID de usuario no encontrado" });
        }
        const { data, error } = await supabase.from("contratos_alquiler").select(
          `
          *,
          local:locales_comerciales(*)
        `
        ).eq("usuario_id", userId).eq("estado_contrato", "activo").limit(1).single();
        if (error) throw error;
        res.json(data);
      } catch (error) {
        console.error("Error fetching mi contrato:", error);
        res.status(500).json({ error: "Error al obtener contrato" });
      }
    }
  );
  app2.get(
    "/api/mis-pagos",
    authenticateUser,
    requireRole("LocalOwner"),
    async (req, res) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res.status(401).json({ error: "No autorizado - ID de usuario no encontrado" });
        }
        const { data: contrato, error: contratoError } = await supabase.from("contratos_alquiler").select("id").eq("usuario_id", userId).limit(1).single();
        if (contratoError || !contrato) {
          return res.status(404).json({ error: "No se encontr\xF3 un contrato para este usuario." });
        }
        const { data, error } = await supabase.from("pagos_alquiler").select("*").eq("contrato_id", contrato.id).order("created_at", { ascending: false });
        if (error) throw error;
        res.json(data || []);
      } catch (error) {
        console.error("Error fetching mis pagos:", error);
        res.status(500).json({ error: "Error al obtener pagos" });
      }
    }
  );
  app2.get(
    "/api/system/stats",
    authenticateUser,
    requireRole("CentroComercialAdmin", "SystemDeveloper"),
    async (req, res) => {
      try {
        const [
          { count: totalUsers },
          { count: totalLocales },
          { count: totalContratos },
          { count: totalPagos }
        ] = await Promise.all([
          supabase.from("usuarios").select("*", { count: "exact", head: true }),
          supabase.from("locales_comerciales").select("*", { count: "exact", head: true }),
          supabase.from("contratos_alquiler").select("*", { count: "exact", head: true }),
          supabase.from("pagos_alquiler").select("*", { count: "exact", head: true })
        ]);
        res.json({
          totalUsers: totalUsers || 0,
          totalLocales: totalLocales || 0,
          totalContratos: totalContratos || 0,
          totalPagos: totalPagos || 0,
          activeUsers: 0
        });
      } catch (error) {
        console.error("Error fetching system stats:", error);
        res.status(500).json({ error: "Error al obtener estad\xEDsticas" });
      }
    }
  );
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client/src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(
  express2.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      const logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      log(logLine);
    }
  });
  next();
});
(async () => {
  await initializeDatabase();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
