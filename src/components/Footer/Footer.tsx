import { business, navigation, sectionIds } from '../../content/business';
import { homeSection, routes, type Page } from '../../lib/routes';
import { ArrowRight, ArrowUp, CrownMark, Instagram, Ornament, Phone, Pin } from '../Icons';
import './Footer.css';

/** Âncora do topo de cada página (o “voltar ao topo” do rodapé). */
export const PAGE_TOP: Record<Page, string> = { home: sectionIds.top, menu: 'topo', notfound: 'topo' };

export function Footer({ page = 'home' }: { page?: Page }) {
  const { address, phone, links } = business;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Ornament className="site-footer__ornament" />

      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <a className="brand" href={page === 'home' ? `#${sectionIds.top}` : routes.home}>
            <CrownMark className="brand__crown" />
            <span className="brand__name">{business.name}</span>
            <span className="brand__sub">{business.tagline}</span>
            <span className="sr-only"> — página inicial</span>
          </a>
          <p className="site-footer__about">
            Restaurante e pizzaria à la carte no {address.district} de {address.city}, desde {business.since}.
          </p>
        </div>

        <nav className="site-footer__col" aria-labelledby="rodape-navegue">
          <h2 id="rodape-navegue" className="site-footer__title">
            Navegue
          </h2>
          <ul role="list" className="site-footer__links">
            {navigation.map((item) => (
              <li key={item.section}>
                <a href={homeSection(item.section, page)}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href={routes.menu} aria-current={page === 'menu' ? 'page' : undefined}>
                Cardápio completo
              </a>
            </li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__title">Contato</h2>
          <ul role="list" className="site-footer__links site-footer__contact">
            <li>
              <a href={phone.href}>
                <Phone className="site-footer__icon" />
                {phone.display}
                <span className="sr-only"> (ligar)</span>
              </a>
            </li>
            <li>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="site-footer__icon" />
                {links.instagramHandle}
                <span className="sr-only"> (Instagram, abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__title">Endereço</h2>
          <address className="site-footer__address">
            <Pin className="site-footer__icon" />
            <span>
              {address.street}
              <br />
              {address.district} – {address.city}/{address.state}
              <br />
              CEP {address.postalCode}
            </span>
          </address>
          <a className="text-link site-footer__maps" href={links.maps} target="_blank" rel="noopener noreferrer">
            <span className="text-link__label">Como chegar</span>
            <ArrowRight />
            <span className="sr-only"> (abre o Google Maps em nova aba)</span>
          </a>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>
          © {year} {business.legalName}
        </p>
        <p>Foto do corredor: @gabrielmessine</p>
        <a className="site-footer__top" href={`#${PAGE_TOP[page]}`}>
          Voltar ao topo
          <ArrowUp className="btn__icon" />
        </a>
      </div>
    </footer>
  );
}
