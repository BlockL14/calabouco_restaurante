import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
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

const total = slides.length;
const wrap = (i: number) => ((i % total) + total) % total;
const pad = (n: number) => String(n).padStart(2, '0');

type Box<T> = { current: T };

type Refs = {
  active: Box<number>;
  busy: Box<boolean>;
  target: Box<number | null>;
  pending: Box<number | null>;
  prefetchedAll: Box<boolean>;
  photo: Box<HTMLDivElement | null>;
  photoImg: Box<HTMLImageElement | null>;
  layer: Box<HTMLDivElement | null>;
  slide: Box<HTMLDivElement | null>;
};

type Setters = {
  setActive: (i: number) => void;
  setPrevious: (i: number | null) => void;
  setPhotoIndex: (i: number) => void;
  setGlowIndex: (i: number) => void;
  setEntering: (v: boolean) => void;
  setAnnouncement: (s: string) => void;
};

/**
 * Controlador da transição (criado uma única vez; usa apenas refs e setters estáveis).
 * O texto atual sobe e some, a nova foto surge por fusão lenta sobre a anterior (que
 * escurece), a luz da parede muda de cor, o título entra linha a linha e a numeração rola.
 * Cliques rápidos não acumulam animações: durante uma troca, só o último destino pedido
 * fica pendente e é executado ao final.
 */
