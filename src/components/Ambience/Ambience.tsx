import { useRef, useState } from 'react';
import { sectionIds } from '../../content/business';
import { gallery } from '../../content/gallery';
import { ambience } from '../../content/home';
import { images } from '../../content/images';
import { ArrowRight } from '../Icons';
import { Picture } from '../Picture';
import { Split } from '../Split/Split';
import { Lightbox } from './Lightbox';
import './Ambience.css';
import { DisplayLines } from '../DisplayLines';

export function Ambience() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // O botão que abriu a galeria recebe o foco de volta ao fechar.
  const trigger = useRef<HTMLButtonElement>(null);
  const credit = images[ambience.image].credit;

  return (
    <>
      <Split
        id={sectionIds.ambience}
        labelledBy="ambience-title"
        side="left"
        className="ambience"
        media={<Picture image={ambience.image} sizes="(min-width: 900px) 50vw, 100vw" />}
        caption={credit && `Foto: ${credit}`}
      >
        <p className="eyebrow">{ambience.eyebrow}</p>
        <h2 id="ambience-title" className="display display--sm">
          <DisplayLines lines={ambience.title} />
        </h2>
        <p className="lead">{ambience.text}</p>
        <button ref={trigger} type="button" className="text-link" aria-haspopup="dialog" onClick={() => setOpenIndex(0)}>
          <span className="text-link__label">{ambience.link}</span>
          <ArrowRight />
          <span className="sr-only"> (abre a galeria de fotos)</span>
        </button>
      </Split>

      <Lightbox
        items={gallery}
        index={openIndex}
        onChange={setOpenIndex}
        onClose={() => {
          setOpenIndex(null);
          trigger.current?.focus();
        }}
      />
    </>
  );
}
