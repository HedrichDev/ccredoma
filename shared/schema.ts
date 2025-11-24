import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { randomUUID } from "crypto";

// Helper function to generate UUIDs
const uuid = () => randomUUID();

export const roles = sqliteTable("roles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(uuid),
  nombreRol: text("nombre_rol").notNull().unique(),
  permisos: text("permisos", { mode: "json" })
    .notNull()
    .default("{}"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const usuarios = sqliteTable("usuarios", {
  id: text("id")
    .primaryKey()
    .$defaultFn(uuid),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  rolId: text("rol_id")
    .notNull()
    .references(() => roles.id),
  datosPersonales: text("datos_personales", { mode: "json" })
    .notNull()
    .default("{}"),
  estado: text("estado").notNull().default("activo"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const centrosComerciales = sqliteTable("centros_comerciales", {
  id: text("id")
    .primaryKey()
    .$defaultFn(uuid),
  nombre: text("nombre").notNull(),
  direccion: text("direccion").notNull(),
  telefono: text("telefono").notNull(),
  emailContacto: text("email_contacto").notNull(),
  configuraciones: text("configuraciones", { mode: "json" })
    .notNull()
    .default("{}"),
  logoUrl: text("logo_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const localesComerciales = sqliteTable("locales_comerciales", {
  id: text("id")
    .primaryKey()
    .$defaultFn(uuid),
  centroComercialId: text("centro_comercial_id")
    .notNull()
    .references(() => centrosComerciales.id),
  codigoLocal: text("codigo_local").notNull().unique(),
  areaM2: text("area_m2").notNull(), // Using text to maintain precision
  tipoLocal: text("tipo_local").notNull(),
  piso: text("piso").notNull(),
  estado: text("estado").notNull().default("disponible"),
  caracteristicas: text("caracteristicas", { mode: "json" })
    .notNull()
    .default("{}"),
  fotosUrls: text("fotos_urls", { mode: "json" })
    .notNull()
    .default("[]"),
  rentaMensual: text("renta_mensual").notNull(), // Using text to maintain precision
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const contratosAlquiler = sqliteTable("contratos_alquiler", {
  id: text("id")
    .primaryKey()
    .$defaultFn(uuid),
  localId: text("local_id")
    .notNull()
    .references(() => localesComerciales.id),
  localOwnerId: text("local_owner_id")
    .notNull()
    .references(() => usuarios.id),
  fechaInicio: integer("fecha_inicio", { mode: "timestamp" }).notNull(),
  fechaFin: integer("fecha_fin", { mode: "timestamp" }).notNull(),
  rentaMensual: text("renta_mensual").notNull(), // Using text to maintain precision
  depositoGarantia: text("deposito_garantia").notNull(), // Using text to maintain precision
  estadoContrato: text("estado_contrato").notNull().default("activo"),
  terminosEspeciales: text("terminos_especiales", { mode: "json" })
    .notNull()
    .default("{}"),
  documentoContratoUrl: text("documento_contrato_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const pagosAlquiler = sqliteTable("pagos_alquiler", {
  id: text("id")
    .primaryKey()
    .$defaultFn(uuid),
  contratoId: text("contrato_id")
    .notNull()
    .references(() => contratosAlquiler.id),
  mesAnio: text("mes_anio").notNull(),
  monto: text("monto").notNull(), // Using text to maintain precision
  fechaVencimiento: integer("fecha_vencimiento", { mode: "timestamp" }).notNull(),
  fechaPago: integer("fecha_pago", { mode: "timestamp" }),
  estadoPago: text("estado_pago").notNull().default("pendiente"),
  metodoPago: text("metodo_pago"),
  comprobanteUrl: text("comprobante_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const solicitudesInformacion = sqliteTable("solicitudes_informacion", {
  id: text("id")
    .primaryKey()
    .$defaultFn(uuid),
  visitanteId: text("visitante_id").references(() => usuarios.id),
  localId: text("local_id")
    .notNull()
    .references(() => localesComerciales.id),
  nombreContacto: text("nombre_contacto").notNull(),
  emailContacto: text("email_contacto").notNull(),
  telefonoContacto: text("telefono_contacto"),
  mensaje: text("mensaje").notNull(),
  estadoSolicitud: text("estado_solicitud").notNull().default("nueva"),
  fechaContacto: integer("fecha_contacto", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const insertRolSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

export const insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  createdAt: true,
});

export const insertCentroComercialSchema = createInsertSchema(
  centrosComerciales
).omit({
  id: true,
  createdAt: true,
});

export const insertLocalComercialSchema = createInsertSchema(
  localesComerciales
).omit({
  id: true,
  createdAt: true,
});

export const insertContratoAlquilerSchema = createInsertSchema(
  contratosAlquiler
).omit({
  id: true,
  createdAt: true,
});

export const insertPagoAlquilerSchema = createInsertSchema(pagosAlquiler).omit({
  id: true,
  createdAt: true,
});

export const insertSolicitudInformacionSchema = createInsertSchema(
  solicitudesInformacion
).omit({
  id: true,
  createdAt: true,
});

export type Rol = typeof roles.$inferSelect;
export type InsertRol = z.infer<typeof insertRolSchema>;

export type Usuario = typeof usuarios.$inferSelect;
export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;

export type CentroComercial = typeof centrosComerciales.$inferSelect;
export type InsertCentroComercial = z.infer<typeof insertCentroComercialSchema>;

export type LocalComercial = typeof localesComerciales.$inferSelect;
export type InsertLocalComercial = z.infer<typeof insertLocalComercialSchema>;

export type ContratoAlquiler = typeof contratosAlquiler.$inferSelect;
export type InsertContratoAlquiler = z.infer<
  typeof insertContratoAlquilerSchema
>;

export type PagoAlquiler = typeof pagosAlquiler.$inferSelect;
export type InsertPagoAlquiler = z.infer<typeof insertPagoAlquilerSchema>;

export type SolicitudInformacion = typeof solicitudesInformacion.$inferSelect;
export type InsertSolicitudInformacion = z.infer<
  typeof insertSolicitudInformacionSchema
>;

export type TipoLocal =
  | "tienda"
  | "restaurante"
  | "servicio"
  | "entretenimiento";
export type EstadoLocal = "disponible" | "ocupado" | "en_mantenimiento";
export type EstadoContrato = "activo" | "vencido" | "terminado";
export type EstadoPago = "pendiente" | "pagado" | "vencido";
export type EstadoSolicitud = "nueva" | "contactada" | "cerrada";
export type RolNombre =
  | "CentroComercialAdmin"
  | "LocalOwner"
  | "VisitanteExterno"
  | "SystemDeveloper";
