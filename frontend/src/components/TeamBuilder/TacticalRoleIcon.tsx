import React from "react";
import { TacticalRoleId } from "../../types/basketball";

interface TacticalRoleIconProps {
  roleId: TacticalRoleId;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const TacticalRoleIcon: React.FC<TacticalRoleIconProps> = ({
  roleId,
  size = "md",
  className = "",
}) => {
  // Dimensiones según el tamaño solicitado
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
    xl: "w-11 h-11",
  };

  const finalClass = `${sizeMap[size]} shrink-0 ${className}`;

  switch (roleId) {
    // 1. CAPITÁN (1.20x): Corona Dorada Real 3D con gemas pulidas y destellos
    case "CAPTAIN":
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={finalClass}
        >
          <defs>
            <linearGradient id="capGoldGrad" x1="4" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF176" />
              <stop offset="0.3" stopColor="#FFD54F" />
              <stop offset="0.7" stopColor="#FFA000" />
              <stop offset="1" stopColor="#E65100" />
            </linearGradient>
            <linearGradient id="capGoldRim" x1="6" y1="26" x2="30" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE082" />
              <stop offset="0.5" stopColor="#FFB300" />
              <stop offset="1" stopColor="#FF6F00" />
            </linearGradient>
            <radialGradient id="rubyShine" cx="50%" cy="50%" r="50%">
              <stop stopColor="#FF5252" />
              <stop offset="1" stopColor="#B71C1C" />
            </radialGradient>
            <filter id="capGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#FF8F00" floodOpacity="0.5" />
            </filter>
          </defs>
          <g filter="url(#capGlow)">
            {/* Cuerpo de la Corona */}
            <path
              d="M5 26L3 11L11.5 17.5L18 7L24.5 17.5L33 11L31 26H5Z"
              fill="url(#capGoldGrad)"
              stroke="#FFFDE7"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            {/* Base / Banda dorada */}
            <rect x="5" y="25" width="26" height="5.5" rx="1.5" fill="url(#capGoldRim)" stroke="#FFFDE7" strokeWidth="0.6" />
            {/* Joyas en las puntas */}
            <circle cx="18" cy="7" r="2.3" fill="#FFFFFF" stroke="#FFD54F" strokeWidth="0.5" />
            <circle cx="3" cy="11" r="1.8" fill="#FFF59D" />
            <circle cx="33" cy="11" r="1.8" fill="#FFF59D" />
            {/* Gemas en la banda */}
            <circle cx="18" cy="27.8" r="1.6" fill="url(#rubyShine)" />
            <circle cx="11" cy="27.8" r="1.2" fill="#00E5FF" />
            <circle cx="25" cy="27.8" r="1.2" fill="#00E5FF" />
            {/* Reflejo de luz */}
            <path d="M7 16L11.5 19.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          </g>
        </svg>
      );

