import { useEffect, useState } from 'react';
import { business, navigation, sectionIds } from '../../content/business';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { homeSection, routes, type Page } from '../../lib/routes';
import { CrownMark, Phone } from '../Icons';
import './Header.css';

const SPY_IDS = navigation.map((item) => item.section);
const NO_SPY: string[] = [];

/**
 * Cabeçalho fixo e enxuto: marca, três links e um único botão (ligar).
 * No celular ficam só a marca e o link do cardápio; ligar e como chegar
 * vão para a barra fixa na base da tela (ActionBar).
 */
export function Header({ page = 'home' }: { page?: Page }) {
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(page === 'home' ? SPY_IDS : NO_SPY);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__bar">
        <a className="brand" href={page === 'home' ? `#${sectionIds.top}` : routes.home}>
          <CrownMark className="brand__crown" />
          <span className="brand__text">
            <span className="brand__name">{business.name}</span>
            <span className="brand__sub">{business.tagline}</span>
          </span>
          <span className="sr-only"> — início</span>
        </a>

        <nav className="site-nav" aria-label="Seções">
          <ul role="list">
            {navigation.map((item) => (
              <li key={item.section} className={item.section === sectionIds.menu ? 'is-key' : undefined}>
                <a
                  href={homeSection(item.section, page)}
                  aria-current={active === item.section ? 'location' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--small site-header__call" href={business.phone.href}>
          <Phone />
          {business.phone.display}
          <span className="sr-only"> (ligar)</span>
        </a>
      </div>
    </header>
  );
}
