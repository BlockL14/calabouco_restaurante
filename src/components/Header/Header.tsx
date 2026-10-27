import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { business, navigation, sectionIds } from '../../content/business';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { homeSection, routes, type Page } from '../../lib/routes';
import { Close, CrownMark, Instagram, MenuIcon, Phone } from '../Icons';
import './Header.css';

type NavItem = (typeof navigation)[number];

const HOME_SPY = navigation.map((item) => item.section);
const NO_SPY: string[] = [];

/** Na página do cardápio, “Cardápio” leva à própria página; o resto, às seções da inicial. */
const hrefFor = (item: NavItem, page: Page) =>
  'page' in item && item.page === page ? routes.menu : homeSection(item.section, page);

export function Header({ page = 'home' }: { page?: Page }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navigating = useRef(false);
  const activeSection = useScrollSpy(page === 'home' ? HOME_SPY : NO_SPY);

  const currentFor = (item: NavItem) => {
    if (page === 'home') return activeSection === item.section ? ('location' as const) : undefined;
    return 'page' in item && item.page === page ? ('page' as const) : undefined;
  };

  // Na inicial, o botão leva ao cardápio completo; no cardápio, ao mapa.
  const cta =
    page === 'menu'
      ? { label: 'Como chegar', href: business.links.maps, external: true }
      : { label: 'Ver cardápio', href: routes.menu, external: false };
  const ctaProps = cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu mobile em <dialog> modal: foco contido, Esc fecha, fundo inerte.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('menu-open');
    }
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.classList.remove('menu-open');
      setMenuOpen(false);
      // Devolve o foco ao botão de origem, exceto quando o menu levou a uma seção.
      if (!navigating.current) toggleRef.current?.focus();
      navigating.current = false;
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  // Fecha o menu e rola até a seção, movendo o foco para ela. Links para outra página
  // seguem a navegação normal.
  const navigateFromMenu = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
    if (!target) return;
    event.preventDefault();
    navigating.current = true;
    dialogRef.current?.close();
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
      history.replaceState(null, '', href);
    });
  };

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__bar">
        <a className="brand" href={page === 'home' ? `#${sectionIds.top}` : routes.home}>
          <CrownMark className="brand__crown" />
          <span className="brand__name">{business.name}</span>
          <span className="brand__sub">Restaurante e Pizzaria</span>
          <span className="sr-only"> — voltar ao início</span>
        </a>

        <nav className="site-nav" aria-label="Principal">
          <ul role="list">
            {navigation.map((item) => (
              <li key={item.section}>
                <a href={hrefFor(item, page)} className="site-nav__link" aria-current={currentFor(item)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn site-header__cta" href={cta.href} {...ctaProps}>
          {cta.label}
          {cta.external && <span className="sr-only"> (abre o Google Maps em nova aba)</span>}
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="site-header__toggle"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
          <span>Menu</span>
        </button>
      </div>

      <dialog id="menu-mobile" ref={dialogRef} className="mobile-menu" aria-label="Menu">
        <div className="mobile-menu__top">
          <span className="brand" aria-hidden="true">
            <CrownMark className="brand__crown" />
            <span className="brand__name">{business.name}</span>
            <span className="brand__sub">Restaurante e Pizzaria</span>
          </span>
          <button type="button" className="icon-btn" onClick={() => dialogRef.current?.close()} aria-label="Fechar menu">
            <Close />
          </button>
        </div>
        <nav aria-label="Menu principal">
          <ol className="mobile-menu__list" role="list">
            {navigation.map((item, index) => (
              <li key={item.section} style={{ '--i': index } as CSSProperties}>
                <a
                  href={hrefFor(item, page)}
                  aria-current={currentFor(item)}
                  onClick={(e) => navigateFromMenu(e, hrefFor(item, page))}
                >
                  <span className="mobile-menu__num numeral" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-menu__foot">
          <a className="btn" href={cta.href} {...ctaProps}>
            {cta.label}
            {cta.external && <span className="sr-only"> (abre o Google Maps em nova aba)</span>}
          </a>
          <div className="mobile-menu__contacts">
            <a href={business.phone.href}>
              <Phone className="btn__icon" />
              {business.phone.display}
            </a>
            <a href={business.links.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="btn__icon" />
              Instagram
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
