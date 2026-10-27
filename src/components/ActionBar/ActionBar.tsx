import { useEffect, useState } from 'react';
import { business } from '../../content/business';
import { Phone, Route } from '../Icons';
import './ActionBar.css';

/**
 * Celular: ligar e como chegar à mão, na base da tela.
 * Com `after` (id de um elemento), a barra só aparece quando esse elemento sai da tela.
 * Na página inicial, são os botões da abertura: assim as mesmas ações não se repetem
 * no primeiro olhar.
 */
export function ActionBar({ after }: { after?: string }) {
  const { phone, links } = business;
  const [shown, setShown] = useState(!after);

  useEffect(() => {
    const target = after ? document.getElementById(after) : null;
    if (!target || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [after]);

  return (
    <nav className={`action-bar${shown ? '' : ' is-hidden'}`} aria-label="Ações rápidas">
      <a className="btn action-bar__btn" href={phone.href}>
        <Phone />
        Ligar
        <span className="sr-only"> para {phone.display}</span>
      </a>
      <a className="btn btn--ghost action-bar__btn" href={links.maps} target="_blank" rel="noopener noreferrer">
        <Route />
        Como chegar
        <span className="sr-only"> (abre o Google Maps em nova aba)</span>
      </a>
    </nav>
  );
}
