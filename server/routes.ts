import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  localesComerciales,
  centrosComerciales,
  contratosAlquiler,
  pagosAlquiler,
  solicitudesInformacion,
  usuarios,
  insertLocalComercialSchema,
  insertSolicitudInformacionSchema,
} from "@shared/schema";
import {
  authenticateUser,
  requireRole,
  type AuthenticatedRequest,
} from "./middleware/auth";
import { signIn, signUp } from "./auth";
import { logger } from "./logger";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos" });
      }

      const result = await signIn(email, password);
      if (!result) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      logger.debug(`Usuario autenticado: ${result.user.email}`, {
        prefix: "AUTH",
      });
      res.json({ user: result.user, token: result.token });
    } catch (error) {
      logger.error("Error al iniciar sesión", error, { prefix: "AUTH" });
      res.status(500).json({
        error: error instanceof Error ? error.message : "Error al iniciar sesión",
      });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { nombre, email, password } = req.body;
      if (!nombre || !email || !password) {
        return res
          .status(400)
          .json({ error: "Nombre, email y contraseña requeridos" });
      }

      await signUp(nombre, email, password);
      logger.info(`Nuevo usuario registrado: ${email}`, { prefix: "AUTH" });
      res.json({ success: true });
    } catch (error) {
      logger.error("Error al registrar usuario", error, { prefix: "AUTH" });
      res.status(400).json({
        error: error instanceof Error ? error.message : "Error al registrarse",
      });
    }
  });

  app.get("/api/auth/me", authenticateUser, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { getUserById } = await import("./auth");
      const user = await getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user);
    } catch (error) {
      logger.error("Error al obtener usuario actual", error, { prefix: "AUTH" });
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  });

  // Public route for browsing locales
  app.get("/api/locales", authenticateUser, async (req, res) => {
    try {
      const locales = await db
        .select({
          id: localesComerciales.id,
          centroComercialId: localesComerciales.centroComercialId,
          codigoLocal: localesComerciales.codigoLocal,
          areaM2: localesComerciales.areaM2,
          tipoLocal: localesComerciales.tipoLocal,
          piso: localesComerciales.piso,
          estado: localesComerciales.estado,
          caracteristicas: localesComerciales.caracteristicas,
          fotosUrls: localesComerciales.fotosUrls,
          rentaMensual: localesComerciales.rentaMensual,
          createdAt: localesComerciales.createdAt,
          centroComercial: {
            nombre: centrosComerciales.nombre,
          },
        })
        .from(localesComerciales)
        .innerJoin(
          centrosComerciales,
          eq(localesComerciales.centroComercialId, centrosComerciales.id)
        )
        .orderBy(desc(localesComerciales.createdAt));

      res.json(locales);
    } catch (error) {
      logger.error("Error al obtener locales", error, { prefix: "API" });
      res.status(500).json({ error: "Error al obtener locales" });
    }
  });

  // Admin route to create a new local
  app.post(
    "/api/locales",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const validatedData = insertLocalComercialSchema.parse(req.body);

        const [newLocal] = await db
          .insert(localesComerciales)
          .values({
            centroComercialId: validatedData.centroComercialId,
            codigoLocal: validatedData.codigoLocal,
            areaM2: validatedData.areaM2,
            tipoLocal: validatedData.tipoLocal,
            piso: validatedData.piso,
            estado: validatedData.estado,
            rentaMensual: validatedData.rentaMensual,
            caracteristicas: validatedData.caracteristicas,
            fotosUrls: validatedData.fotosUrls,
          })
          .returning();

        logger.info(`Local creado: ${newLocal.codigoLocal}`, { prefix: "API" });
        res.json(newLocal);
      } catch (error) {
        logger.error("Error al crear local", error, { prefix: "API" });
        res.status(400).json({
          error:
            error instanceof Error ? error.message : "Error al crear local",
        });
      }
    }
  );

  // Admin route to get all contracts
  app.get(
    "/api/contratos",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const contratos = await db
          .select({
            id: contratosAlquiler.id,
            localId: contratosAlquiler.localId,
            localOwnerId: contratosAlquiler.localOwnerId,
            fechaInicio: contratosAlquiler.fechaInicio,
            fechaFin: contratosAlquiler.fechaFin,
            rentaMensual: contratosAlquiler.rentaMensual,
            depositoGarantia: contratosAlquiler.depositoGarantia,
            estadoContrato: contratosAlquiler.estadoContrato,
            terminosEspeciales: contratosAlquiler.terminosEspeciales,
            documentoContratoUrl: contratosAlquiler.documentoContratoUrl,
            createdAt: contratosAlquiler.createdAt,
            local: {
              codigoLocal: localesComerciales.codigoLocal,
              areaM2: localesComerciales.areaM2,
              tipoLocal: localesComerciales.tipoLocal,
            },
            usuario: {
              email: usuarios.email,
              datosPersonales: usuarios.datosPersonales,
            },
          })
          .from(contratosAlquiler)
          .innerJoin(
            localesComerciales,
            eq(contratosAlquiler.localId, localesComerciales.id)
          )
          .innerJoin(usuarios, eq(contratosAlquiler.localOwnerId, usuarios.id))
          .orderBy(desc(contratosAlquiler.createdAt));

        res.json(contratos);
      } catch (error) {
        logger.error("Error al obtener contratos", error, { prefix: "API" });
        res.status(500).json({ error: "Error al obtener contratos" });
      }
    }
  );

  // Admin route to get all payments
  app.get(
    "/api/pagos",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const pagos = await db
          .select()
          .from(pagosAlquiler)
          .orderBy(desc(pagosAlquiler.createdAt));

        res.json(pagos);
      } catch (error) {
        logger.error("Error al obtener pagos", error, { prefix: "API" });
        res.status(500).json({ error: "Error al obtener pagos" });
      }
    }
  );

  // Admin route to get all solicitudes
  app.get(
    "/api/solicitudes",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const solicitudes = await db
          .select({
            id: solicitudesInformacion.id,
            visitanteId: solicitudesInformacion.visitanteId,
            localId: solicitudesInformacion.localId,
            nombreContacto: solicitudesInformacion.nombreContacto,
            emailContacto: solicitudesInformacion.emailContacto,
            telefonoContacto: solicitudesInformacion.telefonoContacto,
            mensaje: solicitudesInformacion.mensaje,
            estadoSolicitud: solicitudesInformacion.estadoSolicitud,
            fechaContacto: solicitudesInformacion.fechaContacto,
            createdAt: solicitudesInformacion.createdAt,
            local: {
              codigoLocal: localesComerciales.codigoLocal,
              tipoLocal: localesComerciales.tipoLocal,
            },
          })
          .from(solicitudesInformacion)
          .leftJoin(
            localesComerciales,
            eq(solicitudesInformacion.localId, localesComerciales.id)
          )
          .orderBy(desc(solicitudesInformacion.createdAt));

        res.json(solicitudes);
      } catch (error) {
        logger.error("Error al obtener solicitudes", error, { prefix: "API" });
        res.status(500).json({ error: "Error al obtener solicitudes" });
      }
    }
  );

  // Public route for submitting a new solicitud
  app.post("/api/solicitudes", async (req, res) => {
    try {
      const validatedData = insertSolicitudInformacionSchema.parse(req.body);

      const [newSolicitud] = await db
        .insert(solicitudesInformacion)
        .values({
          localId: validatedData.localId,
          visitanteId: validatedData.visitanteId,
          nombreContacto: validatedData.nombreContacto,
          emailContacto: validatedData.emailContacto,
          telefonoContacto: validatedData.telefonoContacto,
          mensaje: validatedData.mensaje,
          estadoSolicitud: "nueva",
        })
        .returning();

      logger.info(`Nueva solicitud creada: ${newSolicitud.id}`, {
        prefix: "API",
      });
      res.json(newSolicitud);
    } catch (error) {
      logger.error("Error al crear solicitud", error, { prefix: "API" });
      res.status(400).json({
        error:
          error instanceof Error ? error.message : "Error al crear solicitud",
      });
    }
  });

  // Admin route to update a solicitud
  app.patch(
    "/api/solicitudes/:id",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { estadoSolicitud } = req.body;

        const [updated] = await db
          .update(solicitudesInformacion)
          .set({
            estadoSolicitud,
            fechaContacto:
              estadoSolicitud === "contactada" ? new Date() : undefined,
          })
          .where(eq(solicitudesInformacion.id, id))
          .returning();

        if (!updated) {
          return res.status(404).json({ error: "Solicitud no encontrada" });
        }

        logger.info(`Solicitud actualizada: ${id}`, { prefix: "API" });
        res.json(updated);
      } catch (error) {
        logger.error("Error al actualizar solicitud", error, { prefix: "API" });
        res.status(400).json({ error: "Error al actualizar solicitud" });
      }
    }
  );

  // Authenticated route for browsing centros comerciales
  app.get("/api/centros", authenticateUser, async (req, res) => {
    try {
      const centros = await db
        .select({
          id: centrosComerciales.id,
          nombre: centrosComerciales.nombre,
          direccion: centrosComerciales.direccion,
        })
        .from(centrosComerciales)
        .orderBy(centrosComerciales.nombre);

      res.json(centros);
    } catch (error) {
      logger.error("Error al obtener centros comerciales", error, {
        prefix: "API",
      });
      res.status(500).json({ error: "Error al obtener centros" });
    }
  });

  // Admin route to update a local
  app.put(
    "/api/locales/:id",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;

        const [updated] = await db
          .update(localesComerciales)
          .set(updates)
          .where(eq(localesComerciales.id, id))
          .returning();

        if (!updated) {
          return res.status(404).json({ error: "Local no encontrado" });
        }

        logger.info(`Local actualizado: ${id}`, { prefix: "API" });
        res.json(updated);
      } catch (error) {
        logger.error("Error al actualizar local", error, { prefix: "API" });
        res.status(400).json({ error: "Error al actualizar local" });
      }
    }
  );

  // Admin route to delete a local
  app.delete(
    "/api/locales/:id",
    authenticateUser,
    requireRole("CentroComercialAdmin"),
    async (req, res) => {
      try {
        const { id } = req.params;

        await db
          .delete(localesComerciales)
          .where(eq(localesComerciales.id, id));

        logger.info(`Local eliminado: ${id}`, { prefix: "API" });
        res.json({ success: true });
      } catch (error) {
        logger.error("Error al eliminar local", error, { prefix: "API" });
        res.status(400).json({ error: "Error al eliminar local" });
      }
    }
  );

  // Owner route to get their specific contract
  app.get(
    "/api/mi-contrato",
    authenticateUser,
    requireRole("LocalOwner"),
    async (req: AuthenticatedRequest, res) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res
            .status(401)
            .json({ error: "No autorizado - ID de usuario no encontrado" });
        }

        const [contrato] = await db
          .select({
            id: contratosAlquiler.id,
            localId: contratosAlquiler.localId,
            localOwnerId: contratosAlquiler.localOwnerId,
            fechaInicio: contratosAlquiler.fechaInicio,
            fechaFin: contratosAlquiler.fechaFin,
            rentaMensual: contratosAlquiler.rentaMensual,
            depositoGarantia: contratosAlquiler.depositoGarantia,
            estadoContrato: contratosAlquiler.estadoContrato,
            terminosEspeciales: contratosAlquiler.terminosEspeciales,
            documentoContratoUrl: contratosAlquiler.documentoContratoUrl,
            createdAt: contratosAlquiler.createdAt,
            local: localesComerciales,
          })
          .from(contratosAlquiler)
          .innerJoin(
            localesComerciales,
            eq(contratosAlquiler.localId, localesComerciales.id)
          )
          .where(
            and(
              eq(contratosAlquiler.localOwnerId, userId),
              eq(contratosAlquiler.estadoContrato, "activo")
            )
          )
          .limit(1);

        if (!contrato) {
          return res.status(404).json({ error: "Contrato no encontrado" });
        }

        res.json(contrato);
      } catch (error) {
        logger.error("Error al obtener contrato del usuario", error, {
          prefix: "API",
        });
        res.status(500).json({ error: "Error al obtener contrato" });
      }
    }
  );

  // Owner route to get their specific payments
  app.get(
    "/api/mis-pagos",
    authenticateUser,
    requireRole("LocalOwner"),
    async (req: AuthenticatedRequest, res) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res
            .status(401)
            .json({ error: "No autorizado - ID de usuario no encontrado" });
        }

        // First, get the user's contract to identify the contract ID
        const [contrato] = await db
          .select({ id: contratosAlquiler.id })
          .from(contratosAlquiler)
          .where(eq(contratosAlquiler.localOwnerId, userId))
          .limit(1);

        if (!contrato) {
          return res
            .status(404)
            .json({ error: "No se encontró un contrato para este usuario." });
        }

        const pagos = await db
          .select()
          .from(pagosAlquiler)
          .where(eq(pagosAlquiler.contratoId, contrato.id))
          .orderBy(desc(pagosAlquiler.createdAt));

        res.json(pagos);
      } catch (error) {
        logger.error("Error al obtener pagos del usuario", error, {
          prefix: "API",
        });
        res.status(500).json({ error: "Error al obtener pagos" });
      }
    }
  );

  // Admin/Developer route for system statistics
  app.get(
    "/api/system/stats",
    authenticateUser,
    requireRole("CentroComercialAdmin", "SystemDeveloper"),
    async (req, res) => {
      try {
        const [usersCount, localesCount, contratosCount, pagosCount] =
          await Promise.all([
            db.select().from(usuarios),
            db.select().from(localesComerciales),
            db.select().from(contratosAlquiler),
            db.select().from(pagosAlquiler),
          ]);

        res.json({
          totalUsers: usersCount.length,
          totalLocales: localesCount.length,
          totalContratos: contratosCount.length,
          totalPagos: pagosCount.length,
          activeUsers: 0,
        });
      } catch (error) {
        logger.error("Error al obtener estadísticas del sistema", error, {
          prefix: "API",
        });
        res.status(500).json({ error: "Error al obtener estadísticas" });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
