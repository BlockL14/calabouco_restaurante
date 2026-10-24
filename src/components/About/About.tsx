import type { ComponentType, CSSProperties } from 'react';
import { sectionIds } from '../../content/business';
import { about, features, type FeatureIcon } from '../../content/home';
import { ArrowRight, Book, Candle, Crown, Octagon, PizzaSlice } from '../Icons';
import { Picture } from '../Picture';
import { Split } from '../Split/Split';
import './About.css';

const ICONS: Record<FeatureIcon, ComponentType<{ className?: string }>> = {
  crown: Crown,
  pizza: PizzaSlice,
  candle: Candle,
  scroll: Book,
};

export function About() {
  return (
    <>
      <Split
        id={sectionIds.about}
        labelledBy="about-title"
        side="left"
        className="about"
        media={<Picture image={about.image} sizes="(min-width: 900px) 50vw, 100vw" />}
      >
        <p className="eyebrow">{about.eyebrow}</p>
        <h2 id="about-title" className="display">
          {about.title.map((line) => (
            <span key={line} className="display__line">
              {line}
            </span>
          ))}
        </h2>
        <p className="lead">{about.text}</p>
        <a className="text-link" href={`#${sectionIds.visit}`}>
          <span className="text-link__label">{about.link}</span>
          <ArrowRight />
        </a>
      </Split>

      <section className="features" aria-label="O que você encontra no Calabouço">
        <ul className="container features__list" role="list">
          {features.map((item, index) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.title} className="features__item" data-reveal style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}>
                <span className="features__badge" aria-hidden="true">
                  <Octagon className="features__frame" />
                  <Icon className="features__icon" />
                </span>
                <h3 className="features__title">{item.title}</h3>
                <p className="features__text">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
