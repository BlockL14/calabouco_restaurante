import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { sectionIds } from '../../content/business';
import { menuIntro } from '../../content/home';
import { countItems, menuCategories, menuNote, type MenuCategoryId } from '../../content/menu';
import { CrownMark, Plus } from '../Icons';
import { Picture } from '../Picture';
import { Split } from '../Split/Split';
import './Menu.css';

type MenuProps = {
  category: MenuCategoryId;
  onCategoryChange: (id: MenuCategoryId) => void;
};

export function Menu({ category, onCategoryChange }: MenuProps) {
  const [expandedFor, setExpandedFor] = useState<MenuCategoryId | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  const current = menuCategories.find((c) => c.id === category) ?? menuCategories[0];
  const expanded = expandedFor === current.id;
  const total = countItems(current);
  const hasMore = total > current.preview;

  // Posiciona o filete sob o nome da aba ativa e mantém a aba visível na faixa rolável.
  useLayoutEffect(() => {
    const list = tabsRef.current;
    const tab = list?.querySelector<HTMLButtonElement>(`[data-id="${current.id}"]`);
    const label = tab?.querySelector<HTMLElement>('.menu__tab-label');
    if (!list || !tab || !label) return;
    const measure = () => setIndicator({ x: tab.offsetLeft + label.offsetLeft, w: label.offsetWidth });
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
          {menuIntro.title.map((line) => (
            <span key={line} className="display__line">
              {line}
            </span>
          ))}
        </h2>
        <p className="lead">{menuIntro.text}</p>
        {/* Leva à lista e já abre todos os itens da categoria escolhida */}
        <a className="btn" href={`#${sectionIds.menuList}`} onClick={() => setExpandedFor(current.id)}>
          {menuIntro.button}
        </a>
      </Split>

      <section id={sectionIds.menuList} className="menu" aria-label="Seleção do cardápio" tabIndex={-1}>
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
                    onClick={() => select(c.id)}
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
            ref={panelRef}
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

            <div className="menu__groups" id="menu-items">
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
                            className={['menu__item', i >= current.preview && 'is-extra', item.featured && 'is-featured']
                              .filter(Boolean)
                              .join(' ')}
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
      </section>
    </>
  );
}