    // 2. TIRADOR CLAVE (1.15x): Balón de Básquetbol con Llamas de Fuego Ardientes
    case "CO_CAPTAIN":
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={finalClass}
        >
          <defs>
            <linearGradient id="fireOuterGrad" x1="18" y1="2" x2="18" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF1744" />
              <stop offset="0.45" stopColor="#FF5722" />
              <stop offset="0.8" stopColor="#FF9100" />
              <stop offset="1" stopColor="#FFEA00" />
            </linearGradient>
            <linearGradient id="fireCoreGrad" cx="50%" cy="40%" r="50%">
              <stop stopColor="#FFF9C4" />
              <stop offset="0.6" stopColor="#FFD600" />
              <stop offset="1" stopColor="#FF6D00" />
            </linearGradient>
            <linearGradient id="ballShading" x1="10" y1="12" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF8A65" />
              <stop offset="0.4" stopColor="#FF5722" />
              <stop offset="1" stopColor="#BF360C" />
            </linearGradient>
            <filter id="fireGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#FF3D00" floodOpacity="0.5" />
            </filter>
          </defs>
          <g filter="url(#fireGlow)">
            {/* Estela de fuego exterior */}
            <path
              d="M18 2C15 6 10 9 10 16C10 17.5 10.4 19 11 20.3C12.5 17 15 15 17 14C16.5 16 16.5 18 17.5 19.5C19 16 22 13 22 8C24.5 11 26 14.5 26 18C26 19 25.8 20 25.4 20.9C27 19.2 28 16.8 28 14C28 8 22 4 18 2Z"
              fill="url(#fireOuterGrad)"
            />
            {/* Núcleo de llama interior */}
            <path
              d="M18 7C16 10 13 12 13 16C14 15 15.5 14.5 17 14.5C18.5 17 21 16 21 12C22.5 14 23 16 23 18C23.8 17 24 15.5 24 14C24 10.5 20.5 8 18 7Z"
              fill="url(#fireCoreGrad)"
              opacity="0.95"
            />
            {/* Pelota de básquetbol */}
            <circle cx="18" cy="24" r="9" fill="url(#ballShading)" stroke="#FFE0B2" strokeWidth="0.75" />
            {/* Costuras de la pelota */}
            <path d="M9 24H27" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" />
            <path d="M18 15V33" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" />
            <path d="M11.6 17.6C14.5 20 14.5 28 11.6 30.4" stroke="#1A1A1A" strokeWidth="0.9" strokeLinecap="round" />
            <path d="M24.4 17.6C21.5 20 21.5 28 24.4 30.4" stroke="#1A1A1A" strokeWidth="0.9" strokeLinecap="round" />
            {/* Brillo especular superior */}
            <ellipse cx="14.5" cy="19.5" rx="2.4" ry="1.2" transform="rotate(-30 14.5 19.5)" fill="#FFFFFF" opacity="0.65" />
          </g>
        </svg>
      );

    // 3. SEXTO HOMBRE (1.10x): Relámpago Neón 3D Eléctrico
    case "SIXTH_MAN":
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={finalClass}
        >
          <defs>
            <linearGradient id="voltGrad" x1="10" y1="3" x2="26" y2="33" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFF00" />
              <stop offset="0.3" stopColor="#FFD600" />
              <stop offset="0.7" stopColor="#FF9100" />
              <stop offset="1" stopColor="#FF3D00" />
            </linearGradient>
            <linearGradient id="voltHighlight" x1="12" y1="4" x2="24" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.4" stopColor="#FFFDE7" />
              <stop offset="1" stopColor="#FFD54F" />
            </linearGradient>
            <filter id="voltGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#FFD600" floodOpacity="0.6" />
            </filter>
          </defs>
          <g filter="url(#voltGlow)">
            {/* Relámpago exterior */}
            <path
              d="M21 3L7 19H17L13 33L29 15H19L21 3Z"
              fill="url(#voltGrad)"
              stroke="#FFFDE7"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            {/* Bisel iluminado central */}
            <path
              d="M20 5L9.5 18H16.5L14 28L25.5 16H18.5L20 5Z"
              fill="url(#voltHighlight)"
              opacity="0.85"
            />
            {/* Chispas de energía */}
            <circle cx="28" cy="8" r="1.4" fill="#FFFFFF" />
            <circle cx="6" cy="27" r="1.2" fill="#FFEA00" />
          </g>
        </svg>
      );

    // 4. ESPECIALISTA DEFENSIVO (1.05x): Escudo de Acero Blindado Azul / Cian con Cruz Reforzada
    case "DEFENSIVE":
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={finalClass}
        >
          <defs>
            <linearGradient id="shieldBorderGrad" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#80D8FF" />
              <stop offset="0.45" stopColor="#00B0FF" />
              <stop offset="1" stopColor="#0D47A1" />
            </linearGradient>
            <linearGradient id="shieldCenterGrad" x1="10" y1="8" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset="0.3" stopColor="#0091EA" />
              <stop offset="0.8" stopColor="#01579B" />
              <stop offset="1" stopColor="#002171" />
            </linearGradient>
            <filter id="shieldGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#00B0FF" floodOpacity="0.45" />
            </filter>
          </defs>
          <g filter="url(#shieldGlow)">
            {/* Escudo exterior reforzado */}
            <path
              d="M18 4L7 8V18C7 24.8 11.7 30.8 18 33C24.3 30.8 29 24.8 29 18V8L18 4Z"
              fill="url(#shieldBorderGrad)"
              stroke="#E1F5FE"
              strokeWidth="0.8"
            />
            {/* Interior del escudo */}
            <path
              d="M18 6.5L9.5 9.8V17.5C9.5 23.3 13.1 28.5 18 30.5C22.9 28.5 26.5 23.3 26.5 17.5V9.8L18 6.5Z"
              fill="url(#shieldCenterGrad)"
            />
            {/* Cruz defensiva cromada */}
            <path
              d="M18 11V26M13 16.5H23"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Bisel / Reflejo de luz */}
            <path
              d="M12 11L17 7.5V29C13.5 27 11 22.5 11 17.5V11H12Z"
              fill="#FFFFFF"
              opacity="0.28"
            />
          </g>
        </svg>
      );

    // 5. ROTACIÓN (0.75x): Doble Flecha Orbital Esmeralda & Turquesa Flúor
    case "ROTATION":
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={finalClass}
        >
          <defs>
            <linearGradient id="rotEmeraldGrad" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#69F0AE" />
              <stop offset="0.5" stopColor="#00E676" />
              <stop offset="1" stopColor="#00B0FF" />
            </linearGradient>
            <filter id="rotGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#00E676" floodOpacity="0.45" />
            </filter>
          </defs>
          <g filter="url(#rotGlow)">
            {/* Anillo de fondo sutil */}
            <circle cx="18" cy="18" r="13.5" fill="#003322" stroke="url(#rotEmeraldGrad)" strokeWidth="1.2" opacity="0.65" />
            {/* Flecha superior */}
            <path
              d="M18 7C23.8 7 28.5 11.7 28.5 17.5C28.5 19.2 28.1 20.8 27.4 22.2"
              stroke="url(#rotEmeraldGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <polygon points="20,4 20,10 26,7" fill="#69F0AE" />
            {/* Flecha inferior */}
            <path
              d="M18 29C12.2 29 7.5 24.3 7.5 18.5C7.5 16.8 7.9 15.2 8.6 13.8"
              stroke="url(#rotEmeraldGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <polygon points="16,32 16,26 10,29" fill="#00E676" />
            {/* Centro de actividad */}
            <circle cx="18" cy="18" r="3" fill="#FFFFFF" />
          </g>
        </svg>
      );

    // 6. SUPLENTE (0.50x): Butaca Deportiva LNB en Índigo / Violeta con Patas Cromadas
    case "BENCH":
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={finalClass}
        >
          <defs>
            <linearGradient id="benchPurpleGrad" x1="6" y1="8" x2="30" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B388FF" />
              <stop offset="0.5" stopColor="#7C4DFF" />
              <stop offset="1" stopColor="#304FFE" />
            </linearGradient>
            <filter id="benchGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#7C4DFF" floodOpacity="0.4" />
            </filter>
          </defs>
          <g filter="url(#benchGlow)">
            {/* Almohadón del asiento */}
            <rect x="7" y="19" width="22" height="6" rx="3" fill="url(#benchPurpleGrad)" stroke="#D1C4E9" strokeWidth="0.7" />
            {/* Respaldo ergonómico */}
            <path
              d="M10 8H26C27.1 8 28 8.9 28 10V18C28 19.1 27.1 20 26 20H10C8.9 20 8 19.1 8 18V10C8 8.9 8.9 8 10 8Z"
              fill="url(#benchPurpleGrad)"
              stroke="#D1C4E9"
              strokeWidth="0.7"
            />
            {/* Patas metálicas tubulares */}
            <path d="M10 25V31M26 25V31" stroke="#90CAF9" strokeWidth="2.2" strokeLinecap="round" />
            {/* Apoyabrazos */}
            <path d="M6 14V21M30 14V21" stroke="#D1C4E9" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    // 7. SUPLENTE PROFUNDO (0.25x): Ancla Táctica Metálica con Indicador LED
    case "DEEP_BENCH":
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={finalClass}
        >
          <defs>
            <linearGradient id="anchorMetalGrad" x1="8" y1="6" x2="28" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CFD8DC" />
              <stop offset="0.5" stopColor="#90A4AE" />
              <stop offset="1" stopColor="#455A64" />
            </linearGradient>
            <filter id="anchorGlow" x="-2" y="-2" width="40" height="40" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#90A4AE" floodOpacity="0.4" />
            </filter>
          </defs>
          <g filter="url(#anchorGlow)">
            {/* Anillo del ancla */}
            <circle cx="18" cy="9" r="4" stroke="url(#anchorMetalGrad)" strokeWidth="2.5" />
            {/* Mástil principal */}
            <line x1="18" y1="13" x2="18" y2="29" stroke="url(#anchorMetalGrad)" strokeWidth="3" strokeLinecap="round" />
            {/* Barra transversal */}
            <line x1="11" y1="17" x2="25" y2="17" stroke="url(#anchorMetalGrad)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Brazos curvos del ancla */}
            <path
              d="M8 22C8 28.5 12.5 32 18 32C23.5 32 28 28.5 28 22"
              stroke="url(#anchorMetalGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Luz LED central ámbar */}
            <circle cx="18" cy="9" r="1.5" fill="#FFAB00" />
          </g>
        </svg>
      );

    default:
      return null;
  }
};
