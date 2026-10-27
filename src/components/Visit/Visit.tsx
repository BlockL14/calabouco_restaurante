import type { ReactNode } from 'react';
import { business, sectionIds } from '../../content/business';
import { visit } from '../../content/site';
import { Clock, ExternalArrow, Instagram, Phone, Pin } from '../Icons';
import './Visit.css';

type InfoRowProps = { icon: ReactNode; label: string; children: ReactNode; action?: ReactNode };

function InfoRow({ icon, label, children, action }: InfoRowProps) {
  return (
    <li className="info">
      <span className="info__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="info__body">
        <h3 className="info__label">{label}</h3>
        <p className="info__value">{children}</p>
      </div>
      {action}
    </li>
  );
}

/** Fim da página: história da casa e contato, cada informação com o seu botão. */
export function Visit() {
  const { address, phone, links } = business;
  return (
    <section id={sectionIds.visit} className="visit section" aria-labelledby="visit-title" tabIndex={-1}>
      <div className="container visit__grid">
        <div className="visit__story" data-reveal>
          <p className="kicker">{visit.kicker}</p>
          <h2 id="visit-title" className="title">
            {visit.title}
          </h2>
          {visit.story.map((paragraph) => (
            <p key={paragraph} className="lead">
              {paragraph}
            </p>
          ))}
        </div>

        <ul className="visit__info" role="list" data-reveal>
          <InfoRow
            icon={<Pin />}
            label="Endereço"
            action={
              <a className="btn btn--small" href={links.maps} target="_blank" rel="noopener noreferrer">
                Como chegar
                <ExternalArrow />
                <span className="sr-only"> (abre o Google Maps em nova aba)</span>
              </a>
            }
          >
            {address.street} — {address.district}
            <br />
            {address.city}/{address.state} · CEP {address.postalCode}
          </InfoRow>
          <InfoRow
            icon={<Phone />}
            label="Telefone"
            action={
              <a className="btn btn--small btn--ghost" href={phone.href}>
                Ligar
                <span className="sr-only"> para {phone.display}</span>
              </a>
            }
          >
            {phone.display}
          </InfoRow>
          <InfoRow icon={<Clock />} label="Horários">
            {visit.hours}
          </InfoRow>
          <InfoRow
            icon={<Instagram />}
            label="Instagram"
            action={
              <a className="btn btn--small btn--ghost" href={links.instagram} target="_blank" rel="noopener noreferrer">
                Abrir
                <ExternalArrow />
                <span className="sr-only"> o Instagram em nova aba</span>
              </a>
            }
          >
            {links.instagramHandle}
          </InfoRow>
        </ul>
      </div>
    </section>
  );
}
