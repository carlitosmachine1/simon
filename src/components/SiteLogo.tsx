import React from 'react';

interface SiteLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showRings?: boolean;
}

export const SiteLogo: React.FC<SiteLogoProps> = ({
  size = 'md',
  className = '',
  showRings = true,
}) => {
  const sizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dim} ${className}`}
      title="Monitor Pacífico"
      aria-label="Monitor Pacífico"
    >
      <svg
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs select-none"
      >
        <defs>
          {/* Oceanic Radial Gradient */}
          <radialGradient id="logoOceanBg" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#2D6F7E" />
            <stop offset="60%" stopColor="#245A66" />
            <stop offset="100%" stopColor="#14363E" />
          </radialGradient>

          {/* Spiral Arm 1 Gradient */}
          <linearGradient id="logoSpiralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#E2F1F3" />
            <stop offset="85%" stopColor="#6DB1BD" />
            <stop offset="100%" stopColor="#245A66" stopOpacity="0" />
          </linearGradient>

          {/* Spiral Arm 2 Gradient */}
          <linearGradient id="logoSpiralGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#CFE7EA" />
            <stop offset="85%" stopColor="#4C96A3" />
            <stop offset="100%" stopColor="#245A66" stopOpacity="0" />
          </linearGradient>

          {/* Eye Radar Pulse */}
          <radialGradient id="logoEyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="55%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>
        </defs>

        {/* Circular Outer Badge */}
        <circle cx="64" cy="64" r="60" fill="url(#logoOceanBg)" />

        {showRings && (
          <>
            {/* Latitude Ring */}
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.22"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Inner Ring */}
            <circle
              cx="64"
              cy="64"
              r="47"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.12"
              strokeWidth="1"
            />
          </>
        )}

        {/* Cyclone Spiral Arm 1 (Northern Counter-Clockwise Spiral) */}
        <path
          d="M 64 24 
             C 88 24, 104 42, 102 65 
             C 100 83, 84 96, 68 94 
             C 56 92, 48 83, 50 72 
             C 52 63, 60 56, 68 59 
             C 74 61, 76 68, 72 73 
             C 70 76, 66 76, 64 74 
             C 62 72, 63 68, 66 67 
             C 76 67, 86 78, 81 92 
             C 74 106, 50 106, 36 94 
             C 20 80, 24 50, 46 34 
             C 52 30, 58 26, 64 24 Z"
          fill="url(#logoSpiralGrad1)"
        />

        {/* Cyclone Spiral Arm 2 (Inward Maritime Wave Crest) */}
        <path
          d="M 64 104 
             C 40 104, 24 86, 26 63 
             C 28 45, 44 32, 60 34 
             C 72 36, 80 45, 78 56 
             C 76 65, 68 72, 60 69 
             C 54 67, 52 60, 56 55 
             C 58 52, 62 52, 64 54 
             C 66 56, 65 60, 62 61 
             C 52 61, 42 50, 47 36 
             C 54 22, 78 22, 92 34 
             C 108 48, 104 78, 82 94 
             C 76 98, 70 102, 64 104 Z"
          fill="url(#logoSpiralGrad2)"
        />

        {/* Calm Central Core Eye */}
        <circle
          cx="64"
          cy="64"
          r="13"
          fill="#14363E"
          stroke="#FFFFFF"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />

        {/* Surveillance Radar Eye Dot (Amber Alert Core) */}
        <circle cx="64" cy="64" r="7" fill="url(#logoEyeGlow)" />
        <circle cx="64" cy="64" r="2.5" fill="#FFFFFF" opacity="0.9" />

        {/* Compass Cardinal Marks */}
        <line
          x1="64"
          y1="6"
          x2="64"
          y2="11"
          stroke="#FFFFFF"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="64"
          y1="117"
          x2="64"
          y2="122"
          stroke="#FFFFFF"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="64"
          x2="11"
          y2="64"
          stroke="#FFFFFF"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="117"
          y1="64"
          x2="122"
          y2="64"
          stroke="#FFFFFF"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
