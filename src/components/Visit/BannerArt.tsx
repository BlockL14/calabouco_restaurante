import wallAvif from '../../assets/textures/parede-visita.avif';
import wallWebp from '../../assets/textures/parede-visita.webp';

/* Ilustração da seção “Visite”: estandarte com a coroa e o nome da casa, pendurado
   num suporte de ferro, com um lampião aceso sobre a parede de pedra (gerada por
   scripts/make-visit-wall.mjs, com a luz no ponto do vidro do lampião: 705 × 320).
   Decorativa: o nome e o endereço reais estão no texto ao lado. */

const IRON = '#2a221e';

/** Voluta de ferro: espiral que termina num arco. */
function scroll(cx: number, cy: number, r: number, turns: number, flip = 1) {
  const pts: string[] = [];
  const steps = Math.round(turns * 28);
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const rr = r * (0.18 + (0.82 * i) / steps);
    pts.push(`${(cx + flip * rr * Math.cos(t)).toFixed(1)} ${(cy + rr * Math.sin(t)).toFixed(1)}`);
  }
  return `M${pts.join('L')}`;
}

const RINGS = [214, 298, 382, 466, 550, 628];
const BANNER = 'M188 164 L652 164 C654 420 648 700 650 968 L424 884 L192 920 C186 660 194 420 188 164 Z';
const BORDER = 'M206 184 L634 184 C636 420 631 690 632 940 L424 864 L209 896 C204 650 211 420 206 184 Z';

