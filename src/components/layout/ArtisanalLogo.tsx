/**
 * ArtisanalLogo — Logo vectoriel premium de Perlipimpon.
 * Design : Pendentif avec pierre de lune et filigrane doré.
 */

interface ArtisanalLogoProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export default function ArtisanalLogo({ className, size = 42, style }: ArtisanalLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        {/* Dégradé pour la Pierre de Lune */}
        <radialGradient id="moonstoneGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e3f2fd" />
          <stop offset="100%" stopColor="#bbdefb" />
        </radialGradient>
        
        {/* Lueur magique */}
        <filter id="magicGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Attache du pendentif */}
      <path d="M46 10 C46 5, 54 5, 54 10 C54 15, 46 15, 46 10" stroke="#b08d57" strokeWidth="2" />
      
      {/* Cadre extérieur orné */}
      <circle cx="50" cy="55" r="38" stroke="#b08d57" strokeWidth="1" strokeDasharray="1 3" />
      <circle cx="50" cy="55" r="35" stroke="#b08d57" strokeWidth="1.5" />
      
      {/* Ornementations filigranes */}
      <path d="M50 20 C40 20, 30 30, 30 55 C30 80, 40 90, 50 90" stroke="#b08d57" strokeWidth="1" />
      <path d="M50 20 C60 20, 70 30, 70 55 C70 80, 60 90, 50 90" stroke="#b08d57" strokeWidth="1" />
      
      {/* Petites feuilles / Bourgeons */}
      <path d="M30 40 Q25 40, 25 35 Q25 30, 30 35 Z" fill="#b08d57" opacity="0.8" />
      <path d="M70 40 Q75 40, 75 35 Q75 30, 70 35 Z" fill="#b08d57" opacity="0.8" />
      <path d="M50 90 Q50 95, 45 95 Q40 95, 45 90 Z" fill="#b08d57" opacity="0.8" />
      <path d="M50 90 Q50 95, 55 95 Q60 95, 55 90 Z" fill="#b08d57" opacity="0.8" />

      {/* Pierre de Lune centrale */}
      <ellipse 
        cx="50" 
        cy="55" 
        rx="22" 
        ry="28" 
        fill="url(#moonstoneGrad)" 
        filter="url(#magicGlow)"
        stroke="#e3f2fd"
        strokeWidth="0.5"
      />
      
      {/* Reflets sur la pierre */}
      <path d="M42 45 Q45 40, 48 45" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
