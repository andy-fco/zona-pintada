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
    // CAPITÁN (1.20x): Corona Dorada Real 3D con gemas pulidas y destellos
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

    // SEXTO HOMBRE (0.80x): Relámpago Neón 3D Eléctrico
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

    // NORMAL: Doble Flecha Orbital Esmeralda & Turquesa Flúor
    case "NORMAL":
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


    default:
      return null;
  }
};
