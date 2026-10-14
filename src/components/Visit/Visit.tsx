import type { CSSProperties } from 'react';
import { business, sectionIds } from '../../content/business';
import { ArrowRight, Instagram, Phone, Pin } from '../Icons';
import { Picture } from '../Picture';
import './Visit.css';

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties;

// Arco da porta do calabouço (viewBox 1000 × 1000): pernas até a base, volta perfeita no topo.
const ARCH = 'M20 1000V520A480 480 0 0 1 980 520V1000';
const ARCH_INNER = 'M76 1000V526A424 424 0 0 1 924 526V1000';

export function Visit() {
  const { address, phone, links } = business;
  return (
    <section id={sectionIds.visit} className="section visit" aria-labelledby="visit-title" tabIndex={-1}>
      {/* Palco: a porta em arco do calabouço, com um ponto de luz que percorre o contorno,
          e a pizza da casa surgindo da base sob a luz quente do forno. */}
      <div className="visit__stage" aria-hidden="true" data-inview>
        <svg className="visit__arch" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMax meet" fill="none">
          <path className="visit__arch-line" d={ARCH} />
          <path className="visit__arch-line visit__arch-line--inner" d={ARCH_INNER} />
          <path className="visit__arch-spark" d={ARCH} pathLength={2000} />
        </svg>
        <div className="visit__glow" />
        <div className="visit__pizza">
          <Picture image="pizza" sizes="(min-width: 1024px) 760px, 110vw" alt="" />
        </div>
      </div>

      <div className="container visit__inner">
        <div className="visit__head" data-reveal>
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
              <a className="btn visit__btn visit__btn--glass" href={phone.href}>
                <Phone className="btn__icon" />
                Ligar
                <span className="sr-only"> para {phone.display}</span>
              </a>
            </li>
            <li>
              <a
                className="btn visit__btn visit__btn--glass"
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

        <address className="visit__chips">
          <div className="visit__chip visit__chip--address" data-reveal style={delay(160)}>
            <span className="visit__chip-head">
              <span className="visit__chip-label">Endereço</span>
              <span className="visit__chip-icon">
                <Pin />
              </span>
            </span>
            <span className="visit__chip-lines">
              <span className="visit__chip-strong">{address.street}</span>
              <span>
                {address.district} — {address.city}/{address.state}
              </span>
              <span className="visit__chip-muted">CEP {address.postalCode}</span>
            </span>
          </div>

          <a className="visit__chip visit__chip--phone" href={phone.href} data-reveal style={delay(280)}>
            <span className="visit__chip-head">
              <span className="visit__chip-label">Telefone</span>
              <span className="visit__chip-icon">
                <ArrowRight className="visit__chip-arrow" />
              </span>
            </span>
            <span className="visit__chip-value">{phone.display}</span>
          </a>
        </address>
      </div>
    </section>
  );
}
