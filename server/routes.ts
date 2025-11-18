import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabase, supabaseAdmin } from "./supabase";
import { z } from "zod";
import { insertLocalComercialSchema, insertSolicitudInformacionSchema } from "@shared/schema";
import { authenticateUser, requireRole, type AuthenticatedRequest } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Public route for browsing locales
  app.get("/api/locales", authenticateUser, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('locales_comerciales')
        .select(`
          *,
          centroComercial:centros_comerciales(nombre)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching locales:', error);
      res.status(500).json({ error: 'Error al obtener locales' });
    }
  });

  // Admin route to create a new local
  app.post("/api/locales", authenticateUser, requireRole('CentroComercialAdmin'), async (req, res) => {
    try {
      const validatedData = insertLocalComercialSchema.parse(req.body);
      
      const { data, error } = await supabaseAdmin
        .from('locales_comerciales')
        .insert([{
          centro_comercial_id: validatedData.centroComercialId,
          codigo_local: validatedData.codigoLocal,
          area_m2: validatedData.areaM2,
          tipo_local: validatedData.tipoLocal,
          piso: validatedData.piso,
          estado: validatedData.estado,
          renta_mensual: validatedData.rentaMensual,
          caracteristicas: validatedData.caracteristicas,
          fotos_urls: validatedData.fotosUrls,
        }])
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error creating local:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al crear local' });
    }
  });

  // Admin route to get all contracts
  app.get("/api/contratos", authenticateUser, requireRole('CentroComercialAdmin'), async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('contratos_alquiler')
        .select(`
          *,
          local:locales_comerciales(codigo_local, area_m2, tipo_local),
          usuario:usuarios(email, datos_personales)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching contratos:', error);
      res.status(500).json({ error: 'Error al obtener contratos' });
    }
  });

  // Admin route to get all payments
  app.get("/api/pagos", authenticateUser, requireRole('CentroComercialAdmin'), async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('pagos_alquiler')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching pagos:', error);
      res.status(500).json({ error: 'Error al obtener pagos' });
    }
  });

  // Admin route to get all solicitudes
  app.get("/api/solicitudes", authenticateUser, requireRole('CentroComercialAdmin'), async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('solicitudes_informacion')
        .select(`
          *,
          local:locales_comerciales(codigo_local, tipo_local)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
  });

  // Public route for submitting a new solicitud
  app.post("/api/solicitudes", async (req, res) => {
    try {
      const validatedData = insertSolicitudInformacionSchema.parse(req.body);
      
      const { data, error } = await supabase
        .from('solicitudes_informacion')
        .insert([{
          local_id: validatedData.localId,
          nombre_contacto: validatedData.nombreContacto,
          email_contacto: validatedData.emailContacto,
          telefono_contacto: validatedData.telefonoContacto,
          mensaje: validatedData.mensaje,
          estado_solicitud: 'nueva',
        }])
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error creating solicitud:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error al crear solicitud' });
    }
  });

  // Admin route to update a solicitud
  app.patch("/api/solicitudes/:id", authenticateUser, requireRole('CentroComercialAdmin'), async (req, res) => {
    try {
      const { id } = req.params;
      const { estadoSolicitud } = req.body;

      const { data, error } = await supabaseAdmin
        .from('solicitudes_informacion')
        .update({ 
          estado_solicitud: estadoSolicitud,
          fecha_contacto: estadoSolicitud === 'contactada' ? new Date().toISOString() : undefined
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating solicitud:', error);
      res.status(400).json({ error: 'Error al actualizar solicitud' });
    }
  });

  // Authenticated route for browsing centros comerciales
  app.get("/api/centros", authenticateUser, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('centros_comerciales')
        .select('id, nombre, direccion')
        .order('nombre');

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching centros:', error);
      res.status(500).json({ error: 'Error al obtener centros' });
    }
  });

  // Admin route to update a local
  app.put("/api/locales/:id", authenticateUser, requireRole('CentroComercialAdmin'), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const { data, error } = await supabaseAdmin
        .from('locales_comerciales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error updating local:', error);
      res.status(400).json({ error: 'Error al actualizar local' });
    }
  });

  // Admin route to delete a local
  app.delete("/api/locales/:id", authenticateUser, requireRole('CentroComercialAdmin'), async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseAdmin
        .from('locales_comerciales')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting local:', error);
      res.status(400).json({ error: 'Error al eliminar local' });
    }
  });

  // Owner route to get their specific contract
  app.get("/api/mi-contrato", authenticateUser, requireRole('LocalOwner'), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'No autorizado - ID de usuario no encontrado' });
      }

      const { data, error } = await supabase
        .from('contratos_alquiler')
        .select(`
          *,
          local:locales_comerciales(*)
        `)
        .eq('usuario_id', userId)
        .eq('estado_contrato', 'activo')
        .limit(1)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error fetching mi contrato:', error);
      res.status(500).json({ error: 'Error al obtener contrato' });
    }
  });

  // Owner route to get their specific payments
  app.get("/api/mis-pagos", authenticateUser, requireRole('LocalOwner'), async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'No autorizado - ID de usuario no encontrado' });
      }
      
      // First, get the user's contract to identify the contract ID
      const { data: contrato, error: contratoError } = await supabase
        .from('contratos_alquiler')
        .select('id')
        .eq('usuario_id', userId)
        .limit(1)
        .single();

      if (contratoError || !contrato) {
        return res.status(404).json({ error: 'No se encontró un contrato para este usuario.' });
      }

      const { data, error } = await supabase
        .from('pagos_alquiler')
        .select('*')
        .eq('contrato_id', contrato.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Error fetching mis pagos:', error);
      res.status(500).json({ error: 'Error al obtener pagos' });
    }
  });

  // Admin/Developer route for system statistics
  app.get("/api/system/stats", authenticateUser, requireRole('CentroComercialAdmin', 'SystemDeveloper'), async (req, res) => {
    try {
      const [
        { count: totalUsers },
        { count: totalLocales },
        { count: totalContratos },
        { count: totalPagos }
      ] = await Promise.all([
        supabase.from('usuarios').select('*', { count: 'exact', head: true }),
        supabase.from('locales_comerciales').select('*', { count: 'exact', head: true }),
        supabase.from('contratos_alquiler').select('*', { count: 'exact', head: true }),
        supabase.from('pagos_alquiler').select('*', { count: 'exact', head: true }),
      ]);

      res.json({
        totalUsers: totalUsers || 0,
        totalLocales: totalLocales || 0,
        totalContratos: totalContratos || 0,
        totalPagos: totalPagos || 0,
        activeUsers: 0, 
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
