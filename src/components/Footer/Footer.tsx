import { business, sectionIds } from '../../content/business';
import { images } from '../../content/images';
import { routes, type Page } from '../../lib/routes';
import { ArrowUp } from '../Icons';
import { Logo } from '../Logo';
import './Footer.css';

export function Footer({ page = 'home' }: { page?: Page }) {
  const { address } = business;
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <a className="site-footer__brand" href={page === 'home' ? `#${sectionIds.top}` : routes.home}>
          <Logo variant="brasao" alt="" className="site-footer__emblem" />
          <span>
            <span className="site-footer__name">{business.name}</span>
            <span className="site-footer__meta">
              {business.tagline} · {address.district}, {address.city} · desde {business.since}
            </span>
          </span>
          <span className="sr-only"> — início</span>
        </a>
        <p className="site-footer__credit">
          © {new Date().getFullYear()} {business.legalName} · Foto do corredor: {images.corredor.credit}
        </p>
        {page === 'home' && (
          <a className="site-footer__top" href={`#${sectionIds.top}`}>
            Voltar ao topo
            <ArrowUp />
          </a>
        )}
      </div>
    </footer>
  );
}
