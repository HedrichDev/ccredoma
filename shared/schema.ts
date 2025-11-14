import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombreRol: text("nombre_rol").notNull().unique(),
  permisos: jsonb("permisos").notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  rolId: uuid("rol_id").notNull().references(() => roles.id),
  datosPersonales: jsonb("datos_personales").notNull().default(sql`'{}'::jsonb`),
  estado: text("estado").notNull().default("activo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const centrosComerciales = pgTable("centros_comerciales", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  direccion: text("direccion").notNull(),
  telefono: text("telefono").notNull(),
  emailContacto: text("email_contacto").notNull(),
  configuraciones: jsonb("configuraciones").notNull().default(sql`'{}'::jsonb`),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const localesComerciales = pgTable("locales_comerciales", {
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contratosAlquiler = pgTable("contratos_alquiler", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  localId: uuid("local_id").notNull().references(() => localesComerciales.id),
  localOwnerId: uuid("local_owner_id").notNull().references(() => usuarios.id),
  fechaInicio: timestamp("fecha_inicio").notNull(),
  fechaFin: timestamp("fecha_fin").notNull(),
  rentaMensual: decimal("renta_mensual", { precision: 10, scale: 2 }).notNull(),
  depositoGarantia: decimal("deposito_garantia", { precision: 10, scale: 2 }).notNull(),
  estadoContrato: text("estado_contrato").notNull().default("activo"),
  terminosEspeciales: jsonb("terminos_especiales").notNull().default(sql`'{}'::jsonb`),
  documentoContratoUrl: text("documento_contrato_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pagosAlquiler = pgTable("pagos_alquiler", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contratoId: uuid("contrato_id").notNull().references(() => contratosAlquiler.id),
  mesAnio: text("mes_anio").notNull(),
  monto: decimal("monto", { precision: 10, scale: 2 }).notNull(),
  fechaVencimiento: timestamp("fecha_vencimiento").notNull(),
  fechaPago: timestamp("fecha_pago"),
  estadoPago: text("estado_pago").notNull().default("pendiente"),
  metodoPago: text("metodo_pago"),
  comprobanteUrl: text("comprobante_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const solicitudesInformacion = pgTable("solicitudes_informacion", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  visitanteId: uuid("visitante_id").references(() => usuarios.id),
  localId: uuid("local_id").notNull().references(() => localesComerciales.id),
  nombreContacto: text("nombre_contacto").notNull(),
  emailContacto: text("email_contacto").notNull(),
  telefonoContacto: text("telefono_contacto"),
  mensaje: text("mensaje").notNull(),
  estadoSolicitud: text("estado_solicitud").notNull().default("nueva"),
  fechaContacto: timestamp("fecha_contacto"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRolSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

export const insertUsuarioSchema = createInsertSchema(usuarios).omit({
  id: true,
  createdAt: true,
});

export const insertCentroComercialSchema = createInsertSchema(centrosComerciales).omit({
  id: true,
  createdAt: true,
});

export const insertLocalComercialSchema = createInsertSchema(localesComerciales).omit({
  id: true,
  createdAt: true,
});

export const insertContratoAlquilerSchema = createInsertSchema(contratosAlquiler).omit({
  id: true,
  createdAt: true,
});

export const insertPagoAlquilerSchema = createInsertSchema(pagosAlquiler).omit({
  id: true,
  createdAt: true,
});

export const insertSolicitudInformacionSchema = createInsertSchema(solicitudesInformacion).omit({
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
export type InsertContratoAlquiler = z.infer<typeof insertContratoAlquilerSchema>;

export type PagoAlquiler = typeof pagosAlquiler.$inferSelect;
export type InsertPagoAlquiler = z.infer<typeof insertPagoAlquilerSchema>;

export type SolicitudInformacion = typeof solicitudesInformacion.$inferSelect;
export type InsertSolicitudInformacion = z.infer<typeof insertSolicitudInformacionSchema>;

export type TipoLocal = "tienda" | "restaurante" | "servicio" | "entretenimiento";
export type EstadoLocal = "disponible" | "ocupado" | "en_mantenimiento";
export type EstadoContrato = "activo" | "vencido" | "terminado";
export type EstadoPago = "pendiente" | "pagado" | "vencido";
export type EstadoSolicitud = "nueva" | "contactada" | "cerrada";
export type RolNombre = "CentroComercialAdmin" | "LocalOwner" | "VisitanteExterno" | "SystemDeveloper";
