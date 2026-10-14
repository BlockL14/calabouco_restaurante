import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { sectionIds } from '../../content/business';
import { images } from '../../content/images';
import type { MenuCategoryId } from '../../content/menu';
import { slides, type Slide } from '../../content/slides';
import { createPictureElement, glowSrc, preloadImage } from '../../lib/images';
import { duration, easing, nextFrame, prefersReducedMotion, wait } from '../../lib/motion';
import { ArrowLeft, ArrowRight } from '../Icons';
import { Picture } from '../Picture';
import './Showcase.css';

/**
 * Mesmo `sizes` para a fotografia de fundo, o clone da transição e o pré-carregamento.
 * Telas deitadas: a foto ocupa o lado direito (≈ 50–64% da largura). Em pé: largura total.
 */
const PHOTO_SIZES = '(orientation: landscape) and (min-width: 700px) 62vw, 100vw';
const CARD_SIZES = '(orientation: landscape) and (min-width: 700px) 200px, 34vw';

const total = slides.length;
const wrap = (i: number) => ((i % total) + total) % total;
const pad = (n: number) => String(n).padStart(2, '0');

type Box<T> = { current: T };

type Refs = {
  active: Box<number>;
  busy: Box<boolean>;
  target: Box<number | null>;
  pending: Box<number | null>;
  focusAfter: Box<boolean>;
  prefetchedAll: Box<boolean>;
  photo: Box<HTMLDivElement | null>;
  photoImg: Box<HTMLImageElement | null>;
  layer: Box<HTMLDivElement | null>;
  slide: Box<HTMLDivElement | null>;
  rail: Box<HTMLUListElement | null>;
  cards: Box<Map<string, HTMLLIElement>>;
  firstRects: Box<Map<string, DOMRect> | null>;
};

type Setters = {
  setActive: (i: number) => void;
  setPrevious: (i: number | null) => void;
  setPhotoIndex: (i: number) => void;
  setGlowIndex: (i: number) => void;
  setEntering: (v: boolean) => void;
  setAnnouncement: (s: string) => void;
};

const usedRadius = (value: string, box: DOMRect) => Math.min(parseFloat(value) || 0, box.width / 2, box.height / 2);

const radii = (el: HTMLElement, box: DOMRect) => {
  const s = getComputedStyle(el);
  const r = (v: string) => `${usedRadius(v, box)}px`;
  return {
    borderTopLeftRadius: r(s.borderTopLeftRadius),
    borderTopRightRadius: r(s.borderTopRightRadius),
    borderBottomLeftRadius: r(s.borderBottomLeftRadius),
    borderBottomRightRadius: r(s.borderBottomRightRadius),
  };
};

const currentScale = (el: Element | null) => {
  if (!el) return 1;
  const t = getComputedStyle(el).transform;
  return !t || t === 'none' ? 1 : new DOMMatrixReadOnly(t).a || 1;
};

/**
 * Controlador da transição (criado uma única vez; usa apenas refs e setters estáveis).
 * Sequência, como na referência: o cartão escolhido cresce até cobrir o fundo, o fundo
 * anterior escurece, os demais cartões deslizam uma posição, o título entra linha a linha
 * e a numeração rola. Cliques rápidos não acumulam animações: durante uma troca, só o
 * último destino pedido fica pendente e é executado ao final.
 */
