import { business, sectionIds } from '../../content/business';
import { images } from '../../content/images';
import { glowSrc } from '../../lib/images';
import { Instagram, Phone, Pin } from '../Icons';
import { Picture } from '../Picture';
import './Visit.css';

/*
 * Porta em arco de pedra (viewBox 1000 × 800, mesma proporção da porta):
 * aduelas marcadas por juntas, pedra-chave no topo e filetes dourados,
 * iluminados de baixo para cima como pela boca de um forno.
 */
const STONES = 'M20 800V500A480 480 0 0 1 980 500V800';
const EDGE_OUT = 'M1 800V500A499 499 0 0 1 999 500V800';
const EDGE_IN = 'M39 800V500A461 461 0 0 1 961 500V800';

function StoneArch() {
  return (
    <svg className="visit__arch" viewBox="0 0 1000 800" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="visit-stone" x1="0" y1="800" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b8683c" stopOpacity="0.62" />
          <stop offset="0.55" stopColor="#6e3424" stopOpacity="0.5" />
          <stop offset="1" stopColor="#4a2419" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id="visit-gold" x1="0" y1="800" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e7c48a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#b28a50" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* Argamassa (base contínua) e aduelas por cima: as juntas aparecem mais escuras */}
      <path className="visit__arch-mortar" d={STONES} />
      <path className="visit__arch-stones" d={STONES} stroke="url(#visit-stone)" />
      <path className="visit__arch-edge" d={EDGE_OUT} stroke="url(#visit-gold)" />
      <path className="visit__arch-edge" d={EDGE_IN} stroke="url(#visit-gold)" strokeOpacity="0.6" />
      {/* Pedra-chave */}
      <path className="visit__arch-key" d="M474 -2H526L519 44H481Z" />
    </svg>
  );
}

export function Visit() {
  const { address, phone, links } = business;
  const corridorLight = glowSrc(images.corredor);
  return (
    <section id={sectionIds.visit} className="section visit" aria-labelledby="visit-title" tabIndex={-1}>
      <div className="container visit__head" data-reveal>
        <p className="eyebrow">Visite o Calabouço</p>
        <h2 id="visit-title" className="display visit__title">
          Sua próxima noite <em>começa aqui.</em>
        </h2>
        <p className="visit__lead">{business.description}</p>

        <ul className="visit__actions" role="list">
          <li>
            <a className="btn btn--light visit__btn" href={links.maps} target="_blank" rel="noopener noreferrer">
              <Pin className="btn__icon" />
              Como chegar
              <span className="sr-only"> (abre o Google Maps em nova aba)</span>
            </a>
          </li>
          <li>
            <a className="btn visit__btn visit__btn--dark" href={phone.href}>
              <Phone className="btn__icon" />
              Ligar
              <span className="sr-only"> para {phone.display}</span>
            </a>
          </li>
          <li>
            <a
              className="btn visit__btn visit__btn--dark"
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="btn__icon" />
              Instagram
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="container visit__scene">
        {/* Placas da casa, ladeando a porta */}
        <address className="visit__contact">
          <div className="visit__plaque visit__plaque--address" data-reveal>
            <p className="visit__plaque-label">Endereço</p>
            <p className="visit__plaque-text">
              <span className="visit__plaque-strong">{address.street}</span>
              <span>
                {address.district} — {address.city}/{address.state}
              </span>
              <span className="visit__plaque-muted">CEP {address.postalCode}</span>
            </p>
          </div>
          <div className="visit__plaque visit__plaque--phone" data-reveal>
            <p className="visit__plaque-label">Telefone</p>
            <p className="visit__plaque-text">
              <span className="visit__plaque-phone">{phone.display}</span>
            </p>
          </div>
        </address>

        {/* A porta do calabouço, com a pizza da casa na soleira */}
        <div className="visit__door" aria-hidden="true" data-inview>
          <div className="visit__door-inner">
            <div
              className="visit__door-light"
              style={corridorLight ? { backgroundImage: `url(${corridorLight})` } : undefined}
            />
            <div className="visit__door-flame" />
            <div className="visit__pizza">
              <Picture image="pizza" sizes="(min-width: 1024px) 640px, 92vw" alt="" />
            </div>
          </div>
          <StoneArch />
        </div>
      </div>
    </section>
  );
}
