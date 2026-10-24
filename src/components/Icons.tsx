// Ícones em traço fino, desenhados para combinar com as divisórias da página.

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export const ArrowLeft = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ArrowRight = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUp = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const Close = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const MenuIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 8h16M4 16h10" />
  </svg>
);

export const Pin = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.25" />
  </svg>
);

export const Phone = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);

export const Instagram = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const Expand = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" />
  </svg>
);

export const Plus = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/** Ornamento discreto: losango entre filetes, usado como separador editorial. */
export const Ornament = ({ className }: IconProps) => (
  <svg viewBox="0 0 120 12" fill="none" aria-hidden focusable={false} className={className}>
    <path d="M0 6h50M70 6h50" stroke="currentColor" strokeWidth="0.75" />
    <path d="M60 1.5 64.5 6 60 10.5 55.5 6Z" stroke="currentColor" strokeWidth="0.75" />
    <circle cx="60" cy="6" r="1" fill="currentColor" />
  </svg>
);

export const Clock = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

/* Ícones dos destaques: desenho dourado com preenchimento suave, no estilo das
   ilustrações da interface aprovada (24 unidades de grade ampliadas para 48). */
const glyph = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

/** Coroa (destaque “Desde 1991”). */
export const Crown = ({ className }: IconProps) => (
  <svg {...glyph} className={className}>
    <path d="M10 33 7 15l8.5 7L24 9l8.5 13L41 15l-3 18Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M12.5 28.5c3.6-1.6 7.5-2.4 11.5-2.4s7.9.8 11.5 2.4" />
    <path d="M10 33h28v5H10Z" fill="currentColor" fillOpacity="0.35" />
    <circle cx="7" cy="15" r="1.8" fill="currentColor" />
    <circle cx="41" cy="15" r="1.8" fill="currentColor" />
    <path d="M24 3.5v4M22 5.3h4" />
    <circle cx="24" cy="9.5" r="1.6" fill="currentColor" />
    <path d="m24 31.2 1.8 2.3-1.8 2.3-1.8-2.3Z" fill="currentColor" />
    <circle cx="16" cy="35.5" r="1" fill="currentColor" />
    <circle cx="32" cy="35.5" r="1" fill="currentColor" />
  </svg>
);

/** Pizza com uma fatia se soltando (destaque “Pizzaria à la carte”). */
export const PizzaSlice = ({ className }: IconProps) => (
  <svg {...glyph} className={className}>
    <path d="M22 25 34.99 17.5A15 15 0 1 0 36.1 30.13Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M31.96 19.25A11.5 11.5 0 1 0 32.8 28.93" strokeOpacity="0.7" />
    <path d="M26 25.5 38.99 18A15 15 0 0 1 40.1 30.63Z" fill="currentColor" fillOpacity="0.38" />
    <circle cx="15.5" cy="20.5" r="1.8" fill="currentColor" />
    <circle cx="23.5" cy="15.5" r="1.6" fill="currentColor" />
    <circle cx="13.5" cy="28.5" r="1.6" fill="currentColor" />
    <circle cx="21.5" cy="32.5" r="1.8" fill="currentColor" />
    <circle cx="27" cy="33" r="1.3" fill="currentColor" />
    <circle cx="34" cy="24.8" r="1.6" fill="currentColor" />
  </svg>
);

/** Arco de tijolos com uma vela acesa (destaque “Ambiente medieval”). */
export const Candle = ({ className }: IconProps) => (
  <svg {...glyph} className={className}>
    <path d="M9 41V21a15 15 0 0 1 30 0v20" />
    <path d="M14 41V22a10 10 0 0 1 20 0v19Z" fill="currentColor" fillOpacity="0.16" />
    <path d="M9 41h30" />
    <path d="M10.6 14.6 15 17.4M15.9 9 18.5 13M24 6.4V11M32.1 9 29.5 13M37.4 14.6 33 17.4" strokeOpacity="0.75" />
    <path d="M24 19.5c2.2 2.3 2.8 4.1 0 6.4-2.8-2.3-2.2-4.1 0-6.4Z" fill="currentColor" />
    <path d="M21.6 28h4.8v8.5h-4.8Z" fill="currentColor" fillOpacity="0.45" />
    <path d="M18.5 36.5h11" />
  </svg>
);

/** Prato com garfo e faca (destaque “Cardápio variado”). */
export const Book = ({ className }: IconProps) => (
  <svg {...glyph} className={className}>
    <circle cx="24" cy="24" r="12" fill="currentColor" fillOpacity="0.16" />
    <circle cx="24" cy="24" r="12" />
    <circle cx="24" cy="24" r="7.5" strokeOpacity="0.7" />
    <path d="M7.5 9v8.2a2.5 2.5 0 0 0 2.5 2.5h0a2.5 2.5 0 0 0 2.5-2.5V9M10 9v30" />
    <path d="M39.5 39V9c-2.8 1.8-4.2 5.5-4.2 10.6 0 2.4 1.9 3.4 4.2 3.4" fill="currentColor" fillOpacity="0.3" />
    <path d="M24 19.8 25.3 23l3.2 1-3.2 1-1.3 3.2-1.3-3.2-3.2-1 3.2-1Z" fill="currentColor" />
  </svg>
);

/** Moldura octogonal dos ícones de destaque, com marcas no alto, na base e nas laterais. */
export const Octagon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden focusable={false} className={className}>
    <path d="M22 3h20l19 19v20L42 61H22L3 42V22Z" stroke="currentColor" strokeWidth="1" />
    <path d="M32 1.2 33.8 3 32 4.8 30.2 3Z" fill="currentColor" />
    <path d="M32 59.2 33.8 61 32 62.8 30.2 61Z" fill="currentColor" />
    <circle cx="3" cy="32" r="1.1" fill="currentColor" />
    <circle cx="61" cy="32" r="1.1" fill="currentColor" />
  </svg>
);

/** Coroa da marca, com cruz ao centro (ornamento do nome, não substitui o brasão oficial). */
export const CrownMark = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 30" aria-hidden focusable={false} className={className}>
    <path
      d="M8.5 22 5 10.5l6.4 4.6L15.5 7l4.6 7.4L24 5.5l3.9 8.9L32.5 7l4.1 8.1 6.4-4.6L39.5 22Z"
      fill="currentColor"
      fillOpacity="0.28"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M9 22.6h30v4.4H9Z" fill="currentColor" fillOpacity="0.45" stroke="currentColor" strokeWidth="1.1" />
    <path d="M24 0.6v4.6M21.9 2.4h4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="5" cy="10.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="7" r="1.4" fill="currentColor" />
    <circle cx="32.5" cy="7" r="1.4" fill="currentColor" />
    <circle cx="43" cy="10.5" r="1.5" fill="currentColor" />
    <circle cx="24" cy="24.8" r="1.1" fill="currentColor" />
    <circle cx="16.5" cy="24.8" r="0.9" fill="currentColor" />
    <circle cx="31.5" cy="24.8" r="0.9" fill="currentColor" />
  </svg>
);
