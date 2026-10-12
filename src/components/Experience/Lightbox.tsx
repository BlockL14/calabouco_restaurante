import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import type { GalleryItem } from '../../content/gallery';
import { images } from '../../content/images';
import { ArrowLeft, ArrowRight, Close } from '../Icons';
import { Picture } from '../Picture';

type LightboxProps = {
  items: GalleryItem[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
};

/**
 * Visualização ampliada em <dialog> modal: o navegador contém o foco e torna o
 * restante da página inerte. Esc fecha; setas e gesto lateral navegam.
 * O foco volta ao elemento de origem (tratado em Experience).
 */
export function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const open = index !== null;
  const total = items.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('menu-open');
      closeRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.classList.remove('menu-open');
      onClose();
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const go = (dir: 1 | -1) => {
    if (index === null) return;
    onChange((index + dir + total) % total);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1);
  };

  const item = index !== null ? items[index] : null;
  const asset = item ? images[item.image] : null;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Galeria ampliada"
      onKeyDown={onKeyDown}
      onClick={(e) => {
        // Clique no fundo escuro (fora da imagem e dos controles) fecha.
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
    >
      {item && asset && (
        <div className="lightbox__inner">
          <div className="lightbox__bar">
            <p className="lightbox__count" aria-live="polite">
              <span className="numeral">{String((index ?? 0) + 1).padStart(2, '0')}</span>
              <span> / {String(total).padStart(2, '0')}</span>
              <span className="sr-only">: {item.caption}</span>
            </p>
            <button ref={closeRef} type="button" className="icon-btn lightbox__close" onClick={() => dialogRef.current?.close()}>
              <Close />
              <span className="sr-only">Fechar</span>
            </button>
          </div>

          <figure className="lightbox__figure" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <div className="lightbox__media" key={item.id}>
              <Picture
                image={item.image}
                sizes="(min-width: 1024px) 70vw, 100vw"
                priority
                imgClassName="lightbox__img"
              />
            </div>
            <figcaption>
              {item.caption}
              {asset.credit && <span className="experience__credit">Crédito: {asset.credit}</span>}
            </figcaption>
          </figure>

          <div className="lightbox__nav">
            <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Imagem anterior">
              <ArrowLeft />
            </button>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Próxima imagem">
              <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
