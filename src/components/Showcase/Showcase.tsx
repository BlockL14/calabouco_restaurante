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

/** Mesmo `sizes` para a imagem principal, o clone da transição e o pré-carregamento. */
const PANEL_SIZES = '(min-width: 1024px) 46vw, (min-width: 700px) 48vw, 100vw';
const CARD_SIZES = '(min-width: 1024px) 160px, 120px';

const total = slides.length;
const wrap = (i: number) => (((i % total) + total) % total);
const pad = (n: number) => String(n).padStart(2, '0');

type Refs = {
  active: { current: number };
  busy: { current: boolean };
  target: { current: number | null };
  pending: { current: number | null };
  focusAfter: { current: boolean };
  prefetchedAll: { current: boolean };
  panel: { current: HTMLDivElement | null };
  panelImg: { current: HTMLImageElement | null };
  layer: { current: HTMLDivElement | null };
  slide: { current: HTMLDivElement | null };
  rail: { current: HTMLUListElement | null };
  cards: { current: Map<string, HTMLLIElement> };
  firstRects: { current: Map<string, DOMRect> | null };
};

type Setters = {
  setActive: (i: number) => void;
  setPanelIndex: (i: number) => void;
  setGlowIndex: (i: number) => void;
  setEntering: (v: boolean) => void;
  setAnnouncement: (s: string) => void;
};

const usedRadius = (value: string, box: DOMRect) => {
  const px = parseFloat(value) || 0;
  return Math.min(px, box.width / 2, box.height / 2);
};

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
  if (!t || t === 'none') return 1;
  return new DOMMatrixReadOnly(t).a || 1;
};

