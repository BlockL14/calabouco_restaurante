import type { ReactNode } from 'react';
import './Split.css';

type SplitProps = {
  id?: string;
  /** id do título da seção (aria-labelledby). */
  labelledBy: string;
  /** Lado da imagem em telas largas. No celular, a imagem vem sempre antes do texto. */
  side: 'left' | 'right';
  media: ReactNode;
  /** Legenda discreta sobre a imagem (ex.: crédito do fotógrafo). */
  caption?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Seção em duas metades, como na interface aprovada: a imagem sangra até a borda da
 * tela e se dissolve no fundo escuro em direção ao texto (máscara), sem moldura.
 */
export function Split({ id, labelledBy, side, media, caption, className, children }: SplitProps) {
  return (
    <section
      id={id}
      className={['split', `split--media-${side}`, className].filter(Boolean).join(' ')}
      aria-labelledby={labelledBy}
      tabIndex={id ? -1 : undefined}
    >
      <div className="split__media">
        {media}
        {caption && <p className="split__caption">{caption}</p>}
      </div>
      <div className="container split__inner">
        <div className="split__content" data-reveal>
          {children}
        </div>
      </div>
    </section>
  );
}
