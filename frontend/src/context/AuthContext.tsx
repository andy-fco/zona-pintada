import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { syncUserProfile } from "../lib/rosterService";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapAuthError(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado en Zona Pintada. Por favor iniciá sesión.";
    case "auth/invalid-email":
      return "El formato del correo electrónico no es válido.";
    case "auth/weak-password":
      return "La contraseña es muy débil. Debe tener un mínimo de 6 caracteres.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "El correo electrónico o la contraseña son incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Por favor esperá unos minutos e intentá de nuevo.";
    case "auth/network-request-failed":
      return "Hubo un problema de conexión. Comprobá tu acceso a internet e intentá nuevamente.";
    default:
      return "Ocurrió un error al procesar la solicitud. Intentá nuevamente.";
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        syncUserProfile({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const signIn = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error("Firebase Auth SignIn Error:", err);
      const message = mapAuthError(err.code || "");
      setError(message);
      throw new Error(message);
    }
  };

  const signUp = async (email: string, pass: string, displayName: string) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const cleanName = displayName.trim();
      if (cleanName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: cleanName
        });
        const updated = { ...userCredential.user, displayName: cleanName } as User;
        setUser(updated);
        await syncUserProfile({
          uid: updated.uid,
          email: updated.email,
          displayName: cleanName
        });
      }
    } catch (err: any) {
      console.error("Firebase Auth SignUp Error:", err);
      const message = mapAuthError(err.code || "");
      setError(message);
      throw new Error(message);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error("Firebase Auth SignOut Error:", err);
      setError("No se pudo cerrar la sesión.");
    }
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
