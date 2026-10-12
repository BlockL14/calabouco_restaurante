import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { business, navigation, sectionIds } from '../../content/business';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { ArrowRight, Close, Instagram, MenuIcon, Phone } from '../Icons';
import './Header.css';

const spyIds = navigation.map((item) => item.href.slice(1));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navigating = useRef(false);
  const activeSection = useScrollSpy(spyIds);

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

  // Fecha o menu e rola até a seção, movendo o foco para ela.
  const navigateFromMenu = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.getElementById(href.slice(1));
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
        <a className="brand" href={`#${sectionIds.top}`}>
          <span className="brand__name">{business.name}</span>
          <span className="brand__sub">Restaurante &amp; Pizzaria</span>
          <span className="sr-only"> — voltar ao início</span>
        </a>

        <nav className="site-nav" aria-label="Principal">
          <ul role="list">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="site-nav__link"
                  aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--ghost site-header__cta" href={`#${sectionIds.flavors}`}>
          Explore os sabores
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
            <span className="brand__name">{business.name}</span>
            <span className="brand__sub">Restaurante &amp; Pizzaria</span>
          </span>
          <button type="button" className="icon-btn" onClick={() => dialogRef.current?.close()} aria-label="Fechar menu">
            <Close />
          </button>
        </div>
        <nav aria-label="Menu principal">
          <ol className="mobile-menu__list" role="list">
            {navigation.map((item, index) => (
              <li key={item.href} style={{ '--i': index } as CSSProperties}>
                <a href={item.href} onClick={(e) => navigateFromMenu(e, item.href)}>
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
          <a className="btn btn--primary" href={`#${sectionIds.flavors}`} onClick={(e) => navigateFromMenu(e, `#${sectionIds.flavors}`)}>
            Explore os sabores
            <ArrowRight className="btn__icon btn__icon--arrow" />
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
