/* ---------- Coroa dourada em perspectiva (ilustração) ----------
   Aro elíptico visto de cima, pontas na frente e atrás, pérolas e rubis.
   Não há foto confirmada da Coroa Real nos materiais, então o destaque é ilustrado. */

const CX = 200;
const RIM_Y = 196;
const RX = 140;
const RY = 28;
const BAND = 52;

const rad = (deg: number) => (deg * Math.PI) / 180;
const onRim = (deg: number, dy = 0) => ({ x: CX + RX * Math.cos(rad(deg)), y: RIM_Y + dy + RY * Math.sin(rad(deg)) });
const f = (n: number) => n.toFixed(1);

/** Ponta da coroa: base apoiada no aro, laterais côncavas e leve abertura para fora. */
function spike(deg: number, height: number, width: number) {
  const base = onRim(deg);
  const w = width * Math.max(0.55, Math.abs(Math.sin(rad(deg))));
  const lean = Math.cos(rad(deg)) * 9;
  const tip = { x: base.x + lean, y: base.y - height };
  const l = { x: base.x - w / 2, y: base.y };
  const r = { x: base.x + w / 2, y: base.y };
  const d = [
    `M${f(l.x)} ${f(l.y)}`,
    `C${f(l.x + w * 0.2)} ${f(l.y - height * 0.34)} ${f(tip.x - w * 0.13)} ${f(tip.y + height * 0.42)} ${f(tip.x)} ${f(tip.y)}`,
    `C${f(tip.x + w * 0.13)} ${f(tip.y + height * 0.42)} ${f(r.x - w * 0.2)} ${f(r.y - height * 0.34)} ${f(r.x)} ${f(r.y)}Z`,
  ].join('');
  // Nervura central e folha interna, para dar volume
  const ridge = `M${f(base.x)} ${f(base.y - 4)}Q${f(base.x + lean * 0.4)} ${f(base.y - height * 0.55)} ${f(tip.x)} ${f(tip.y + 8)}`;
  const leaf = [
    `M${f(base.x - w * 0.22)} ${f(base.y - 3)}`,
    `C${f(base.x - w * 0.05)} ${f(base.y - height * 0.3)} ${f(base.x + lean * 0.5)} ${f(base.y - height * 0.4)} ${f(base.x + lean * 0.55)} ${f(base.y - height * 0.52)}`,
    `C${f(base.x + lean * 0.5 + 2)} ${f(base.y - height * 0.4)} ${f(base.x + w * 0.05)} ${f(base.y - height * 0.3)} ${f(base.x + w * 0.22)} ${f(base.y - 3)}Z`,
  ].join('');
  return { d, ridge, leaf, tip, w };
}

const BACK = [205, 245, 295, 335].map((deg) => ({ deg, ...spike(deg, 66, 58) }));
const FRONT = [
  { deg: 168, h: 72 },
  { deg: 129, h: 86 },
  { deg: 90, h: 98 },
  { deg: 51, h: 86 },
  { deg: 12, h: 72 },
].map(({ deg, h }) => ({ deg, ...spike(deg, h, 74) }));
const PEARLS = [150, 110, 70, 30].map((deg) => onRim(deg, -1));

/** Rendado entre as pontas da frente: arcos que descem de uma ponta à outra. */
const ARCHES = FRONT.slice(0, -1).map((p, i) => {
  const next = FRONT[i + 1];
  const a = { x: p.tip.x + p.w * 0.26, y: p.tip.y + (onRim(p.deg).y - p.tip.y) * 0.5 };
  const b = { x: next.tip.x - next.w * 0.26, y: next.tip.y + (onRim(next.deg).y - next.tip.y) * 0.5 };
  const mid = { x: (a.x + b.x) / 2, y: Math.max(a.y, b.y) + 16 };
  return `M${f(a.x)} ${f(a.y)}Q${f(mid.x)} ${f(mid.y + 12)} ${f(b.x)} ${f(b.y)}`;
});
const JEWELS = [154, 122, 90, 58, 26].map((deg, i) => ({ ...onRim(deg, BAND / 2), deg, ruby: i % 2 === 0 }));
const BEADS = Array.from({ length: 23 }, (_, i) => onRim(176 - i * 7.6, BAND - 7));

const frontTop = `M${CX - RX} ${RIM_Y}A${RX} ${RY} 0 0 0 ${CX + RX} ${RIM_Y}`;
const band = `${frontTop}L${CX + RX} ${RIM_Y + BAND}A${RX} ${RY} 0 0 1 ${CX - RX} ${RIM_Y + BAND}Z`;