/**
 * Controlador da transição. Criado uma única vez: usa apenas refs e setters estáveis.
 * Cliques rápidos não acumulam animações: durante uma troca, só o último destino
 * pedido fica pendente e é executado ao final.
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
      slides.forEach((s) => void preloadImage(images[s.image], PANEL_SIZES));
    }
  };

  async function run(target: number) {
    refs.busy.current = true;
    refs.target.current = target;
    const next = slides[target];
    const asset = images[next.image];

    await preloadImage(asset, PANEL_SIZES);

    const panel = refs.panel.current;
    const layer = refs.layer.current;
    const oldImg = refs.panelImg.current;
    const media = refs.cards.current.get(next.id)?.querySelector<HTMLElement>('.sc-card__media') ?? null;

    // Movimento reduzido (ou elementos indisponíveis): troca direta com leve fusão.
    if (prefersReducedMotion() || !panel || !layer || !oldImg || !media) {
      set.setGlowIndex(target);
      commit(target);
      set.setPanelIndex(target);
      await nextFrame();
      refs.panelImg.current?.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 220, easing: 'linear' });
      await wait(220);
      finish();
      return;
    }

    const D = duration('--dur-morph', 860);
    const ease = easing('--ease-morph', 'cubic-bezier(0.72, 0, 0.18, 1)');
    const easeIn = easing('--ease-in', 'cubic-bezier(0.5, 0, 0.75, 0)');
    const layerBox = layer.getBoundingClientRect();
    const from = media.getBoundingClientRect();
    const to = panel.getBoundingClientRect();
    const box = (r: DOMRect) => ({
      left: `${r.left - layerBox.left}px`,
      top: `${r.top - layerBox.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });

    // 1. O clone nasce exatamente sobre a imagem do cartão…
    const clone = document.createElement('div');
    clone.className = 'showcase__clone';
    const { picture, img } = createPictureElement(asset, PANEL_SIZES);
    clone.appendChild(picture);
    layer.appendChild(clone);
    const startScale = currentScale(media.querySelector('img'));
    media.style.visibility = 'hidden';

    // 2. …e cresce até ocupar a área principal; o arco do cartão se abre.
    const morph = clone.animate(
      [
        { ...box(from), ...radii(media, from) },
        { ...box(to), ...radii(panel, to) },
      ],
      { duration: D, easing: ease, fill: 'forwards' },
    );
    img.animate([{ transform: `scale(${startScale})` }, { transform: 'scale(1)' }], {
      duration: D,
      easing: ease,
      fill: 'forwards',
    });

    // 3. A imagem anterior recua e escurece, cedendo espaço.
    const recede = oldImg.animate(
      [
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: 'scale(1.07)', filter: 'brightness(0.32)' },
      ],
      { duration: D, easing: ease, fill: 'forwards' },
    );
    set.setGlowIndex(target);

    // 4. O texto atual sai rapidamente.
    const textOut = duration('--dur-text-out', 220);
    refs.slide.current?.querySelectorAll('[data-anim]').forEach((el, i) => {
      el.animate(
        [
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: 'translate3d(0, -12px, 0)' },
        ],
        { duration: textOut, delay: i * 28, easing: easeIn, fill: 'forwards' },
      );
    });

    // 5. O novo texto e a nova ordem dos cartões entram durante o voo do clone.
    //    Quando o cartão está abaixo da imagem (celular), espera o clone passar pelo texto.
    const fromBelow = from.top > to.bottom - 8;
    await wait(fromBelow ? D * 0.62 : Math.max(textOut + 60, D * 0.38));
    commit(target);

    await morph.finished.catch(() => undefined);

    // 6. Pouso: a imagem principal assume o novo destaque por baixo do clone, que é removido.
    recede.cancel();
    set.setPanelIndex(target);
    await nextFrame();
    await refs.panelImg.current?.decode().catch(() => undefined);
    await nextFrame();
    clone.remove();
    media.style.visibility = '';
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

function SlideTitle({ slide }: { slide: Slide }) {
  const { title, emphasis } = slide;
  const split = emphasis && title.endsWith(emphasis) ? title.length - emphasis.length : title.length;
  const plain = title.slice(0, split).trim().split(/\s+/).filter(Boolean);
  const em = title.slice(split).trim().split(/\s+/).filter(Boolean);
  let i = 0;
  const word = (w: string, key: string) => (
    <span key={key}>
      <span className="w">
        <span className="w__i" style={{ '--i': i++ } as CSSProperties}>
          {w}
        </span>
      </span>{' '}
    </span>
  );
  return (
    <>
      {plain.map((w, k) => word(w, `p${k}`))}
      {em.length > 0 && <em>{em.map((w, k) => word(w, `e${k}`))}</em>}
    </>
  );
}

type ShowcaseProps = { onSelectCategory: (id: MenuCategoryId) => void };

export function Showcase({ onSelectCategory }: ShowcaseProps) {
  const [active, setActive] = useState(0);
  const [panelIndex, setPanelIndex] = useState(0);
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
    panel: useRef<HTMLDivElement | null>(null),
    panelImg: useRef<HTMLImageElement | null>(null),
    layer: useRef<HTMLDivElement | null>(null),
    slide: useRef<HTMLDivElement | null>(null),
    rail: useRef<HTMLUListElement | null>(null),
    cards: useRef(new Map<string, HTMLLIElement>()),
    firstRects: useRef<Map<string, DOMRect> | null>(null),
  };
  const [controller] = useState(() =>
    createController(refs, { setActive, setPanelIndex, setGlowIndex, setEntering, setAnnouncement }),
  );
  const { cards: cardEls, firstRects, rail } = refs;

  const slide = slides[active];
  const order = Array.from({ length: total - 1 }, (_, k) => wrap(active + 1 + k));

  // Reorganização dos cartões (FLIP): cada cartão desliza da posição antiga para a nova.
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
            { opacity: 0, transform: 'translate3d(0, 28px, 0)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: D, delay: 140, easing: ease, fill: 'backwards' },
        );
      }
    });
  }, [active, cardEls, firstRects, rail]);

  // Pré-carrega o próximo destaque quando o navegador estiver ocioso.
  useEffect(() => {
    const prefetch = () => void preloadImage(images[slides[1 % total].image], PANEL_SIZES);
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

  // Gesto horizontal no celular; `touch-action: pan-y` preserva a rolagem vertical.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
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

  const prefetch = (i: number) => void preloadImage(images[slides[i].image], PANEL_SIZES);

  const counter = (
    <>
      <span className="showcase__count-now numeral">{pad(active + 1)}</span>
      <span className="showcase__count-total">/ {pad(total)}</span>
    </>
  );
  const progress = (
    <span className="showcase__progress" aria-hidden="true">
      {slides.map((s, i) => (
        <span key={s.id} className={i === active ? 'is-active' : undefined} />
      ))}
    </span>
  );

  return (
    <section id={sectionIds.top} className="showcase" aria-labelledby="showcase-brand">
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

      <div
        className="showcase__inner"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Destaques do Calabouço"
        onKeyDown={onKeyDown}
      >
        <div className="showcase__copy">
          <h1 id="showcase-brand" className="showcase__brand eyebrow">
            Calabouço · Restaurante e Pizzaria
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
            <h2 className="showcase__title display" data-anim>
              <SlideTitle slide={slide} />
            </h2>
            <p className="showcase__desc lead" data-anim style={{ '--d': 300 } as CSSProperties}>
              {slide.description}
            </p>
            <div data-anim style={{ '--d': 380 } as CSSProperties}>
              <a
                className="btn btn--primary"
                href={slide.cta.href}
                onClick={() => slide.cta.menuCategory && onSelectCategory(slide.cta.menuCategory)}
              >
                {slide.cta.label}
                <ArrowRight className="btn__icon btn__icon--arrow" />
              </a>
            </div>
          </div>
        </div>

        <div className="showcase__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <div ref={refs.panel} className="showcase__panel">
            <Picture
              image={slides[panelIndex].image}
              sizes={PANEL_SIZES}
              priority
              imgRef={refs.panelImg}
              imgClassName="showcase__panel-img"
            />
          </div>
          <div className="showcase__meter" aria-hidden="true">
            <span className="showcase__count">{counter}</span>
            {progress}
          </div>
        </div>

        <div className="showcase__controls">
          <button
            type="button"
            className="icon-btn showcase__prev"
            onClick={() => controller.step(-1)}
            onPointerEnter={() => prefetch(wrap(active - 1))}
            aria-label="Destaque anterior"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            className="icon-btn showcase__next"
            onClick={() => controller.step(1)}
            onPointerEnter={() => prefetch(wrap(active + 1))}
            aria-label="Próximo destaque"
          >
            <ArrowRight />
          </button>
          <div className="showcase__status" aria-hidden="true">
            <span className="showcase__count">{counter}</span>
            {progress}
            <span className="showcase__status-label">{slide.label}</span>
          </div>
        </div>

        <div className="showcase__rail">
          <p className="showcase__rail-title" aria-hidden="true">
            A seguir
          </p>
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
                    <span className="sc-card__meta">
                      <span className="sc-card__num numeral" aria-hidden="true">
                        {pad(i + 1)}
                      </span>
                      <span className="sc-card__label">
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
      </div>

      <div ref={refs.layer} className="showcase__layer" aria-hidden="true" />
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
