import { useRef, useState, type KeyboardEvent } from 'react';
import { business, sectionIds } from '../../content/business';
import { countItems, featuredDish, formatPrice, menuCategories, menuNote, type MenuCategoryId, type MenuItem } from '../../content/menu';
import { menuText } from '../../content/site';
import { ArrowRight, Crown, CrownMark, Minus, Phone, Plus } from '../Icons';
import { Picture } from '../Picture';
import './Menu.css';

/** Itens visíveis por categoria no celular antes de “Ver todos” (nas telas largas aparece tudo). */
const PREVIEW = 12;

const groupItems = (category: MenuCategoryId, title: string) =>
  menuCategories.find((c) => c.id === category)?.groups.find((g) => g.title === title)?.items ?? [];

const HOUSE_PIZZAS = groupItems('pizzas', 'Pizzas da casa');
const SWEET_PIZZAS = groupItems('sobremesas', 'Pizzas doces');

/** Leva da vitrine de destaques para a categoria correspondente na lista completa. */
function ShowIn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="link feature__link" onClick={onClick}>
      {label}
      <ArrowRight />
    </button>
  );
}

/** Uma linha do cardápio: nome e preço lado a lado, descrição embaixo. */
function Item({ item }: { item: MenuItem }) {
  return (
    <>
      <span className="menu__item-head">
        <span className="menu__item-name">
          {item.featured && <CrownMark className="menu__item-crown" />}
          {item.name}
        </span>
        <span className="menu__item-dots" aria-hidden="true" />
        {item.price !== undefined ? (
          <span className="menu__item-price">{formatPrice(item.price)}</span>
        ) : (
          <span className="menu__item-price is-ask">consulte</span>
        )}
      </span>
      <span className="menu__item-desc">{item.description}</span>
    </>
  );
}

/** Destaques da casa: pizzas com nomes de castelo, Coroa Real e pizzas doces. */
function Featured({ onShow }: { onShow: (id: MenuCategoryId) => void }) {
  return (
    <div className="menu__featured">
      <article className="feature feature--house" data-reveal>
        <div className="feature__media">
          <Picture image="queijo" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
        <div className="feature__body">
          <p className="kicker">Receitas da casa</p>
          <h3 className="feature__title">Pizzas com nomes de castelo</h3>
          <ul role="list" className="feature__names feature__names--cols">
            {HOUSE_PIZZAS.map((item) => (
              <li key={item.name}>{item.name}</li>
            ))}
          </ul>
          <ShowIn label="Ver todas as pizzas" onClick={() => onShow('pizzas')} />
        </div>
      </article>

      <article className="feature feature--crown" data-reveal>
        <Crown className="feature__icon" />
        <p className="kicker">{featuredDish.eyebrow}</p>
        <h3 className="feature__title">{featuredDish.name}</h3>
        <p className="feature__text">{featuredDish.description}</p>
        <p className="feature__price">{formatPrice(featuredDish.price)}</p>
        <ShowIn label="Ver em Pratos" onClick={() => onShow('pratos')} />
      </article>

      <article className="feature feature--sweet" data-reveal>
        <p className="kicker">Para fechar a noite</p>
        <h3 className="feature__title">Pizzas doces</h3>
        <ul role="list" className="feature__names">
          {SWEET_PIZZAS.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
        <ShowIn label="Ver em Sobremesas" onClick={() => onShow('sobremesas')} />
      </article>
    </div>
  );
}

export function Menu() {
  const [category, setCategory] = useState<MenuCategoryId>(menuCategories[0].id);
  const [expandedFor, setExpandedFor] = useState<MenuCategoryId | null>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const current = menuCategories.find((c) => c.id === category) ?? menuCategories[0];
  const total = countItems(current);
  const expanded = expandedFor === current.id;

  const select = (id: MenuCategoryId) => {
    setCategory(id);
    setExpandedFor(null);
  };

  const focusTab = (id: MenuCategoryId, options?: FocusOptions) =>
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-id="${id}"]`)?.focus(options);

  // Dos destaques para a lista: abre a categoria e rola até as abas
  // (a rolagem suave segue o scroll-behavior do CSS, que respeita o movimento reduzido).
  const showCategory = (id: MenuCategoryId) => {
    select(id);
    focusTab(id, { preventScroll: true });
    browserRef.current?.scrollIntoView({ block: 'start' });
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
    focusTab(next.id);
  };

  const toggle = () => {
    if (expanded) {
      setExpandedFor(null);
      // Ao recolher, volta para o início da lista se ela já tiver saído da tela
      if ((panelRef.current?.getBoundingClientRect().top ?? 0) < 0) panelRef.current?.scrollIntoView({ block: 'start' });
    } else {
      setExpandedFor(current.id);
    }
  };

  let index = 0;

  return (
    <section id={sectionIds.menu} className="menu section" aria-labelledby="menu-title" tabIndex={-1}>
      <div className="container">
        <header className="menu__head" data-reveal>
          <p className="kicker">{menuText.kicker}</p>
          <h2 id="menu-title" className="title">
            {menuText.title}
          </h2>
          <p className="lead">{menuText.text}</p>
        </header>

        <Featured onShow={showCategory} />

        <div ref={browserRef} className="menu__browser">
          <div ref={tabsRef} className="menu__tabs" role="tablist" aria-label="Categorias do cardápio">
            {menuCategories.map((c, i) => {
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
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                >
                  {c.label}
                  <span className="menu__tab-count" aria-hidden="true">
                    {countItems(c)}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            ref={panelRef}
            key={current.id}
            id="menu-panel"
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            className={`menu__panel${expanded ? ' is-expanded' : ''}`}
            tabIndex={0}
          >
            <p className="menu__intro">
              {current.intro} <span className="menu__total">{total} itens.</span>
            </p>

            <div className="menu__groups">
              {current.groups.map((group) => {
                const first = index;
                index += group.items.length;
                return (
                  <div key={group.title} className={`menu__group${first >= PREVIEW ? ' is-extra' : ''}`}>
                    <h3 className="menu__group-title">
                      {group.title}
                      {group.note && <span className="menu__group-note">{group.note}</span>}
                    </h3>
                    <ul role="list" className="menu__items">
                      {group.items.map((item, i) => (
                        <li
                          key={item.name}
                          className={[
                            'menu__item',
                            first + i >= PREVIEW && 'is-extra',
                            item.featured && 'is-featured',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <Item item={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {total > PREVIEW && (
              <button type="button" className="menu__more" aria-expanded={expanded} onClick={toggle}>
                {expanded ? <Minus /> : <Plus />}
                {expanded ? 'Mostrar menos' : `Ver todos os ${total} itens`}
              </button>
            )}
          </div>

          <p className="menu__note">
            <Phone />
            <span>
              {menuNote}{' '}
              <a href={business.phone.href}>Ligar: {business.phone.display}</a>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
