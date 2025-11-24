import { Request, Response, NextFunction } from "express";
import { verifyToken, getUserById } from "../auth";
import { logger } from "../logger";

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
      logger.warn("Intento de acceso sin token", {
        prefix: "AUTH",
        timestamp: false,
      });
      return res.status(401).json({ error: "No autorizado - Token requerido" });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      logger.warn("Token inválido o expirado", {
        prefix: "AUTH",
        timestamp: false,
      });
      return res.status(401).json({ error: "Token inválido" });
    }

    const user = await getUserById(payload.userId);

    if (!user) {
      logger.warn(`Usuario no encontrado: ${payload.userId}`, {
        prefix: "AUTH",
        timestamp: false,
      });
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
    logger.error("Error en autenticación", error, { prefix: "AUTH" });
    res.status(500).json({ error: "Error de autenticación" });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      logger.warn(
        `Acceso denegado: ${req.user.email} (${req.user.rol}) intentó acceder a recurso que requiere: ${allowedRoles.join(", ")}`,
        { prefix: "AUTH", timestamp: false }
      );
      return res
        .status(403)
        .json({ error: "Acceso denegado - Permisos insuficientes" });
    }

    next();
  };
}
