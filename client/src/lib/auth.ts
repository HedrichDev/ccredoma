import { supabase } from "./supabase";
import type { RolNombre } from "@shared/schema";

export interface AuthUser {
  id: string;
  email: string;
  rol: RolNombre;
  datosPersonales: {
    nombre?: string;
    [key: string]: any;
  };
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message || "Error al iniciar sesión");
  }

  const { data: userData, error: userError } = await supabase
    .from("usuarios")
    .select(
      `
      id,
      email,
      datos_personales,
      rol_id,
      roles (nombre_rol)
    `
    )
    .eq("email", email)
    .single();

  if (userError || !userData || !userData.roles) {
    throw new Error("Usuario no encontrado o sin rol asignado");
  }

  return {
    id: userData.id,
    email: userData.email,
    rol: userData.roles.nombre_rol as RolNombre,
    datosPersonales: userData.datos_personales,
  };
}

export async function signUp(
  nombre: string,
  email: string,
  password: string
): Promise<void> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message || "Error al registrarse");
  }

  // Get the default role for "VisitanteExterno"
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("nombre_rol", "VisitanteExterno")
    .single();

  if (roleError || !roleData) {
    throw new Error("No se pudo encontrar el rol de VisitanteExterno");
  }

  // Insert user data into the 'usuarios' table
  const { error: insertError } = await supabase.from("usuarios").insert({
    id: data.user.id,
    email: data.user.email,
    password_hash: "SET_BY_SUPABASE_AUTH", // Password is handled by Supabase Auth
    rol_id: roleData.id,
    datos_personales: { nombre },
    estado: "activo", // Default status
  });

  if (insertError) {
    throw new Error(
      insertError.message || "Error al guardar los datos del usuario"
    );
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: userData, error } = await supabase
    .from("usuarios")
    .select(
      `
      id,
      email,
      datos_personales,
      rol_id,
      roles (nombre_rol)
    `
    )
    .eq("email", user.email)
    .single();

  if (error || !userData || !userData.roles) {
    return null;
  }

  return {
    id: userData.id,
    email: userData.email,
    rol: userData.roles.nombre_rol as RolNombre,
    datosPersonales: userData.datos_personales,
  };
}
