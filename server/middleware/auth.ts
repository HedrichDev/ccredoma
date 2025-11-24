import { Request, Response, NextFunction } from "express";
import { verifyToken, getUserById } from "../auth";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
  };
}

export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autorizado - Token requerido" });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: "Token inválido" });
    }

    const user = await getUserById(payload.userId);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Usuario no encontrado o sin rol asignado" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Error de autenticación" });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res
        .status(403)
        .json({ error: "Acceso denegado - Permisos insuficientes" });
    }

    next();
  };
}
