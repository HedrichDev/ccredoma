import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { usuarios, roles } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { RolNombre } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface AuthUser {
  id: string;
  email: string;
  rol: RolNombre;
  datosPersonales: {
    nombre?: string;
    [key: string]: unknown;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  rol: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string } | null> {
  const user = await db
    .select({
      id: usuarios.id,
      email: usuarios.email,
      passwordHash: usuarios.passwordHash,
      datosPersonales: usuarios.datosPersonales,
      rolNombre: roles.nombreRol,
    })
    .from(usuarios)
    .innerJoin(roles, eq(usuarios.rolId, roles.id))
    .where(eq(usuarios.email, email))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  const userData = user[0];
  const isValid = await verifyPassword(password, userData.passwordHash);

  if (!isValid) {
    return null;
  }

  const authUser: AuthUser = {
    id: userData.id,
    email: userData.email,
    rol: userData.rolNombre as RolNombre,
    datosPersonales: userData.datosPersonales as AuthUser["datosPersonales"],
  };

  const token = generateToken({
    userId: userData.id,
    email: userData.email,
    rol: userData.rolNombre,
  });

  return { user: authUser, token };
}

export async function signUp(
  nombre: string,
  email: string,
  password: string
): Promise<void> {
  // Check if user already exists
  const existingUser = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("El usuario ya existe");
  }

  // Get the default role for "VisitanteExterno"
  const role = await db
    .select()
    .from(roles)
    .where(eq(roles.nombreRol, "VisitanteExterno"))
    .limit(1);

  if (role.length === 0) {
    throw new Error("No se pudo encontrar el rol de VisitanteExterno");
  }

  const passwordHash = await hashPassword(password);

  await db.insert(usuarios).values({
    email,
    passwordHash,
    rolId: role[0].id,
    datosPersonales: { nombre },
    estado: "activo",
  });
}

export async function getUserById(userId: string): Promise<AuthUser | null> {
  const user = await db
    .select({
      id: usuarios.id,
      email: usuarios.email,
      datosPersonales: usuarios.datosPersonales,
      rolNombre: roles.nombreRol,
    })
    .from(usuarios)
    .innerJoin(roles, eq(usuarios.rolId, roles.id))
    .where(eq(usuarios.id, userId))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  const userData = user[0];
  return {
    id: userData.id,
    email: userData.email,
    rol: userData.rolNombre as RolNombre,
    datosPersonales: userData.datosPersonales as AuthUser["datosPersonales"],
  };
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  const user = await db
    .select({
      id: usuarios.id,
      email: usuarios.email,
      datosPersonales: usuarios.datosPersonales,
      rolNombre: roles.nombreRol,
    })
    .from(usuarios)
    .innerJoin(roles, eq(usuarios.rolId, roles.id))
    .where(eq(usuarios.email, email))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  const userData = user[0];
  return {
    id: userData.id,
    email: userData.email,
    rol: userData.rolNombre as RolNombre,
    datosPersonales: userData.datosPersonales as AuthUser["datosPersonales"],
  };
}

