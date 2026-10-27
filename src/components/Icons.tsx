// Ícones em traço, desenhados numa grade de 24 unidades.

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

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

export const ExternalArrow = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const Phone = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
);

export const Pin = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.25" />
  </svg>
);

/** Seta de navegação (como chegar). */
export const Route = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M3.5 11.2 20.5 3.5l-7.7 17-1.9-7.4Z" />
  </svg>
);

export const Instagram = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const Clock = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Plus = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Minus = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 12h14" />
  </svg>
);

/** Arco de tijolos (ambiente). */
export const Arch = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 21V11a8 8 0 0 1 16 0v10" />
    <path d="M8.5 21v-8.5a3.5 3.5 0 0 1 7 0V21" />
    <path d="M4 15.5h4.5M15.5 15.5H20M5.4 7.2l3.4 2.1M18.6 7.2l-3.4 2.1M12 3v4.6M3 21h18" />
  </svg>
);

/** Fatia de pizza (pizzas da casa). */
export const PizzaSlice = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 21 3.6 6.4A17 17 0 0 1 20.4 6.4Z" />
    <path d="M5.2 9.2a14 14 0 0 1 13.6 0" />
    <circle cx="10" cy="11.6" r="1.1" />
    <circle cx="14" cy="12.6" r="0.9" />
    <circle cx="12" cy="16" r="0.9" />
  </svg>
);

/** Coroa em traço. */
export const Crown = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4.5 17.5 3.5 8l4.6 3.6L12 5.5l3.9 6.1L20.5 8l-1 9.5Z" />
    <path d="M5 20.5h14" />
  </svg>
);

/** Coroa cheia da marca (ornamento do nome, não substitui o brasão oficial). */
export const CrownMark = ({ className }: IconProps) => (
  <svg viewBox="0 0 48 30" aria-hidden focusable={false} className={className}>
    <path
      d="M8.5 22 5 10.5l6.4 4.6L15.5 7l4.6 7.4L24 5.5l3.9 8.9L32.5 7l4.1 8.1 6.4-4.6L39.5 22Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M9 22.6h30v4.4H9Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M24 0.6v4.6M21.9 2.4h4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="5" cy="10.5" r="1.7" fill="currentColor" />
    <circle cx="15.5" cy="7" r="1.6" fill="currentColor" />
    <circle cx="32.5" cy="7" r="1.6" fill="currentColor" />
    <circle cx="43" cy="10.5" r="1.7" fill="currentColor" />
  </svg>
);
