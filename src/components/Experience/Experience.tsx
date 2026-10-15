import { useRef, useState, type CSSProperties } from 'react';
import { sectionIds } from '../../content/business';
import { gallery } from '../../content/gallery';
import { images } from '../../content/images';
import { Expand } from '../Icons';
import { Picture } from '../Picture';
import { Lightbox } from './Lightbox';
import './Experience.css';

const SIZES: Record<string, string> = {
  main: '(min-width: 1024px) 560px, (min-width: 700px) 56vw, 92vw',
  tall: '(min-width: 1024px) 260px, (min-width: 700px) 30vw, 44vw',
  wide: '(min-width: 1024px) 520px, (min-width: 700px) 40vw, 92vw',
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  // Imagem que abriu a visualização: recebe o foco de volta ao fechar.
  const origin = useRef<number | null>(null);

  return (
    <section id={sectionIds.experience} className="section experience" aria-labelledby="experience-title" tabIndex={-1}>
      <div className="container experience__grid">
        <div className="experience__intro" data-reveal>
          <p className="eyebrow">A experiência</p>
          <h2 id="experience-title" className="display">
            Entre. <em>A noite muda aqui.</em>
          </h2>
          <p className="lead">Arcos de tijolos, luz de velas e uma atmosfera medieval para acompanhar o jantar.</p>
          <ul className="experience__notes" role="list" aria-label="Elementos do ambiente">
            <li>Arcos de tijolos</li>
            <li>Luz de velas</li>
            <li>Inspiração medieval</li>
          </ul>
        </div>

        {gallery.map((item, index) => {
          const asset = images[item.image];
          return (
            <figure
              key={item.id}
              className={`experience__item experience__item--${item.layout}`}
              data-reveal
              style={{ '--reveal-delay': `${index * 110}ms` } as CSSProperties}
            >
              <button
                type="button"
                ref={(el) => {
                  triggers.current[index] = el;
                }}
                className="experience__open"
                onClick={() => {
                  origin.current = index;
                  setOpenIndex(index);
                }}
                aria-label={`Ampliar imagem: ${item.caption}`}
              >
                <Picture image={item.image} sizes={SIZES[item.layout]} className="feather" />
                <span className="experience__zoom" aria-hidden="true">
                  <Expand />
                </span>
              </button>
              <figcaption>
                <span className="numeral" aria-hidden="true">
                  {ROMAN[index]}
                </span>
                <span>{item.caption}</span>
                {asset.credit && <span className="experience__credit">Crédito: {asset.credit}</span>}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <Lightbox
        items={gallery}
        index={openIndex}
        onChange={setOpenIndex}
        onClose={() => {
          setOpenIndex(null);
          if (origin.current !== null) triggers.current[origin.current]?.focus();
          origin.current = null;
        }}
      />
    </section>
  );
}
