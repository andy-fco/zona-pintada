import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Flame } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onSuccessRedirect?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccessRedirect,
}) => {
  const { signIn, signUp, error, clearError } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    clearError();
    setFormError(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setFormError("Por favor completá todos los campos requeridos.");
      return;
    }

    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setFormError("Las contraseñas no coinciden.");
        return;
      }
      if (!displayName.trim()) {
        setFormError("Por favor ingresá tu nombre de DT o apodo de juego.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        await signUp(email.trim(), password, displayName.trim());
        setSignupSuccess(true);
        setTimeout(() => {
          onClose();
          if (onSuccessRedirect) onSuccessRedirect();
        }, 800);
      } else {
        await signIn(email.trim(), password);
        onClose();
        if (onSuccessRedirect) onSuccessRedirect();
      }
    } catch (err: any) {
      // Error is stored in AuthContext and will be displayed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("dt.demo@zonapintada.com");
    setPassword("basket123");
    if (mode === "signup") {
      setConfirmPassword("basket123");
      setDisplayName("DT San Lorenzo Fan");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#111111] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Bar - Artistic Orange */}
        <div className="h-1.5 w-full bg-[#FF5C00]"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-auth-modal"
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-8 h-8 bg-[#FF5C00] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-500/20">
              <div className="w-5 h-5 border-2 border-black rounded-full"></div>
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
              {mode === "login" ? "Bienvenido al Juego" : "Crear Tu Franquicia"}
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {mode === "login"
                ? "Ingresá para gestionar tu plantilla oficial LNB"
                : "Registrate gratis con $110.000.000 de presupuesto"}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-black/50 border border-white/10 mb-6">
            <button
              type="button"
              id="tab-login-mode"
              onClick={() => {
                setMode("login");
                clearError();
                setFormError(null);
              }}
              className={`py-2 text-xs font-black uppercase italic tracking-widest transition-colors cursor-pointer ${
                mode === "login"
                  ? "bg-[#FF5C00] text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              id="tab-signup-mode"
              onClick={() => {
                setMode("signup");
                clearError();
                setFormError(null);
              }}
              className={`py-2 text-xs font-black uppercase italic tracking-widest transition-colors cursor-pointer ${
                mode === "signup"
                  ? "bg-[#FF5C00] text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Registrate
            </button>
          </div>

          {/* Error Alert Box */}
          {(formError || error) && (
            <div className="mb-4 p-3.5 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex flex-col gap-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-relaxed">{formError || error}</span>
              </div>
              {((error && error.includes("ya está registrado")) || (formError && formError.includes("ya está registrado"))) && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    clearError();
                    setFormError(null);
                  }}
                  className="mt-1 self-start px-3 py-1.5 bg-[#FF5C00] text-black font-bold uppercase tracking-wider text-[11px] rounded hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Ir a Iniciar Sesión</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Success Banner */}
          {signupSuccess && (
            <div className="mb-4 p-3.5 bg-[#FF5C00]/20 border border-[#FF5C00]/40 text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FF5C00]" />
              <span>¡Cuenta creada con éxito! Entrando al juego...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 ml-1 text-white block">
                  Nombre de DT / Franquicia
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    id="input-displayname"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej: DT Magnano, Quilmes Basket"
                    className="w-full bg-white/5 border border-white/10 rounded-none pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#FF5C00] transition-colors text-white placeholder-white/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 ml-1 text-white block">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  id="input-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.com"
                  className="w-full bg-white/5 border border-white/10 rounded-none pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#FF5C00] transition-colors text-white placeholder-white/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 ml-1 text-white block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  id="input-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-none pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#FF5C00] transition-colors text-white placeholder-white/20"
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 ml-1 text-white block">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="password"
                    id="input-confirm-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-none pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#FF5C00] transition-colors text-white placeholder-white/20"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-auth-submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#FF5C00] text-black font-black py-4 uppercase italic tracking-widest hover:bg-white transition-colors cursor-pointer text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Ingresando al juego...</span>
                </div>
              ) : (
                <>
                  <span>
                    {mode === "login" ? "Entrar a la Cancha" : "Comenzar con $110M"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternate mode toggle button */}
          <div className="mt-4">
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-[1px] bg-white/10"></div>
              <span className="text-[10px] uppercase opacity-30 tracking-widest font-bold">O cambiá de modo</span>
              <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                clearError();
                setFormError(null);
              }}
              className="w-full bg-transparent border border-white/20 text-white font-bold py-3.5 uppercase text-xs tracking-widest hover:border-white transition-colors cursor-pointer mt-1"
            >
              {mode === "login" ? "Crear Cuenta Nueva" : "Ya tengo cuenta (Login)"}
            </button>
          </div>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] uppercase tracking-widest">
            <div className="flex items-center gap-1.5 text-white/50 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span>Plataforma Oficial LNB</span>
            </div>
            <button
              type="button"
              id="btn-fill-demo"
              onClick={handleFillDemo}
              className="text-[#FF5C00] hover:text-white underline underline-offset-4 transition-colors cursor-pointer font-bold"
            >
              Autocompletar datos demo
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
