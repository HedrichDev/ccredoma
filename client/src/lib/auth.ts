import { supabase } from './supabase';
import type { RolNombre } from '@shared/schema';

export interface AuthUser {
  id: string;
  email: string;
  rol: RolNombre;
  datosPersonales: any;
}

export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message || 'Error al iniciar sesión');
  }

  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .select(`
      id,
      email,
      datos_personales,
      rol_id,
      roles (nombre_rol)
    `)
    .eq('email', email)
    .single();

  if (userError || !userData) {
    throw new Error('Usuario no encontrado en la base de datos');
  }

  return {
    id: userData.id,
    email: userData.email,
    rol: userData.roles.nombre_rol as RolNombre,
    datosPersonales: userData.datos_personales,
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: userData, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      email,
      datos_personales,
      rol_id,
      roles (nombre_rol)
    `)
    .eq('email', user.email)
    .single();

  if (error || !userData) {
    return null;
  }

  return {
    id: userData.id,
    email: userData.email,
    rol: userData.roles.nombre_rol as RolNombre,
    datosPersonales: userData.datos_personales,
  };
}
