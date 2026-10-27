import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { sectionIds } from '../../content/business';
import { menuIntro } from '../../content/home';
import { countItems, menuCategories, menuNote, type MenuCategoryId } from '../../content/menu';
import { menuSection, routes } from '../../lib/routes';
import { ArrowRight, CrownMark } from '../Icons';
import { Picture } from '../Picture';
import { Split } from '../Split/Split';
import './Menu.css';
import { DisplayLines } from '../DisplayLines';

/**
 * Cardápio na página inicial: faixa “Sabores que marcam” e, abaixo, as abas da
 * interface aprovada com uma prévia de cada categoria. A lista completa fica na
 * página do cardápio (cardapio.html).
 */
export function Menu() {
  const [category, setCategory] = useState<MenuCategoryId>(menuCategories[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  const current = menuCategories.find((c) => c.id === category) ?? menuCategories[0];
  const total = countItems(current);

  // Posiciona o filete sob o nome da aba ativa e mantém a aba visível na faixa rolável.
  useLayoutEffect(() => {
    const list = tabsRef.current;
    const tab = list?.querySelector<HTMLButtonElement>(`[data-id="${current.id}"]`);
    const label = tab?.querySelector<HTMLElement>('.menu__tab-label');
    if (!list || !tab || !label) return;
    const measure = () => setIndicator({ x: tab.offsetLeft + label.offsetLeft, w: label.offsetWidth });
    measure();
    if (list.scrollWidth > list.clientWidth) {
      const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
      list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [current.id]);

  // Padrão de abas com ativação automática (setas, Home e End).
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = menuCategories.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = menuCategories[keys[e.key]];
    setCategory(next.id);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-id="${next.id}"]`)?.focus();
  };

  let remaining = current.preview;
  let itemIndex = 0;

  return (
    <>
      <Split
        id={sectionIds.menu}
        labelledBy="menu-title"
        side="right"
        className="menu-intro"
        media={<Picture image={menuIntro.image} sizes="(min-width: 900px) 61vw, 100vw" />}
      >
        <p className="eyebrow">{menuIntro.eyebrow}</p>
        <h2 id="menu-title" className="display display--xl">
          <DisplayLines lines={menuIntro.title} />
        </h2>
        <p className="lead">{menuIntro.text}</p>
        <a className="btn" href={routes.menu}>
          {menuIntro.button}
        </a>
      </Split>

      <section id={sectionIds.menuList} className="menu" aria-label="Prévia do cardápio" tabIndex={-1}>
        <div className="container">
          <div className="menu__tabs-wrap" data-reveal>
            <div ref={tabsRef} className="menu__tabs" role="tablist" aria-label="Categorias do cardápio">
              {menuCategories.map((c, index) => {
                const selected = c.id === current.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`tab-${c.id}`}
                    data-id={c.id}
                    aria-selected={selected}
                    aria-controls="menu-panel"
                    tabIndex={selected ? 0 : -1}
                    className="menu__tab"
                    onClick={() => setCategory(c.id)}
                    onKeyDown={(e) => onTabKeyDown(e, index)}
                  >
                    <span className="menu__tab-label">{c.label}</span>
                  </button>
                );
              })}
              {indicator && (
                <span
                  className="menu__indicator"
                  aria-hidden="true"
                  style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
                />
              )}
            </div>
          </div>

          <div
            key={current.id}
            id="menu-panel"
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            className="menu__panel"
            tabIndex={0}
          >
            <p className="menu__summary">
              <span className="menu__count">
                <span className="numeral">{String(total).padStart(2, '0')}</span> itens
              </span>
              <span className="menu__intro">{current.intro}</span>
            </p>

            <div className="menu__groups">
              {current.groups.map((group) => {
                if (remaining <= 0) return null;
                const items = group.items.slice(0, remaining);
                remaining -= group.items.length;
                return (
                  <div className="menu__group" key={group.title}>
                    <h3 className="menu__group-title">
                      {group.title}
                      <span className="menu__group-count" aria-hidden="true">
                        {group.items.length}
                      </span>
                    </h3>
                    <ul role="list" className="menu__items">
                      {items.map((item) => {
                        const i = itemIndex++;
                        return (
                          <li
                            key={item.name}
                            className={['menu__item', item.featured && 'is-featured'].filter(Boolean).join(' ')}
                            style={{ '--i': Math.min(i, 14) } as CSSProperties}
                          >
                            <span className="menu__item-name">
                              {item.featured && <CrownMark className="menu__item-crown" />}
                              {item.name}
                            </span>
                            {item.note && <span className="menu__item-note">{item.note}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="menu__more-row">
              <a className="btn menu__more" href={menuSection(current.id)}>
                Ver todos os {total} itens
                <span className="sr-only"> de {current.label} no cardápio completo</span>
              </a>
            </div>
          </div>

          <p className="menu__note">
            {menuNote}{' '}
            <a className="text-link menu__note-link" href={routes.menu}>
              <span className="text-link__label">Abrir o cardápio completo</span>
              <ArrowRight />
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
