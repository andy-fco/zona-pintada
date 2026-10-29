import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login,
  registrar,
  obtenerUsuarioActual,
  logout,
  RegistroRequest,
  RolUsuario,
  UsuarioResponse,
} from "../api/authApi";
import { getToken } from "../api/client";
import { syncUserProfile } from "../lib/rosterService";

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  rol: RolUsuario;
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  signIn: (identificador: string, pass: string) => Promise<void>;
  signUp: (datos: RegistroRequest) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convierte el usuario de Spring al formato que ya usan las pantallas
const toAppUser = (u: UsuarioResponse): AppUser => ({
  uid: String(u.id),
  displayName: u.usuario,
  email: u.mail,
  rol: u.rol,
});

function mensajeDeError(err: unknown): string {
  if (err instanceof TypeError || (err instanceof Error && err.message === "Error 500")) {
    return "No se pudo conectar con el servidor. chequear si esta corriendo el back";
  }
  if (err instanceof Error) return err.message;
  return "Ocurrio un error. Intenta nuevamente.";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Al abrir la app si hay token guardado, pregunta al back quien es
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    obtenerUsuarioActual()
      .then((u) => setUser(toAppUser(u)))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const clearError = () => setError(null);

  const signIn = async (identificador: string, pass: string) => {
    setError(null);
    try {
      await login(identificador, pass);
      const appUser = toAppUser(await obtenerUsuarioActual());
      setUser(appUser);
      syncUserProfile({ uid: appUser.uid, email: appUser.email, displayName: appUser.displayName });
    } catch (err) {
      const message = mensajeDeError(err);
      setError(message);
      throw new Error(message);
    }
  };

  const signUp = async (datos: RegistroRequest) => {
    setError(null);
    try {
      await registrar(datos);
    } catch (err) {
      const message = mensajeDeError(err);
      setError(message);
      throw new Error(message);
    }
    await signIn(datos.usuario, datos.password);
  };

  const signOut = async () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};