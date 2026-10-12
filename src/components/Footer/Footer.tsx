import { business, sectionIds } from '../../content/business';
import { ArrowUp } from '../Icons';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__brand">
          <span className="brand__name">{business.name}</span>
          <span className="site-footer__meta">
            Restaurante e Pizzaria · {business.address.city} — {business.address.state}
          </span>
        </p>
        <p className="site-footer__credit">Fotografia do corredor: @gabrielmessine</p>
        <a className="site-footer__top" href={`#${sectionIds.top}`}>
          Voltar ao início
          <ArrowUp className="btn__icon" />
        </a>
      </div>
    </footer>
  );
}
