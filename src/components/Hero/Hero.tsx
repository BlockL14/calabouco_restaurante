import { business, sectionIds } from '../../content/business';
import { images } from '../../content/images';
import { hero } from '../../content/site';
import { Phone, Pin } from '../Icons';
import { Picture } from '../Picture';
import './Hero.css';

/** Mesmo `sizes` do pré-carregamento em index.html (foto principal do mosaico). */
export const HERO_SIZES = '(min-width: 900px) 33vw, 62vw';

/** Botões da abertura: a barra fixa do celular aparece quando eles saem da tela. */
export const HERO_ACTIONS_ID = 'abertura-acoes';

/**
 * Selo circular “desde 1991” sobre o mosaico (decorativo: a informação está no texto).
 * O texto do contorno foi medido para fechar a volta (2π·44 ≈ 276 unidades) com a Manrope:
 * ao mudar o texto, o corpo ou o espaçamento, meça de novo para não cortar o fim.
 */
function Seal() {
  return (
    <svg className="hero__seal" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <path id="selo-circulo" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>
      <circle className="hero__seal-bg" cx="60" cy="60" r="58" />
      <circle className="hero__seal-ring" cx="60" cy="60" r="31" />
      <text className="hero__seal-text" fontSize="10" letterSpacing="1.89">
        <textPath href="#selo-circulo">CALABOUÇO · CENTRO CÍVICO · CURITIBA ·</textPath>
      </text>
      <text className="hero__seal-text" x="60" y="55" textAnchor="middle" fontSize="10" letterSpacing="1.5">
        DESDE
      </text>
      <text className="hero__seal-year" x="60" y="77" textAnchor="middle" fontSize="22">
        1991
      </text>
    </svg>
  );
}

export function Hero() {
  const { address, phone, links } = business;
  return (
    <section id={sectionIds.top} className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="container hero__grid">
        <div className="hero__text">
          <p className="kicker hero__eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            <span className="sr-only">{business.legalName}: </span>
            <span className="hero__title-line">{hero.title[0]}</span>{' '}
            <span className="hero__title-line hero__title-accent">{hero.title[1]}</span>
          </h1>
          <p className="lead hero__lead">{hero.text}</p>

          <div id={HERO_ACTIONS_ID} className="hero__actions">
            <a className="btn" href={`#${sectionIds.menu}`}>
              {hero.primary}
            </a>
            <a className="btn btn--ghost" href={links.maps} target="_blank" rel="noopener noreferrer">
              {hero.secondary}
              <span className="sr-only"> (abre o Google Maps em nova aba)</span>
            </a>
          </div>

          <ul className="hero__facts" role="list">
            <li>
              <Pin />
              <span>
                {address.street} — {address.district}, {address.city}
              </span>
            </li>
            <li>
              <Phone />
              <a href={phone.href}>
                {phone.display}
                <span className="sr-only"> (ligar)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="hero__collage">
          <figure className="hero__photo hero__photo--main">
            <Picture image="queijo" sizes={HERO_SIZES} priority />
          </figure>
          <figure className="hero__photo hero__photo--side">
            <Picture image="corredor" sizes="(min-width: 900px) 22vw, 38vw" priority />
            <figcaption className="hero__credit">Foto: {images.corredor.credit}</figcaption>
          </figure>
          <figure className="hero__photo hero__photo--wide">
            <Picture image="letreiro" sizes="(min-width: 900px) 22vw, 38vw" />
          </figure>
          <Seal />
        </div>
      </div>
    </section>
  );
}