export function BannerArt() {
  return (
    <div className="banner-art" aria-hidden="true">
      <picture className="banner-art__wall">
        <source type="image/avif" srcSet={wallAvif} />
        <img src={wallWebp} alt="" width={840} height={1050} loading="lazy" decoding="async" />
      </picture>

      <svg className="banner-art__svg" viewBox="0 0 800 1000" fill="none" focusable="false">
        <defs>
          <linearGradient id="bn-iron" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a3f38" />
            <stop offset="0.45" stopColor="#221c19" />
            <stop offset="1" stopColor="#0c0a09" />
          </linearGradient>
          <linearGradient id="bn-cloth" x1="0" y1="164" x2="0" y2="968" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3b1016" />
            <stop offset="0.5" stopColor="#2b0b10" />
            <stop offset="1" stopColor="#170609" />
          </linearGradient>
          {/* Dobras verticais do tecido */}
          <linearGradient id="bn-folds" x1="188" y1="0" x2="652" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="0.42" />
            <stop offset="0.1" stopColor="#ffe6d2" stopOpacity="0.05" />
            <stop offset="0.24" stopColor="#000" stopOpacity="0.22" />
            <stop offset="0.4" stopColor="#ffe6d2" stopOpacity="0.07" />
            <stop offset="0.56" stopColor="#000" stopOpacity="0.2" />
            <stop offset="0.72" stopColor="#ffdcbe" stopOpacity="0.09" />
            <stop offset="0.87" stopColor="#000" stopOpacity="0.24" />
            <stop offset="1" stopColor="#000" stopOpacity="0.36" />
          </linearGradient>
          {/* Luz do lampião, à direita */}
          <linearGradient id="bn-lamp" x1="188" y1="0" x2="652" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0.5" stopColor="#ffa24f" stopOpacity="0" />
            <stop offset="1" stopColor="#ffa24f" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="bn-gold" x1="0" y1="330" x2="0" y2="640" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f1d7a4" />
            <stop offset="0.55" stopColor="#d2ad74" />
            <stop offset="1" stopColor="#a8804a" />
          </linearGradient>
          <radialGradient id="bn-glass" cx="0.5" cy="0.5" r="0.62">
            <stop offset="0" stopColor="#fff1c4" />
            <stop offset="0.35" stopColor="#ffc56b" />
            <stop offset="0.75" stopColor="#c7661f" />
            <stop offset="1" stopColor="#5e2a0c" />
          </radialGradient>
          <radialGradient id="bn-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffbd72" stopOpacity="0.5" />
            <stop offset="0.35" stopColor="#ff9a4a" stopOpacity="0.14" />
            <stop offset="1" stopColor="#ff9a4a" stopOpacity="0" />
          </radialGradient>
          <filter id="bn-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* Sombra do estandarte na parede (a luz vem da direita) */}
        <path d={BANNER} fill="#000" fillOpacity="0.55" transform="translate(-34 18)" filter="url(#bn-soft)" />

        {/* Suporte de ferro: chapa na parede, mão-francesa com volutas e haste */}
        <rect x="766" y="66" width="24" height="172" rx="4" fill="url(#bn-iron)" stroke="#000" strokeOpacity="0.6" />
        <circle cx="778" cy="88" r="3.5" fill="#5a4c44" />
        <circle cx="778" cy="216" r="3.5" fill="#5a4c44" />
        <g stroke={IRON} strokeWidth="5" strokeLinecap="round">
          <path d="M768 90 C660 92 540 112 430 150" />
          <path d={scroll(560, 128, 26, 1.6)} strokeWidth="4" />
          <path d={scroll(660, 112, 22, 1.5, -1)} strokeWidth="4" />
          <path d={scroll(480, 136, 18, 1.4, -1)} strokeWidth="3.5" />
          <path d="M600 104 C620 80 650 72 676 80" strokeWidth="3.5" />
        </g>
        {/* Reflexo da luz do lampião no ferro */}
        <g stroke="#a3826a" strokeOpacity="0.45" strokeWidth="1.3" fill="none" strokeLinecap="round">
          <path d="M768 88 C660 90 540 110 430 148" />
          <path d={scroll(560, 128, 26, 1.6)} transform="translate(0.8 -1.2)" />
          <path d={scroll(660, 112, 22, 1.5, -1)} transform="translate(0.8 -1.2)" />
          <path d="M600 102 C620 78 650 70 676 78" />
          <path d="M152 147h620" />
        </g>
        <rect x="150" y="145" width="624" height="10" rx="5" fill="url(#bn-iron)" />
        <path d="M150 150 128 140 110 150 128 160Z" fill="url(#bn-iron)" />
        <circle cx="152" cy="150" r="8" fill="url(#bn-iron)" />

        {/* Argolas */}
        {RINGS.map((x) => (
          <circle key={x} cx={x} cy="160" r="10" stroke={IRON} strokeWidth="4" />
        ))}

        {/* Estandarte */}
        <path d={BANNER} fill="url(#bn-cloth)" />
        <path d={BANNER} fill="url(#bn-folds)" />
        <path d={BANNER} fill="url(#bn-lamp)" />
        <path d={BANNER} fill="#000" fillOpacity="0.14" />
        <path d="M188 164h464v22H188Z" fill="#000" fillOpacity="0.28" />
        <path d={BORDER} stroke="#b88f57" strokeOpacity="0.85" strokeWidth="2" />
        <path d={BORDER} stroke="#b88f57" strokeOpacity="0.35" strokeWidth="1" transform="translate(420 520) scale(0.965) translate(-420 -520)" />

        {/* Coroa e nome bordados */}
        <g transform="translate(345 318) scale(3.125)" fill="url(#bn-gold)">
          <path
            d="M8.5 22 5 10.5l6.4 4.6L15.5 7l4.6 7.4L24 5.5l3.9 8.9L32.5 7l4.1 8.1 6.4-4.6L39.5 22Z"
            fillOpacity="0.85"
            stroke="#f6e2b8"
            strokeOpacity="0.6"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          <path d="M9 22.6h30v4.4H9Z" />
          <path d="M24 0.6v4.6M21.9 2.4h4.2" stroke="#e9cf9c" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="5" cy="10.5" r="1.5" />
          <circle cx="15.5" cy="7" r="1.4" />
          <circle cx="32.5" cy="7" r="1.4" />
          <circle cx="43" cy="10.5" r="1.5" />
          <circle cx="24" cy="24.8" r="1.1" fill="#4c151a" />
          <circle cx="16.5" cy="24.8" r="0.9" fill="#4c151a" />
          <circle cx="31.5" cy="24.8" r="0.9" fill="#4c151a" />
        </g>
        <text
          x="420"
          y="560"
          textAnchor="middle"
          fill="url(#bn-gold)"
          fontFamily="'Cinzel Variable', Cinzel, Georgia, serif"
          fontSize="58"
          fontWeight="500"
          letterSpacing="1.5"
        >
          CALABOUÇO
        </text>
        <text
          x="420"
          y="606"
          textAnchor="middle"
          fill="url(#bn-gold)"
          fontFamily="'Cinzel Variable', Cinzel, Georgia, serif"
          fontSize="17.5"
          fontWeight="500"
          letterSpacing="3.2"
        >
          RESTAURANTE E PIZZARIA
        </text>

        {/* Lampião */}
        <circle cx="705" cy="318" r="250" fill="url(#bn-glow)" className="banner-art__glow" />
        <g>
          <path d="M705 155v14" stroke={IRON} strokeWidth="4" />
          <circle cx="705" cy="175" r="6" stroke={IRON} strokeWidth="3" />
          <circle cx="705" cy="186" r="5" fill="url(#bn-iron)" />
          <path d="M688 196h34l20 34h-74Z" fill="url(#bn-iron)" />
          <path d="M660 230h90v8h-90Z" fill="url(#bn-iron)" />
          <rect x="672" y="238" width="66" height="160" fill="url(#bn-glass)" />
          <path d="M705 294c10 13 12 25 0 38-12-13-10-25 0-38Z" fill="#fffaf0" />
          <path d="M672 238v160M694 238v160M716 238v160M738 238v160" stroke={IRON} strokeWidth="3.5" />
          <path d="M670 318h70" stroke={IRON} strokeWidth="2" strokeOpacity="0.8" />
          <path d="M664 398h82l-12 22h-58Z" fill="url(#bn-iron)" />
          <path d="M705 420v20" stroke={IRON} strokeWidth="4" />
          <circle cx="705" cy="446" r="6" fill="url(#bn-iron)" />
        </g>
      </svg>
    </div>
  );
}