export function CrownIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 320" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cr-metal" x1="60" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5a3c17" />
          <stop offset="0.16" stopColor="#b5823a" />
          <stop offset="0.33" stopColor="#efd38c" />
          <stop offset="0.45" stopColor="#fff0c4" />
          <stop offset="0.58" stopColor="#d7a956" />
          <stop offset="0.8" stopColor="#976a2b" />
          <stop offset="1" stopColor="#452e11" />
        </linearGradient>
        <linearGradient id="cr-shade" x1="0" y1={RIM_Y - 110} x2="0" y2={RIM_Y + 4} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff4d4" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#fff4d4" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1806" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="cr-band" x1="0" y1={RIM_Y} x2="0" y2={RIM_Y + BAND + RY} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff2cc" stopOpacity="0.45" />
          <stop offset="0.3" stopColor="#fff2cc" stopOpacity="0" />
          <stop offset="0.85" stopColor="#1e1104" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="cr-back" x1="60" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2e1d0a" />
          <stop offset="0.5" stopColor="#7d5726" />
          <stop offset="1" stopColor="#2b1b09" />
        </linearGradient>
        <radialGradient id="cr-inner" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#6b4a20" />
          <stop offset="1" stopColor="#1a0f05" />
        </radialGradient>
        <radialGradient id="cr-orb" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.45" stopColor="#ecd3a2" />
          <stop offset="1" stopColor="#7d6340" />
        </radialGradient>
        <radialGradient id="cr-ruby" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ff9f8c" />
          <stop offset="0.45" stopColor="#ad1f1e" />
          <stop offset="1" stopColor="#3f0808" />
        </radialGradient>
        <radialGradient id="cr-emerald" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#b4ecc4" />
          <stop offset="0.45" stopColor="#1f7048" />
          <stop offset="1" stopColor="#082516" />
        </radialGradient>
        <radialGradient id="cr-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sombra sobre a mesa */}
      <ellipse cx={CX} cy={RIM_Y + BAND + 22} rx="182" ry="30" fill="url(#cr-shadow)" />

      {/* Pontas de trás (vistas por dentro, mais escuras) */}
      {BACK.map((p) => (
        <g key={p.deg}>
          <path d={p.d} fill="url(#cr-back)" />
          <path d={p.leaf} fill="#1c1106" fillOpacity="0.45" />
          <circle cx={p.tip.x} cy={p.tip.y - 5} r="6" fill="url(#cr-orb)" opacity="0.7" />
        </g>
      ))}

      {/* Interior do aro */}
      <ellipse cx={CX} cy={RIM_Y} rx={RX} ry={RY} fill="url(#cr-inner)" />
      <ellipse cx={CX} cy={RIM_Y} rx={RX} ry={RY} stroke="#e9c77f" strokeOpacity="0.55" strokeWidth="1.2" />

      {/* Aro da frente */}
      <path d={band} fill="url(#cr-metal)" />
      <path d={band} fill="url(#cr-band)" />
      <path d={frontTop} stroke="#fff3cf" strokeOpacity="0.8" strokeWidth="1.6" />
      <path
        d={`M${CX - RX} ${RIM_Y + 7}A${RX} ${RY} 0 0 0 ${CX + RX} ${RIM_Y + 7}`}
        stroke="#4a2f10"
        strokeOpacity="0.6"
        strokeWidth="1.2"
      />
      <path
        d={`M${CX - RX} ${RIM_Y + BAND}A${RX} ${RY} 0 0 0 ${CX + RX} ${RIM_Y + BAND}`}
        stroke="#3a240c"
        strokeWidth="1.6"
      />
      {BEADS.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="1.9" fill="url(#cr-orb)" />
      ))}

      {/* Pontas da frente */}
      {FRONT.map((p) => (
        <g key={p.deg}>
          <path d={p.d} fill="url(#cr-metal)" />
          <path d={p.d} fill="url(#cr-shade)" />
          <path d={p.d} stroke="#fff0c2" strokeOpacity="0.55" strokeWidth="1" />
          <path d={p.leaf} fill="#3b250b" fillOpacity="0.22" />
          <path d={p.ridge} stroke="#fff6dc" strokeOpacity="0.55" strokeWidth="1.1" />
          <circle cx={p.tip.x} cy={p.tip.y - 7} r="8.5" fill="url(#cr-orb)" />
        </g>
      ))}

      {ARCHES.map((d, i) => (
        <g key={i}>
          <path d={d} stroke="#3a240b" strokeOpacity="0.5" strokeWidth="4.4" strokeLinecap="round" />
          <path d={d} stroke="url(#cr-metal)" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      ))}

      {/* Pérolas entre as pontas */}
      {PEARLS.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y - 5} r="5" fill="url(#cr-orb)" />
      ))}

      {/* Pedras no aro */}
      {JEWELS.map((j) => {
        const s = Math.max(0.55, Math.sin(rad(j.deg)));
        return (
          <g key={j.deg}>
            <ellipse
              cx={j.x}
              cy={j.y}
              rx={8.5 * s}
              ry="10"
              fill={j.ruby ? 'url(#cr-ruby)' : 'url(#cr-emerald)'}
              stroke="#f3d79a"
              strokeWidth="1.4"
            />
            <ellipse cx={j.x - 2.2 * s} cy={j.y - 3.5} rx={2 * s} ry="1.6" fill="#fff" fillOpacity="0.7" />
          </g>
        );
      })}
    </svg>
  );
}
