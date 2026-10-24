import { sectionIds } from '../../content/business';
import { signature } from '../../content/home';
import { featuredDish, type MenuCategoryId } from '../../content/menu';
import { ArrowRight } from '../Icons';
import { Picture } from '../Picture';
import { Split } from '../Split/Split';

/**
 * Coroa dourada sobre a luz das velas do salão (foto real, desfocada). Não há foto
 * confirmada da Coroa Real nos materiais, então o destaque é ilustrado.
 */
function CrownArt() {
  return (
    <div className="split__art signature-art">
      <Picture image="velas" sizes="(min-width: 900px) 54vw, 100vw" alt="" className="signature-art__light" />
      <svg className="signature-art__crown" viewBox="0 0 320 240" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="crown-fill" x1="0" y1="44" x2="0" y2="196" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f6dea4" />
            <stop offset="0.45" stopColor="#cf9f5a" />
            <stop offset="1" stopColor="#7d5528" />
          </linearGradient>
          <linearGradient id="crown-edge" x1="0" y1="44" x2="0" y2="196" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff2cc" />
            <stop offset="1" stopColor="#9c7038" />
          </linearGradient>
          <radialGradient id="crown-orb" cx="0.35" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#fff4d2" />
            <stop offset="0.5" stopColor="#d9ab63" />
            <stop offset="1" stopColor="#7d5528" />
          </radialGradient>
          <radialGradient id="crown-ruby" cx="0.35" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#f08a7a" />
            <stop offset="0.45" stopColor="#a3201f" />
            <stop offset="1" stopColor="#4d0c0d" />
          </radialGradient>
        </defs>
        <path
          d="M64 168 46 76l60 46 54-74 54 74 60-46-18 92Z"
          fill="url(#crown-fill)"
          stroke="url(#crown-edge)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M80 160 68 104l42 32 50-62 50 62 42-32-12 56Z" fill="#3a220e" fillOpacity="0.32" />
        <path d="M84 150c22-15 50-22 76-22s54 7 76 22" stroke="#fff2cc" strokeOpacity="0.45" strokeWidth="1.2" />
        <rect x="58" y="166" width="204" height="28" rx="4" fill="url(#crown-fill)" stroke="url(#crown-edge)" strokeWidth="1.6" />
        <path d="M62 172h196" stroke="#fff2cc" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M62 189h196" stroke="#3a220e" strokeOpacity="0.5" strokeWidth="1.2" />
        <circle cx="46" cy="76" r="8" fill="url(#crown-orb)" />
        <circle cx="160" cy="46" r="9.5" fill="url(#crown-orb)" />
        <circle cx="274" cy="76" r="8" fill="url(#crown-orb)" />
        <path d="M160 170l9 10-9 10-9-10Z" fill="url(#crown-ruby)" stroke="#f6dea4" strokeWidth="1" />
        <ellipse cx="110" cy="180" rx="6.5" ry="5.5" fill="url(#crown-ruby)" stroke="#f6dea4" strokeWidth="1" />
        <ellipse cx="210" cy="180" rx="6.5" ry="5.5" fill="url(#crown-ruby)" stroke="#f6dea4" strokeWidth="1" />
        <circle cx="160" cy="128" r="5" fill="url(#crown-ruby)" stroke="#f6dea4" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

export function Signature({ onSelectCategory }: { onSelectCategory: (id: MenuCategoryId) => void }) {
  return (
    <Split labelledBy="signature-title" side="right" className="signature" media={<CrownArt />}>
      <p className="eyebrow">{featuredDish.eyebrow}</p>
      <h2 id="signature-title" className="display">
        {featuredDish.name}
      </h2>
      <p className="lead">{featuredDish.description}</p>
      <a className="text-link" href={`#${sectionIds.menuList}`} onClick={() => onSelectCategory('especiais')}>
        <span className="text-link__label">{signature.link}</span>
        <ArrowRight />
      </a>
    </Split>
  );
}