function createController(refs: Refs, set: Setters) {
  const announce = (i: number) => {
    const s = slides[i];
    set.setAnnouncement(`Destaque ${i + 1} de ${total}: ${s.label}. ${s.title}`);
  };

  const commit = (target: number) => {
    set.setPrevious(refs.active.current);
    refs.active.current = target;
    set.setEntering(true);
    set.setActive(target);
    announce(target);
  };

  const finish = () => {
    refs.busy.current = false;
    refs.target.current = null;
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

  /** O texto atual sai para cima. Devolve a duração. */
  const textOut = () => {
    const D = duration('--dur-text-out', 220);
    const ease = easing('--ease-in', 'cubic-bezier(0.5, 0, 0.75, 0)');
    refs.slide.current?.querySelectorAll('[data-anim]').forEach((el, i) => {
      el.animate(
        [
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: 'translate3d(0, -14px, 0)' },
        ],
        { duration: D, delay: i * 30, easing: ease, fill: 'forwards' },
      );
    });
    return D;
  };

  async function run(target: number) {
    refs.busy.current = true;
    refs.target.current = target;
    const asset = images[slides[target].image];
    const ready = preloadImage(asset, PHOTO_SIZES);

    const photo = refs.photo.current;
    const layer = refs.layer.current;
    const oldImg = refs.photoImg.current;

    // Movimento reduzido (ou elementos indisponíveis): troca direta com leve fusão.
    if (prefersReducedMotion() || !photo || !layer || !oldImg) {
      await ready;
      set.setGlowIndex(target);
      commit(target);
      set.setPhotoIndex(target);
      await nextFrame();
      refs.photoImg.current?.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 240, easing: 'linear' });
      await wait(240);
      finish();
      return;
    }

    const D = duration('--dur-fade', 1400);
    const ease = easing('--ease-in-out', 'cubic-bezier(0.65, 0, 0.35, 1)');
    const out = textOut();
    set.setGlowIndex(target);
    await ready;

    // A nova foto entra num clone exatamente sobre a atual (mesma máscara de bordas,
    // via .showcase__layer), com um leve assentamento de escala; a atual escurece.
    const layerBox = layer.getBoundingClientRect();
    const to = photo.getBoundingClientRect();
    const clone = document.createElement('div');
    clone.className = 'showcase__clone';
    Object.assign(clone.style, {
      left: `${to.left - layerBox.left}px`,
      top: `${to.top - layerBox.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
    });
    const { picture, img } = createPictureElement(asset, PHOTO_SIZES);
    clone.appendChild(picture);
    layer.appendChild(clone);
    await img.decode().catch(() => undefined);

    const fadeIn = clone.animate(
      [
        { opacity: 0, transform: 'scale(1.06)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: D, easing: ease, fill: 'forwards' },
    );
    const dim = oldImg.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(0.55)' }], {
      duration: D,
      easing: ease,
      fill: 'forwards',
    });

    // Se a janela mudar de tamanho no meio da fusão, encerra a animação em vez de seguir
    // num retângulo desatualizado; o pouso usa o layout novo.
    const onResize = () => [fadeIn, dim].forEach((a) => a.finish());
    window.addEventListener('resize', onResize);

    await wait(Math.max(out + 80, D * 0.3));
    commit(target);
    await fadeIn.finished.catch(() => undefined);
    window.removeEventListener('resize', onResize);

    // Pouso: o fundo assume o novo destaque por baixo do clone.
    dim.cancel();
    set.setPhotoIndex(target);
    await nextFrame();
    await refs.photoImg.current?.decode().catch(() => undefined);
    await nextFrame();
    clone.remove();
    finish();
  }

  const go = (index: number) => {
    const target = wrap(index);
    if (refs.busy.current) {
      refs.pending.current = target;
      return;
    }
    if (target !== refs.active.current) void run(target);
  };

  const step = (dir: 1 | -1) => {
    const base = refs.pending.current ?? refs.target.current ?? refs.active.current;
    go(base + dir);
  };

  return { go, step };
}

/** Título em duas linhas; cada linha é revelada de baixo para cima. */
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
    prefetchedAll: useRef(false),
    photo: useRef<HTMLDivElement | null>(null),
    photoImg: useRef<HTMLImageElement | null>(null),
    layer: useRef<HTMLDivElement | null>(null),
    slide: useRef<HTMLDivElement | null>(null),
  };
  const [controller] = useState(() =>
    createController(refs, { setActive, setPrevious, setPhotoIndex, setGlowIndex, setEntering, setAnnouncement }),
  );
  const prevBtn = useRef<HTMLButtonElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);

  const slide = slides[active];
  const credit = images[slide.image].credit;

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

  // Setas do teclado: o foco vai para a seta correspondente antes da troca, porque o
  // link da chamada é recriado a cada destaque e perderia o foco.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    (dir === 1 ? nextBtn : prevBtn).current?.focus({ preventScroll: true });
    controller.step(dir);
  };

  // Gesto horizontal em telas de toque; `touch-action: pan-y pinch-zoom` preserva a
  // rolagem vertical e o zoom. Se o gesto vira troca de destaque, o clique que viria
  // em seguida (por exemplo, sobre a chamada) é descartado.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
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
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 400);
      controller.step(dx < 0 ? 1 : -1);
    }
  };
  const onClickCapture = (e: MouseEvent) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.preventDefault();
    e.stopPropagation();
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
      onClickCapture={onClickCapture}
    >
      <h1 id="showcase-brand" className="sr-only">
        Calabouço Restaurante e Pizzaria — Curitiba
      </h1>

      {/* Fundo: parede com a luz da foto ativa (foto desfocada), fotografia, clone da fusão e sombreamento */}
      <div className="showcase__ambient wall" aria-hidden="true">
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
      {/* Artes com texto próprio (cartazes): faixa escura que esconde o texto impresso */}
      <div
        className={`showcase__veil${slides[glowIndex].tone === 'poster' ? ' is-on' : ''}`}
        aria-hidden="true"
      />

      <div
        className="showcase__inner"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Destaques do Calabouço"
        onKeyDown={onKeyDown}
      >
        <div className="showcase__copy">
          <div
            key={slide.id}
            ref={refs.slide}
            className={`showcase__slide${entering ? ' is-entering' : ''}`}
            role="group"
            aria-roledescription="destaque"
            aria-label={`${active + 1} de ${total}: ${slide.label}`}
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

        <div className="showcase__controls">
          <button
            ref={prevBtn}
            type="button"
            className="icon-btn sc-arrow"
            onClick={() => controller.step(-1)}
            onPointerEnter={() => prefetch(wrap(active - 1))}
            onFocus={() => prefetch(wrap(active - 1))}
            aria-label="Destaque anterior"
          >
            <ArrowLeft />
          </button>
          <button
            ref={nextBtn}
            type="button"
            className="icon-btn sc-arrow"
            onClick={() => controller.step(1)}
            onPointerEnter={() => prefetch(wrap(active + 1))}
            onFocus={() => prefetch(wrap(active + 1))}
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

      {credit && (
        <p key={slide.id} className="showcase__credit">
          Crédito: {credit}
        </p>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
