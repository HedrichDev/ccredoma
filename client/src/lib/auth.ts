import type { RolNombre } from "@shared/schema";

export interface AuthUser {
  id: string;
  email: string;
  rol: RolNombre;
  datosPersonales: {
    nombre?: string;
    [key: string]: unknown;
  };
}

const API_URL = import.meta.env.VITE_API_URL || "";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: headers as HeadersInit,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || `Error: ${response.statusText}`);
  }

  return response.json();
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthUser> {
  const data = await apiRequest<{ token: string; user: AuthUser }>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", data.token);
  return data.user;
}

export async function signUp(
  nombre: string,
  email: string,
  password: string
): Promise<void> {
  await apiRequest<{ success: boolean }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ nombre, email, password }),
  });
}

export async function signOut(): Promise<void> {
  localStorage.removeItem("token");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const user = await apiRequest<AuthUser>("/api/auth/me");
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    localStorage.removeItem("token");
    return null;
  }
}
