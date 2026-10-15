import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { sectionIds } from '../../content/business';
import { images, type ImageAsset } from '../../content/images';
import type { MenuCategoryId } from '../../content/menu';
import { slides, type Slide } from '../../content/slides';
import { createPictureElement, glowSrc, positionStyle, preloadImage } from '../../lib/images';
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
const CARD_RADIUS = 12;

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
  region: Box<HTMLDivElement | null>;
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

const currentScale = (el: Element | null) => {
  if (!el) return 1;
  const t = getComputedStyle(el).transform;
  return !t || t === 'none' ? 1 : new DOMMatrixReadOnly(t).a || 1;
};

/** Frações (0–1) do object-position calculado de uma imagem. */
const objectPosition = (img: HTMLImageElement) => {
  const [x = '50%', y = '50%'] = getComputedStyle(img).objectPosition.split(' ');
  return { x: parseFloat(x) / 100, y: parseFloat(y) / 100 };
};

/**
 * Região da imagem (em pixels da imagem original) visível numa caixa com
 * object-fit: cover, dado o object-position. `zoom` > 1 encolhe a região ao redor
 * do centro (zoom de hover do cartão).
 */
function visibleRegion(asset: ImageAsset, w: number, h: number, pos: { x: number; y: number }, zoom = 1) {
  const k = Math.max(w / asset.width, h / asset.height);
  const ox = (w - asset.width * k) * pos.x;
  const oy = (h - asset.height * k) * pos.y;
  const rw = w / k / zoom;
  const rh = h / k / zoom;
  const cx = -ox / k + w / k / 2;
  const cy = -oy / k + h / k / 2;
  return { x: cx - rw / 2, y: cy - rh / 2, w: rw, h: rh, k, ox, oy };
}

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
    const pending = refs.pending.current;
    refs.pending.current = null;
    if (pending !== null && pending !== refs.active.current) {
      // O foco pedido (ativação por teclado) fica para o fim da última troca.
      void run(pending);
      return;
    }
    if (refs.focusAfter.current) {
      refs.focusAfter.current = false;
      refs.slide.current?.focus({ preventScroll: true });
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
    // Começa a baixar já; a animação não espera (resposta imediata ao clique).
    const ready = preloadImage(asset, PHOTO_SIZES);

    const photo = refs.photo.current;
    const layer = refs.layer.current;
    const oldImg = refs.photoImg.current;
    const card = refs.cards.current.get(next.id) ?? null;
    const media = card?.querySelector<HTMLElement>('.sc-card__media') ?? null;
    const cardImg = media?.querySelector('img') ?? null;

    // Movimento reduzido (ou elementos indisponíveis): troca direta com leve fusão.
    if (prefersReducedMotion() || !photo || !layer || !oldImg || !card || !media || !cardImg) {
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

    const D = duration('--dur-morph', 900);
    const ease = easing('--ease-morph', 'cubic-bezier(0.72, 0, 0.18, 1)');
    const easeIn = easing('--ease-in', 'cubic-bezier(0.5, 0, 0.75, 0)');

    // Telas largas não exibem os cartões: a nova foto surge por fusão lenta sobre a atual.
    if (!card.getClientRects().length) {
      await crossfade(target, ready, { photo, layer, oldImg, easeIn });
      return;
    }

    const layerBox = layer.getBoundingClientRect();
    const from = media.getBoundingClientRect();
    const to = photo.getBoundingClientRect();

    // 1. O clone já nasce com o tamanho final do fundo (sem animar geometria: nada de
    //    mudança de layout). Uma janela (clip-path) + escala o fazem coincidir com o cartão.
    const clone = document.createElement('div');
    clone.className = 'showcase__clone';
    Object.assign(clone.style, {
      left: `${to.left - layerBox.left}px`,
      top: `${to.top - layerBox.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
    });
    // Enquanto a foto grande não chega, a imagem já decodificada do cartão serve de base.
    const placeholder = document.createElement('img');
    placeholder.className = 'obj showcase__clone-ph';
    placeholder.alt = '';
    placeholder.src = cardImg.currentSrc || cardImg.src;
    Object.entries(positionStyle(asset)).forEach(([prop, value]) => {
      if (value) placeholder.style.setProperty(prop, String(value));
    });
    clone.appendChild(placeholder);
    const { picture, img } = createPictureElement(asset, PHOTO_SIZES);
    clone.appendChild(picture);
    layer.appendChild(clone);

    // Região da imagem que o cartão mostra, levada para as coordenadas do clone.
    const cardRegion = visibleRegion(asset, from.width, from.height, objectPosition(cardImg), currentScale(cardImg));
    const big = visibleRegion(asset, to.width, to.height, objectPosition(img));
    const Lx = big.ox + cardRegion.x * big.k;
    const Ly = big.oy + cardRegion.y * big.k;
    const Lw = cardRegion.w * big.k;
    const Lh = cardRegion.h * big.k;
    const s = from.width / Lw;
    const tx = from.left - to.left - s * Lx;
    const ty = from.top - to.top - s * Ly;
    const inset = (t: number, r: number, b: number, l: number, round: number) =>
      `inset(${Math.max(0, t)}px ${Math.max(0, r)}px ${Math.max(0, b)}px ${Math.max(0, l)}px round ${round}px)`;
    card.style.visibility = 'hidden';

    // Em pé, o clone voa acima do sombreamento; leva consigo o mesmo degradê,
    // que surge durante o voo, para pousar idêntico ao fundo sem perder a leitura do texto.
    const shade = layer.parentElement?.querySelector<HTMLElement>('.showcase__shade');
    const aboveShade = !!shade && Number(getComputedStyle(layer).zIndex) > Number(getComputedStyle(shade).zIndex);
    const anims: Animation[] = [];
    if (aboveShade) {
      const cloneShade = document.createElement('div');
      cloneShade.className = 'showcase__clone-shade';
      clone.appendChild(cloneShade);
      anims.push(cloneShade.animate([{ opacity: 0 }, { opacity: 1 }], { duration: D, easing: ease, fill: 'forwards' }));
    }

    // 2. A janela se abre até cobrir todo o fundo; os cantos arredondados se desfazem.
    const morph = clone.animate(
      [
        {
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          clipPath: inset(Ly, to.width - Lx - Lw, to.height - Ly - Lh, Lx, CARD_RADIUS / s),
        },
        { transform: 'translate(0px, 0px) scale(1)', clipPath: inset(0, 0, 0, 0, 0) },
      ],
      { duration: D, easing: ease, fill: 'forwards' },
    );
    anims.push(morph);

    // 3. O fundo anterior escurece até quase o preto, cedendo espaço.
    const recede = oldImg.animate(
      [
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: 'scale(1.05)', filter: 'brightness(0.12)' },
      ],
      { duration: D * 0.8, easing: ease, fill: 'forwards' },
    );
    anims.push(recede);
    set.setGlowIndex(target);

    // Se a janela mudar de tamanho no meio do voo, encerra a animação em vez de
    // seguir para um retângulo desatualizado; o pouso usa o layout novo.
    const onResize = () => anims.forEach((a) => a.finish());
    window.addEventListener('resize', onResize);

    // 4. O texto atual sai para cima.
    const out = textOut(easeIn);

    // 5. Novo texto, nova ordem dos cartões e nova numeração durante o voo do clone.
    //    Quando o cartão está abaixo do fundo (celular), espera o clone passar pelo texto.
    const fromBelow = from.top > to.bottom - 8;
    await wait(fromBelow ? D * 0.55 : Math.max(out + 80, D * 0.42));
    commit(target);

    await morph.finished.catch(() => undefined);
    window.removeEventListener('resize', onResize);

    // 6. Pouso: com a foto pronta, o fundo assume o novo destaque por baixo do clone.
    await ready;
    recede.cancel();
    set.setPhotoIndex(target);
    await nextFrame();
    await refs.photoImg.current?.decode().catch(() => undefined);
    await nextFrame();
    clone.remove();
    card.style.visibility = '';
    finish();
  }

  /** O texto atual sai para cima (comum às duas transições). */
  const textOut = (easeIn: string) => {
    const D = duration('--dur-text-out', 220);
    refs.slide.current?.querySelectorAll('[data-anim]').forEach((el, i) => {
      el.animate(
        [
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: 'translate3d(0, -14px, 0)' },
        ],
        { duration: D, delay: i * 30, easing: easeIn, fill: 'forwards' },
      );
    });
    return D;
  };

  /**
   * Transição sem cartões: a nova foto aparece por cima da atual numa fusão longa, com
   * um leve assentamento de escala; a luz da parede muda junto. O clone usa a mesma
   * máscara da foto, então a borda continua se dissolvendo na parede durante a fusão.
   */
  async function crossfade(
    target: number,
    ready: Promise<unknown>,
    el: { photo: HTMLElement; layer: HTMLElement; oldImg: HTMLImageElement; easeIn: string },
  ) {
    const D = duration('--dur-fade', 1400);
    const ease = easing('--ease-in-out', 'cubic-bezier(0.65, 0, 0.35, 1)');
    const out = textOut(el.easeIn);
    set.setGlowIndex(target);
    await ready;

    const layerBox = el.layer.getBoundingClientRect();
    const to = el.photo.getBoundingClientRect();
    const clone = document.createElement('div');
    clone.className = 'showcase__clone';
    Object.assign(clone.style, {
      left: `${to.left - layerBox.left}px`,
      top: `${to.top - layerBox.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
    });
    const { picture, img } = createPictureElement(images[slides[target].image], PHOTO_SIZES);
    clone.appendChild(picture);
    el.layer.appendChild(clone);
    await img.decode().catch(() => undefined);

    const anims = [
      clone.animate(
        [
          { opacity: 0, transform: 'scale(1.06)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: D, easing: ease, fill: 'forwards' },
      ),
      el.oldImg.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(0.55)' }], {
        duration: D,
        easing: ease,
        fill: 'forwards',
      }),
    ];
    const onResize = () => anims.forEach((a) => a.finish());
    window.addEventListener('resize', onResize);

    await wait(Math.max(out + 80, D * 0.3));
    commit(target);
    await anims[0].finished.catch(() => undefined);
    window.removeEventListener('resize', onResize);

    anims[1].cancel();
    set.setPhotoIndex(target);
    await nextFrame();
    await refs.photoImg.current?.decode().catch(() => undefined);
    await nextFrame();
    clone.remove();
    finish();
  }

  const go = (index: number, opts: { focus?: boolean } = {}) => {
    const target = wrap(index);
    if (opts.focus) {
      // O cartão ativado vai sair da fileira: o foco fica na região até a troca terminar.
      refs.focusAfter.current = true;
      refs.region.current?.focus({ preventScroll: true });
    }
    if (refs.busy.current) {
      refs.pending.current = target;
      return;
    }
    if (target === refs.active.current) {
      if (opts.focus) {
        refs.focusAfter.current = false;
        refs.slide.current?.focus({ preventScroll: true });
      }
      return;
    }
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
    region: useRef<HTMLDivElement | null>(null),
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
  const prevBtn = useRef<HTMLButtonElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);

  const slide = slides[active];
  const order = Array.from({ length: total - 1 }, (_, k) => wrap(active + 1 + k));
  const credit = images[slide.image].credit;

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

  // Setas do teclado: o foco vai para a seta correspondente antes da troca, porque o
  // link da chamada e os cartões são recriados/reordenados e perderiam o foco.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    (dir === 1 ? nextBtn : prevBtn).current?.focus({ preventScroll: true });
    controller.step(dir);
  };

  // Gesto horizontal em telas de toque (inclusive sobre os cartões);
  // `touch-action: pan-y pinch-zoom` preserva a rolagem vertical e o zoom.
  // Se o gesto vira troca de destaque, o clique que viria em seguida é descartado.
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

      {/* Fundo: parede (telas largas) e luz ambiente (foto desfocada), fotografia, clone em voo e sombreamento */}
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
      {/* Artes com texto próprio (cartazes): faixa escura atrás dos cartões e controles */}
      <div
        className={`showcase__veil${slides[glowIndex].tone === 'poster' ? ' is-on' : ''}`}
        aria-hidden="true"
      />

      <div
        ref={refs.region}
        className="showcase__inner"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Destaques do Calabouço"
        tabIndex={-1}
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
            ref={prevBtn}
            type="button"
            className="icon-btn sc-arrow"
            onClick={() => controller.step(-1)}
            onPointerEnter={() => prefetch(wrap(active - 1))}
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
