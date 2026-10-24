import { business, sectionIds } from '../../content/business';
import { hero } from '../../content/home';
import { ArrowRight } from '../Icons';
import { Picture } from '../Picture';
import './Hero.css';

/** Mesmo `sizes` do pré-carregamento em index.html. */
export const HERO_SIZES = '(min-width: 900px) 62vw, 100vw';

export function Hero() {
  return (
    <section id={sectionIds.top} className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero__media">
        <Picture image={hero.image} sizes={HERO_SIZES} priority imgClassName="hero__img" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow eyebrow--plain">{hero.eyebrow}</p>
          <h1 id="hero-title" className="display hero__title">
            <span className="sr-only">{business.legalName}: </span>
            {hero.title.map((line) => (
              <span key={line} className="display__line">
                {line}
              </span>
            ))}
          </h1>
          <p className="lead">{hero.text}</p>
          <div className="hero__actions">
            <a className="btn" href={`#${sectionIds.menu}`}>
              {hero.primary}
            </a>
            <a className="text-link" href={`#${sectionIds.ambience}`}>
              <span className="text-link__label">{hero.secondary}</span>
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
