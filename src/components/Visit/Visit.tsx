import { business, sectionIds } from '../../content/business';
import { ArrowRight, Instagram, Phone, Pin } from '../Icons';
import './Visit.css';

export function Visit() {
  const { address, phone, links } = business;
  return (
    <section id={sectionIds.visit} className="section visit" aria-labelledby="visit-title" tabIndex={-1}>
      {/* Arco em traço fino, eco da entrada do restaurante */}
      <svg
        className="visit__arch"
        viewBox="0 0 600 760"
        preserveAspectRatio="xMidYMax meet"
        fill="none"
        aria-hidden="true"
        focusable="false"
        data-inview
      >
        <path d="M20 760V300a280 280 0 0 1 560 0v460" />
        <path d="M60 760V304a240 240 0 0 1 480 0v456" />
      </svg>

      <div className="container visit__grid">
        <div className="visit__head" data-reveal>
          <p className="eyebrow">Visite o Calabouço</p>
          <h2 id="visit-title" className="display">
            Sua próxima noite <em>começa aqui.</em>
          </h2>
        </div>

        <div className="visit__card" data-reveal>
          <address className="visit__address">
            <strong>{business.legalName}</strong>
            <span>{address.street}</span>
            <span>
              {address.district} — {address.city}/{address.state}
            </span>
            <span>CEP {address.postalCode}</span>
            <a className="visit__phone" href={phone.href}>
              {phone.display}
            </a>
          </address>

          <div className="rule" />

          <ul className="visit__actions" role="list">
            <li>
              <a className="btn btn--primary" href={links.maps} target="_blank" rel="noopener noreferrer">
                <Pin className="btn__icon" />
                Como chegar
                <span className="sr-only"> (abre o Google Maps em nova aba)</span>
              </a>
            </li>
            <li>
              <a className="btn btn--ghost" href={phone.href}>
                <Phone className="btn__icon" />
                Ligar
                <span className="sr-only"> para {phone.display}</span>
              </a>
            </li>
            <li>
              <a className="btn btn--ghost" href={links.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="btn__icon" />
                Instagram
                <span className="sr-only"> (abre em nova aba)</span>
                <ArrowRight className="btn__icon btn__icon--arrow visit__ext" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
