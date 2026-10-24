import { business, sectionIds } from '../../content/business';
import { visit } from '../../content/home';
import { Clock, Instagram, Phone, Pin } from '../Icons';
import { Picture } from '../Picture';
import { Split } from '../Split/Split';
import './Visit.css';

export function Visit() {
  const { address, phone, links } = business;
  return (
    <Split
      id={sectionIds.visit}
      labelledBy="visit-title"
      side="right"
      className="visit"
      media={<Picture image={visit.image} sizes="(min-width: 900px) 54vw, 100vw" />}
    >
      <p className="eyebrow">{visit.eyebrow}</p>
      <h2 id="visit-title" className="display">
        {visit.title}
      </h2>
      <p className="lead">{visit.text}</p>

      <address className="visit__info">
        <p className="visit__item">
          <Pin className="visit__icon" />
          <span>
            {address.street}
            <br />
            {address.district} — {address.city}/{address.state}
            <br />
            <span className="visit__muted">CEP {address.postalCode}</span>
          </span>
        </p>
        <p className="visit__item">
          <Clock className="visit__icon" />
          <span>
            {visit.hoursLabel}
            <br />
            <span className="visit__muted">{visit.hoursText}</span>
          </span>
        </p>
        <a className="visit__item visit__link" href={phone.href}>
          <Phone className="visit__icon" />
          <span>
            {phone.display}
            <span className="sr-only"> (ligar)</span>
          </span>
        </a>
        <a className="visit__item visit__link" href={links.instagram} target="_blank" rel="noopener noreferrer">
          <Instagram className="visit__icon" />
          <span>
            {links.instagramHandle}
            <span className="sr-only"> (Instagram, abre em nova aba)</span>
          </span>
        </a>
      </address>

      <a className="btn visit__btn" href={links.maps} target="_blank" rel="noopener noreferrer">
        {visit.button}
        <span className="sr-only"> (abre o Google Maps em nova aba)</span>
      </a>
    </Split>
  );
}
