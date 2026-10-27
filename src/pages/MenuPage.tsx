import { useLayoutEffect, useRef, type ComponentType } from 'react';
import { DisplayLines } from '../components/DisplayLines';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import {
  ArrowRight,
  Cheese,
  Cloche,
  Dessert,
  Octagon,
  Ornament,
  PizzaSlice,
  Printer,
  WineGlass,
} from '../components/Icons';
import { CrownIllustration } from '../components/Menu/CrownIllustration';
import { Picture } from '../components/Picture';
import { Split } from '../components/Split/Split';
import { business } from '../content/business';
import {
  countItems,
  featuredDish,
  menuCategories,
  menuNote,
  type MenuCategory,
  type MenuCategoryId,
} from '../content/menu';
import { useInitialHashScroll } from '../hooks/useInitialHashScroll';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { useScrollSpy } from '../hooks/useScrollSpy';
import './MenuPage.css';

// Página do cardápio completo: todas as categorias, com a navegação das abas da
// interface aprovada presa abaixo do cabeçalho.

const ICONS: Record<MenuCategoryId, ComponentType<{ className?: string }>> = {
  pizzas: PizzaSlice,
  entradas: Cheese,
  pratos: Cloche,
  sobremesas: Dessert,
  bebidas: WineGlass,
};

const CATEGORY_IDS = menuCategories.map((c) => c.id);

function MenuHero() {
  return (
    <Split
      id="topo"
      labelledBy="cardapio-titulo"
      side="right"
      className="menu-hero"
      media={<Picture image="pizza" sizes="(min-width: 900px) 61vw, 100vw" priority />}
    >
      <p className="eyebrow">Cardápio do Calabouço</p>
      <h1 id="cardapio-titulo" className="display display--xl">
        <span className="sr-only">{business.legalName}: </span>
        <DisplayLines lines={['Nosso', 'cardápio']} />
      </h1>
      <p className="lead">
        Pizzas da casa com nomes de castelo, tradicionais e calzones, entradas, pratos, sobremesas e bebidas.{' '}
        {menuNote}
      </p>
      <div className="menu-hero__actions">
        <a className="btn" href={business.phone.href}>
          Ligar para a casa
        </a>
        <button type="button" className="text-link text-link--light" onClick={() => window.print()}>
          <span className="text-link__label">Imprimir cardápio</span>
          <Printer />
        </button>
      </div>
    </Split>
  );
}

function MenuNav() {
  const active = useScrollSpy(CATEGORY_IDS);
  const listRef = useRef<HTMLUListElement>(null);

  // Mantém a categoria ativa visível na faixa rolável (celular)
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const link = active ? list.querySelector<HTMLAnchorElement>(`[href="#${active}"]`) : null;
    const left = link ? link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2 : 0;
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  return (
    <nav className="menu-nav" aria-label="Categorias do cardápio">
      <ul ref={listRef} role="list" className="menu-nav__list">
        {menuCategories.map((c) => (
          <li key={c.id}>
            <a className="menu-nav__link" href={`#${c.id}`} aria-current={active === c.id ? 'location' : undefined}>
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FeaturedDish() {
  return (
    <article id={featuredDish.id} className="menu-feature ticket-frame" aria-labelledby="coroa-real-titulo" tabIndex={-1}>
      <div className="menu-feature__art" aria-hidden="true">
        <CrownIllustration className="menu-feature__crown" />
      </div>
      <div className="menu-feature__text">
        <p className="eyebrow">{featuredDish.eyebrow}</p>
        <h3 id="coroa-real-titulo" className="display menu-feature__title">
          {featuredDish.name}
        </h3>
        <p className="lead">{featuredDish.description}</p>
      </div>
    </article>
  );
}

function MenuSection({ category }: { category: MenuCategory }) {
  const Icon = ICONS[category.id];
  const total = countItems(category);
  // A Coroa Real aparece no destaque; o grupo dela não se repete na lista
  const groups = category.groups.filter((g) => !g.items.some((item) => item.featured));
  const hasFeatured = groups.length < category.groups.length;

  return (
    <section id={category.id} className="menu-section" aria-labelledby={`${category.id}-titulo`} tabIndex={-1}>
      <div className="container">
        <header className="menu-section__head" data-reveal>
          <span className="menu-section__badge" aria-hidden="true">
            <Octagon className="menu-section__frame" />
            <Icon className="menu-section__icon" />
          </span>
          <h2 id={`${category.id}-titulo`} className="display menu-section__title">
            {category.label}
          </h2>
          <p className="menu-section__intro">{category.intro}</p>
          <p className="menu-section__count">
            <span className="numeral">{total}</span> itens
          </p>
        </header>

        {hasFeatured && <FeaturedDish />}

        <div className="menu-section__groups">
          {groups.map((group) => (
            <div key={group.title} className="menu-group">
              <h3 className="menu-group__title">
                {group.title}
                <span className="menu-group__count numeral" aria-hidden="true">
                  {group.items.length}
                </span>
              </h3>
              <ul role="list" className="menu-group__items">
                {group.items.map((item) => (
                  <li key={item.name} className="menu-group__item">
                    <span className="menu-group__name">{item.name}</span>
                    {item.note && <span className="menu-group__note">{item.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MenuClosing() {
  const { phone, links } = business;
  return (
    <section className="menu-closing" aria-labelledby="cardapio-fim-titulo">
      <div className="container menu-closing__inner" data-reveal>
        <Ornament className="menu-closing__ornament" />
        <h2 id="cardapio-fim-titulo" className="display display--sm">
          Valores e disponibilidade
        </h2>
        <p className="lead">
          Os valores e a disponibilidade dos itens são informados pela casa. Para saber os dias e horários de
          funcionamento, ligue para {phone.display}.
        </p>
        <div className="menu-closing__actions">
          <a className="btn" href={phone.href}>
            Ligar para a casa
          </a>
          <a className="text-link" href={links.maps} target="_blank" rel="noopener noreferrer">
            <span className="text-link__label">Como chegar</span>
            <ArrowRight />
            <span className="sr-only"> (abre o Google Maps em nova aba)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function MenuPage() {
  useRevealOnScroll();
  useInitialHashScroll();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header page="menu" />
      <main id="conteudo" tabIndex={-1}>
        <MenuHero />
        <MenuNav />
        {menuCategories.map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
        <MenuClosing />
      </main>
      <Footer page="menu" />
    </>
  );
}
