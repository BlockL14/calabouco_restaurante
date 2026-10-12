import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { sectionIds } from '../../content/business';
import { countItems, featuredDish, menuCategories, menuNote, type MenuCategoryId } from '../../content/menu';
import { Ornament, Plus } from '../Icons';
import { Picture } from '../Picture';
import './Flavors.css';

type FlavorsProps = {
  category: MenuCategoryId;
  onCategoryChange: (id: MenuCategoryId) => void;
};

export function Flavors({ category, onCategoryChange }: FlavorsProps) {
  const [expandedFor, setExpandedFor] = useState<MenuCategoryId | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  const current = menuCategories.find((c) => c.id === category) ?? menuCategories[0];
  const expanded = expandedFor === current.id;
  const total = countItems(current);
  const hasMore = total > current.preview;

  // Posiciona o filete dourado sob a aba ativa e mantém a aba visível na faixa rolável.
  useLayoutEffect(() => {
    const list = tabsRef.current;
    const tab = list?.querySelector<HTMLButtonElement>(`[data-id="${current.id}"]`);
    if (!list || !tab) return;
    const measure = () => setIndicator({ x: tab.offsetLeft, w: tab.offsetWidth });
    measure();
    const left = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [current.id]);

  const select = (id: MenuCategoryId) => {
    onCategoryChange(id);
    setExpandedFor(null);
  };

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
    select(next.id);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-id="${next.id}"]`)?.focus();
  };

  const toggleExpanded = () => {
    if (expanded) {
      setExpandedFor(null);
      const top = panelRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) panelRef.current?.scrollIntoView({ block: 'start' });
    } else {
      setExpandedFor(current.id);
    }
  };

  let remaining = expanded ? Number.POSITIVE_INFINITY : current.preview;
  let itemIndex = 0;

  return (
    <section id={sectionIds.flavors} className="section flavors" aria-labelledby="flavors-title" tabIndex={-1}>
      <div className="container">
        <header className="flavors__head">
          <div className="flavors__intro" data-reveal>
            <p className="eyebrow">Sabores do Calabouço</p>
            <h2 id="flavors-title" className="display">
              Escolha o sabor da <em>sua noite.</em>
            </h2>
            <p className="lead">Conheça as especialidades e explore as opções da casa.</p>
          </div>
          <figure className="flavors__photo" data-reveal style={{ '--reveal-delay': '120ms' } as CSSProperties}>
            <div className="flavors__photo-frame">
              <Picture image="queijo" sizes="(min-width: 1024px) 400px, (min-width: 700px) 42vw, 86vw" />
            </div>
            <figcaption>Da cozinha do Calabouço</figcaption>
          </figure>
        </header>

        <article className="signature" aria-labelledby="signature-title" data-inview data-reveal>
          <div className="signature__light" aria-hidden="true" />
          <div className="signature__title">
            <p className="eyebrow eyebrow--plain">{featuredDish.eyebrow}</p>
            <h3 id="signature-title" className="signature__name">
              {featuredDish.name}
            </h3>
          </div>
          <div className="signature__body">
            <Ornament className="signature__ornament" />
            <p className="signature__desc">{featuredDish.description}</p>
            <ul className="signature__components" role="list" aria-label="Componentes">
              {featuredDish.components.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className="menu" data-reveal>
          <div className="menu__top">
            <h3 className="menu__kicker">Seleção do cardápio</h3>
            <div className="menu__tabs-wrap">
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
                      onClick={() => select(c.id)}
                      onKeyDown={(e) => onTabKeyDown(e, index)}
                    >
                      {c.label}
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
          </div>

          <div
            ref={panelRef}
            key={current.id}
            id="menu-panel"
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            className="menu__panel"
            tabIndex={0}
          >
            <div className="menu__aside">
              <p className="menu__count">
                <span className="numeral">{String(total).padStart(2, '0')}</span> itens nesta seleção
              </p>
              <p className="menu__title" aria-hidden="true">
                {current.label}
              </p>
              <p className="menu__intro">{current.intro}</p>
              {current.image && (
                <div className="menu__image">
                  <Picture image={current.image} sizes="(min-width: 1024px) 380px, 90vw" />
                </div>
              )}
            </div>

            <div className="menu__groups" id="menu-items">
              {current.groups.map((group) => {
                if (remaining <= 0) return null;
                const items = group.items.slice(0, remaining);
                remaining -= group.items.length;
                return (
                  <div className="menu__group" key={group.title}>
                    <h4 className="menu__group-title">
                      {group.title}
                      <span className="menu__group-count" aria-hidden="true">
                        {group.items.length}
                      </span>
                    </h4>
                    <ul role="list" className="menu__items">
                      {items.map((item) => {
                        const i = itemIndex++;
                        return (
                          <li
                            key={item.name}
                            className={`menu__item${i >= current.preview ? ' is-extra' : ''}`}
                            style={{ '--i': Math.min(i, 14) } as CSSProperties}
                          >
                            <span className="menu__item-name">{item.name}</span>
                            {item.note && <span className="menu__item-note">{item.note}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              {hasMore && (
                <button
                  type="button"
                  className="menu__more"
                  aria-expanded={expanded}
                  aria-controls="menu-items"
                  onClick={toggleExpanded}
                >
                  <Plus className={`menu__more-icon${expanded ? ' is-open' : ''}`} />
                  {expanded ? 'Mostrar menos' : `Ver todos os ${total} itens`}
                </button>
              )}
            </div>
          </div>

          <p className="menu__note">{menuNote}</p>
        </div>
      </div>
    </section>
  );
}
