import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DatosLnbProvider } from "./context/DatosLnbContext";
import { Navbar } from "./components/Navbar";
import { LandingHome } from "./components/LandingHome";
import { ProtectedDashboard } from "./components/ProtectedDashboard";
import { TeamBuilder } from "./components/TeamBuilder/TeamBuilder";
import { AuthModal } from "./components/AuthModal";
import { GlobalSearchModal } from "./components/Discovery/GlobalSearchModal";
import { Footer } from "./components/Footer";

function MainContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<"landing" | "builder" | "dashboard">("landing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenAuth = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleGoToDashboard = () => {
    if (user) {
      setCurrentView("dashboard");
    } else {
      handleOpenAuth("login");
    }
  };

  const handleGoToBuilder = () => {
    if (user) {
      setCurrentView("builder");
    } else {
      handleOpenAuth("login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-3 border-[#FF5C00] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-black italic tracking-wider uppercase text-white">
          ZONA PINTADA
        </div>
        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-white selection:bg-[#FF5C00] selection:text-black">
      {/* Navigation */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        currentView={currentView}
        setCurrentView={(view) => {
          if ((view === "dashboard" || view === "builder") && !user) {
            handleOpenAuth("login");
          } else {
            setCurrentView(view);
          }
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === "builder" ? (
          <TeamBuilder onGoToDashboard={handleGoToDashboard} />
        ) : currentView === "dashboard" && user ? (
          <ProtectedDashboard 
            onBackToLanding={() => setCurrentView("landing")} 
            onGoToTeamBuilder={handleGoToBuilder}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />
        ) : (
          <LandingHome
            onOpenAuth={handleOpenAuth}
            onGoToDashboard={handleGoToDashboard}
            onGoToBuilder={handleGoToBuilder}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Search & Discovery Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onGoToBuilder={() => {
          setIsSearchModalOpen(false);
          handleGoToBuilder();
        }}
        onGoToDashboard={() => {
          setIsSearchModalOpen(false);
          handleGoToDashboard();
        }}
      />

      {/* Auth Modal (Login & Signup) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccessRedirect={() => {
          setCurrentView("builder");
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DatosLnbProvider>
        <MainContent />
      </DatosLnbProvider>
    </AuthProvider>
  );
}
