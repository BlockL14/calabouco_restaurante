import archAvif from '../../assets/textures/arco.avif';
import archSmAvif from '../../assets/textures/arco-p.avif';
import archSmWebp from '../../assets/textures/arco-p.webp';
import archWebp from '../../assets/textures/arco.webp';
import { business, sectionIds } from '../../content/business';
import { images } from '../../content/images';
import { glowSrc } from '../../lib/images';
import { Instagram, Phone, Pin } from '../Icons';
import { Picture } from '../Picture';
import './Visit.css';

/*
 * Arco de tijolos (imagem gerada por scripts/make-arch.mjs): aduelas radiais com a
 * profundidade de um tijolo e ombreiras em fiadas, como o arco real da fachada.
 * A imagem cobre o vão e o anel ao redor; o vão é transparente.
 */
const ARCH_SIZES = '(min-width: 640px) 744px, 100vw';

function BrickArch() {
  return (
    <picture className="visit__arch">
      <source type="image/avif" srcSet={`${archSmAvif} 930w, ${archAvif} 1594w`} sizes={ARCH_SIZES} />
      <source type="image/webp" srcSet={`${archSmWebp} 930w, ${archWebp} 1594w`} sizes={ARCH_SIZES} />
      <img src={archWebp} alt="" width={1594} height={1157} loading="lazy" decoding="async" draggable={false} />
    </picture>
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
          <BrickArch />
        </div>
      </div>
    </section>
  );
}
