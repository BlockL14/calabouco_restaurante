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

/** Coroa em traço (destaques “Desde 1991”). */
export const Crown = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4.5 17.5 3.5 8l4.6 3.6L12 5.5l3.9 6.1L20.5 8l-1 9.5Z" />
    <path d="M5 20h14" />
  </svg>
);

export const PizzaSlice = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 21 3.6 6.4A17 17 0 0 1 20.4 6.4Z" />
    <path d="M5.2 9.2a14 14 0 0 1 13.6 0" />
    <circle cx="10" cy="11.5" r="1.1" />
    <circle cx="14" cy="12.5" r="0.9" />
    <circle cx="12" cy="16" r="0.9" />
  </svg>
);

export const Candle = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 3.5c1.6 1.8 2 3.2 0 5-2-1.8-1.6-3.2 0-5Z" />
    <rect x="9" y="10.5" width="6" height="9" rx="0.8" />
    <path d="M6.5 20.5h11" />
  </svg>
);

export const Book = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" />
    <path d="M12 6.5v13" />
  </svg>
);

/** Moldura octogonal dos ícones de destaque, com pontos no alto e na base. */
export const Octagon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden focusable={false} className={className}>
    <path d="M22 3h20l19 19v20L42 61H22L3 42V22Z" stroke="currentColor" strokeWidth="1" />
    <circle cx="32" cy="3" r="1.6" fill="currentColor" />
    <circle cx="32" cy="61" r="1.6" fill="currentColor" />
  </svg>
);

/** Coroa cheia da marca (ornamento do nome, não substitui o brasão oficial). */
export const CrownMark = ({ className }: IconProps) => (
  <svg viewBox="0 0 40 26" aria-hidden focusable={false} className={className}>
    <path
      d="M5 20 3 7.5l7.3 5.4L20 2l9.7 10.9L37 7.5 35 20Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M5.5 23.5h29" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="20" cy="2" r="1.6" fill="currentColor" />
    <circle cx="3" cy="7.5" r="1.4" fill="currentColor" />
    <circle cx="37" cy="7.5" r="1.4" fill="currentColor" />
  </svg>
);

