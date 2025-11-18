import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
  };
}

export async function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado - Token requerido' });
    }

    const token = authHeader.substring(7);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select(`
        id,
        email,
        rol_id,
        roles (nombre_rol)
      `)
      .eq('email', user.email)
      .single();

    if (userError || !userData || !userData.roles || !Array.isArray(userData.roles) || userData.roles.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado o sin rol asignado' });
    }

    req.user = {
      id: userData.id,
      email: userData.email,
      rol: userData.roles[0].nombre_rol,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Error de autenticación' });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Acceso denegado - Permisos insuficientes' });
    }

    next();
  };
}
