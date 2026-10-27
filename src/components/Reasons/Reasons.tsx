import type { ComponentType } from 'react';
import { reasons, type ReasonIcon } from '../../content/site';
import { Arch, Crown, PizzaSlice } from '../Icons';
import './Reasons.css';

const ICONS: Record<ReasonIcon, ComponentType<{ className?: string }>> = {
  arch: Arch,
  pizza: PizzaSlice,
  crown: Crown,
};

/** Três motivos para conhecer a casa, logo abaixo da abertura. */
export function Reasons() {
  return (
    <section className="reasons" aria-label="Por que conhecer o Calabouço">
      <ul className="container reasons__list" role="list">
        {reasons.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.title} className="reasons__item" data-reveal>
              <span className="reasons__icon" aria-hidden="true">
                <Icon />
              </span>
              <div>
                <h2 className="reasons__title">{item.title}</h2>
                <p className="reasons__text">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