function createController(refs: Refs, set: Setters) {
  const announce = (i: number) => {
    const s = slides[i];
    set.setAnnouncement(`Destaque ${i + 1} de ${total}: ${s.label}. ${s.title}`);
  };

  const commit = (target: number) => {
    const railBox = refs.rail.current?.getBoundingClientRect();
    if (railBox) {
      const map = new Map<string, DOMRect>();
      refs.cards.current.forEach((el, id) => {
        const r = el.getBoundingClientRect();
        map.set(id, new DOMRect(r.left - railBox.left, r.top - railBox.top, r.width, r.height));
      });
      refs.firstRects.current = map;
    }
    set.setPrevious(refs.active.current);
    refs.active.current = target;
    set.setEntering(true);
    set.setActive(target);
    if (!refs.focusAfter.current) announce(target);
  };

  const finish = () => {
    refs.busy.current = false;
    refs.target.current = null;
    if (refs.focusAfter.current) {
      refs.focusAfter.current = false;
      refs.slide.current?.focus({ preventScroll: true });
    }
    const pending = refs.pending.current;
    refs.pending.current = null;
    if (pending !== null && pending !== refs.active.current) {
      void run(pending);
      return;
    }
    // Depois da primeira interação, prepara as demais imagens em segundo plano.
    if (!refs.prefetchedAll.current) {
      refs.prefetchedAll.current = true;
      slides.forEach((s) => void preloadImage(images[s.image], PHOTO_SIZES));
    }
  };

  async function run(target: number) {
    refs.busy.current = true;
    refs.target.current = target;
    const next = slides[target];
    const asset = images[next.image];

    await preloadImage(asset, PHOTO_SIZES);

    const photo = refs.photo.current;
    const layer = refs.layer.current;
    const oldImg = refs.photoImg.current;
    const card = refs.cards.current.get(next.id) ?? null;
    const media = card?.querySelector<HTMLElement>('.sc-card__media') ?? null;

    // Movimento reduzido (ou elementos indisponíveis): troca direta com leve fusão.
    if (prefersReducedMotion() || !photo || !layer || !oldImg || !card || !media) {
      set.setGlowIndex(target);
      commit(target);
      set.setPhotoIndex(target);
      await nextFrame();
      refs.photoImg.current?.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 240, easing: 'linear' });
      await wait(240);
      finish();
      return;
    }

    const D = duration('--dur-morph', 900);
    const ease = easing('--ease-morph', 'cubic-bezier(0.72, 0, 0.18, 1)');
    const easeIn = easing('--ease-in', 'cubic-bezier(0.5, 0, 0.75, 0)');
    const layerBox = layer.getBoundingClientRect();
    const from = media.getBoundingClientRect();
    const to = photo.getBoundingClientRect();
    const box = (r: DOMRect) => ({
      left: `${r.left - layerBox.left}px`,
      top: `${r.top - layerBox.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });

    // 1. O clone nasce exatamente sobre o cartão (que some) e passa por baixo dos demais.
    const clone = document.createElement('div');
    clone.className = 'showcase__clone';
    const { picture, img } = createPictureElement(asset, PHOTO_SIZES);
    clone.appendChild(picture);
    layer.appendChild(clone);
    const startScale = currentScale(media.querySelector('img'));
    card.style.visibility = 'hidden';

    // Em pé, o clone voa acima do sombreamento; leva consigo o mesmo degradê,
    // que surge durante o voo, para pousar idêntico ao fundo sem perder a leitura do texto.
    const shade = layer.parentElement?.querySelector<HTMLElement>('.showcase__shade');
    const aboveShade = !!shade && Number(getComputedStyle(layer).zIndex) > Number(getComputedStyle(shade).zIndex);
    if (aboveShade) {
      const cloneShade = document.createElement('div');
      cloneShade.className = 'showcase__clone-shade';
      clone.appendChild(cloneShade);
      cloneShade.animate([{ opacity: 0 }, { opacity: 1 }], { duration: D, easing: ease, fill: 'forwards' });
    }

    // 2. Ele cresce até cobrir todo o fundo; os cantos arredondados se desfazem.
    const morph = clone.animate(
      [
        { ...box(from), ...radii(media, from) },
        { ...box(to), ...radii(photo, to) },
      ],
      { duration: D, easing: ease, fill: 'forwards' },
    );
    img.animate([{ transform: `scale(${startScale})` }, { transform: 'scale(1)' }], {
      duration: D,
      easing: ease,
      fill: 'forwards',
    });

    // 3. O fundo anterior escurece até quase o preto, cedendo espaço.
    const recede = oldImg.animate(
      [
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: 'scale(1.05)', filter: 'brightness(0.12)' },
      ],
      { duration: D * 0.8, easing: ease, fill: 'forwards' },
    );
    set.setGlowIndex(target);

    // 4. O texto atual sai para cima.
    const textOut = duration('--dur-text-out', 220);
    refs.slide.current?.querySelectorAll('[data-anim]').forEach((el, i) => {
      el.animate(
        [
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: 'translate3d(0, -14px, 0)' },
        ],
        { duration: textOut, delay: i * 30, easing: easeIn, fill: 'forwards' },
      );
    });

    // 5. Novo texto, nova ordem dos cartões e nova numeração durante o voo do clone.
    //    Quando o cartão está abaixo do fundo (celular), espera o clone passar pelo texto.
    const fromBelow = from.top > to.bottom - 8;
    await wait(fromBelow ? D * 0.55 : Math.max(textOut + 80, D * 0.42));
    commit(target);

    await morph.finished.catch(() => undefined);

    // 6. Pouso: o fundo assume o novo destaque por baixo do clone, que é removido.
    recede.cancel();
    set.setPhotoIndex(target);
    await nextFrame();
    await refs.photoImg.current?.decode().catch(() => undefined);
    await nextFrame();
    clone.remove();
    card.style.visibility = '';
    finish();
  }

  const go = (index: number, opts: { focus?: boolean } = {}) => {
    const target = wrap(index);
    if (refs.busy.current) {
      refs.pending.current = target;
      if (opts.focus) refs.focusAfter.current = true;
      return;
    }
    if (target === refs.active.current) return;
    if (opts.focus) refs.focusAfter.current = true;
    void run(target);
  };

  const step = (dir: 1 | -1) => {
    const base = refs.pending.current ?? refs.target.current ?? refs.active.current;
    go(base + dir);
  };

  return { go, step };
}

/** Título em duas linhas; cada linha é revelada de baixo para cima, como na referência. */
function SlideTitle({ slide }: { slide: Slide }) {
  const { title, emphasis } = slide;
  const split = title.endsWith(emphasis) ? title.length - emphasis.length : title.length;
  const lines = [title.slice(0, split).trim(), title.slice(split).trim()].filter(Boolean);
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`sc-line${i === 1 ? ' sc-line--em' : ''}`}>
          <span className="sc-line__i" style={{ '--i': i } as CSSProperties}>
            {line}
          </span>
          {i < lines.length - 1 && ' '}
        </span>
      ))}
    </>
  );
}

type ShowcaseProps = { onSelectCategory: (id: MenuCategoryId) => void };

export function Showcase({ onSelectCategory }: ShowcaseProps) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [glowIndex, setGlowIndex] = useState(0);
  const [entering, setEntering] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const refs: Refs = {
    active: useRef(0),
    busy: useRef(false),
    target: useRef<number | null>(null),
    pending: useRef<number | null>(null),
    focusAfter: useRef(false),
    prefetchedAll: useRef(false),
    photo: useRef<HTMLDivElement | null>(null),
    photoImg: useRef<HTMLImageElement | null>(null),
    layer: useRef<HTMLDivElement | null>(null),
    slide: useRef<HTMLDivElement | null>(null),
    rail: useRef<HTMLUListElement | null>(null),
    cards: useRef(new Map<string, HTMLLIElement>()),
    firstRects: useRef<Map<string, DOMRect> | null>(null),
  };
  const [controller] = useState(() =>
    createController(refs, { setActive, setPrevious, setPhotoIndex, setGlowIndex, setEntering, setAnnouncement }),
  );
  const { cards: cardEls, firstRects, rail } = refs;

  const slide = slides[active];
  const order = Array.from({ length: total - 1 }, (_, k) => wrap(active + 1 + k));

  // Reorganização dos cartões (FLIP): os que ficam deslizam uma posição; o destaque
  // que saiu do fundo volta como último cartão, entrando pela direita.
  useLayoutEffect(() => {
    const first = firstRects.current;
    firstRects.current = null;
    const railBox = rail.current?.getBoundingClientRect();
    if (!first || !railBox || prefersReducedMotion()) return;
    const D = duration('--dur-slow', 720);
    const ease = easing('--ease-out', 'cubic-bezier(0.16, 1, 0.3, 1)');
    cardEls.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      const prev = first.get(id);
      if (prev) {
        const dx = prev.x - (r.left - railBox.left);
        const dy = prev.y - (r.top - railBox.top);
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], {
            duration: D,
            easing: ease,
          });
        }
      } else {
        el.animate(
          [
            { opacity: 0, transform: 'translate3d(48px, 0, 0)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: D, delay: 180, easing: ease, fill: 'backwards' },
        );
      }
    });
  }, [active, cardEls, firstRects, rail]);

  // Pré-carrega o próximo destaque quando o navegador estiver ocioso.
  useEffect(() => {
    const prefetch = () => void preloadImage(images[slides[1 % total].image], PHOTO_SIZES);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 1500);
    return () => clearTimeout(id);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      controller.step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      controller.step(-1);
    }
  };

  // Gesto horizontal em telas de toque; `touch-action: pan-y` preserva a rolagem vertical.
  // Gestos iniciados sobre links e botões são ignorados (toque normal).
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || (e.target as Element).closest('a, button')) return;
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) controller.step(dx < 0 ? 1 : -1);
  };

  const prefetch = (i: number) => void preloadImage(images[slides[i].image], PHOTO_SIZES);

  return (
    <section
      id={sectionIds.top}
      className="showcase"
      aria-labelledby="showcase-brand"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipe.current = null)}
    >
      {/* Fundo: luz ambiente (foto desfocada), fotografia, clone em voo e sombreamento */}
      <div className="showcase__ambient" aria-hidden="true">
        {slides.map((s, i) => {
          const glow = glowSrc(images[s.image]);
          return (
            <div
              key={s.id}
              className={`showcase__glow${i === glowIndex ? ' is-active' : ''}`}
              style={glow ? { backgroundImage: `url(${glow})` } : undefined}
            />
          );
        })}
      </div>
      <div ref={refs.photo} className="showcase__photo">
        <Picture
          image={slides[photoIndex].image}
          sizes={PHOTO_SIZES}
          priority
          imgRef={refs.photoImg}
          imgClassName="showcase__photo-img"
        />
      </div>
      <div ref={refs.layer} className="showcase__layer" aria-hidden="true" />
      <div className="showcase__shade" aria-hidden="true" />

      <div
        className="showcase__inner"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Destaques do Calabouço"
        onKeyDown={onKeyDown}
      >
        <div className="showcase__copy">
          <h1 id="showcase-brand" className="sr-only">
            Calabouço Restaurante e Pizzaria — Curitiba
          </h1>
          <div
            key={slide.id}
            ref={refs.slide}
            className={`showcase__slide${entering ? ' is-entering' : ''}`}
            role="group"
            aria-roledescription="destaque"
            aria-label={`${active + 1} de ${total}: ${slide.label}`}
            tabIndex={-1}
          >
            <p className="showcase__eyebrow" data-anim>
              <span className="showcase__dash" aria-hidden="true" />
              {slide.eyebrow}
            </p>
            <h2 className="showcase__title" data-anim>
              <SlideTitle slide={slide} />
            </h2>
            <p className="showcase__desc" data-anim style={{ '--d': 420 } as CSSProperties}>
              {slide.description}
            </p>
            <div data-anim style={{ '--d': 520 } as CSSProperties}>
              <a
                className="sc-cta"
                href={slide.cta.href}
                onClick={() => slide.cta.menuCategory && onSelectCategory(slide.cta.menuCategory)}
              >
                <span className="sc-cta__dot" aria-hidden="true">
                  <ArrowRight />
                </span>
                <span className="sc-cta__label">{slide.cta.label}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="showcase__rail">
          {/* A entrada inicial dos cartões só roda antes da primeira troca: depois, a
              reordenação do React reinseriria os nós e reiniciaria a animação. */}
          <ul ref={refs.rail} className={`showcase__cards${entering ? '' : ' is-intro'}`} role="list">
            {order.map((i) => {
              const s = slides[i];
              return (
                <li
                  key={s.id}
                  ref={(el) => {
                    if (el) cardEls.current.set(s.id, el);
                    else cardEls.current.delete(s.id);
                  }}
                >
                  <button
                    type="button"
                    className="sc-card"
                    onClick={(e) => controller.go(i, { focus: e.detail === 0 })}
                    onPointerEnter={() => prefetch(i)}
                    onPointerDown={() => prefetch(i)}
                    onFocus={() => prefetch(i)}
                  >
                    <span className="sc-card__media">
                      <Picture image={s.image} sizes={CARD_SIZES} alt="" />
                    </span>
                    <span className="sc-card__body">
                      <span className="sc-card__dash" aria-hidden="true" />
                      <span className="sc-card__kicker">{s.kicker}</span>
                      <span className="sc-card__title">
                        <span className="sr-only">Ver destaque: </span>
                        {s.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="showcase__controls">
          <button
            type="button"
            className="icon-btn sc-arrow"
            onClick={() => controller.step(-1)}
            onPointerEnter={() => prefetch(wrap(active - 1))}
            aria-label="Destaque anterior"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            className="icon-btn sc-arrow"
            onClick={() => controller.step(1)}
            onPointerEnter={() => prefetch(wrap(active + 1))}
            aria-label="Próximo destaque"
          >
            <ArrowRight />
          </button>
          <span className="sc-progress" aria-hidden="true">
            <span className="sc-progress__fill" style={{ transform: `scaleX(${(active + 1) / total})` }} />
          </span>
          <span className="sc-number" aria-hidden="true">
            {previous !== null && previous !== active && (
              <span key={`out-${previous}-${active}`} className="sc-number__d is-out">
                {pad(previous + 1)}
              </span>
            )}
            <span key={`in-${active}`} className={`sc-number__d${entering ? ' is-in' : ''}`}>
              {pad(active + 1)}
            </span>
          </span>
        </div>
      </div>

      {images[slides[photoIndex].image].credit && (
        <p className="showcase__credit">Crédito: {images[slides[photoIndex].image].credit}</p>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
