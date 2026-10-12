import type { CSSProperties } from 'react';
import { business, sectionIds } from '../../content/business';
import { Picture } from '../Picture';
import './House.css';

const facts = [
  { term: 'Formato', value: 'Restaurante e pizzaria à la carte' },
  { term: 'Bairro', value: `${business.address.district}, ${business.address.city}` },
  { term: 'À mesa', value: 'Pizzas, massas e vinhos' },
];

export function House() {
  return (
    <section id={sectionIds.house} className="section house" aria-labelledby="house-title" tabIndex={-1}>
      <div className="container house__grid">
        <div className="house__year numeral" aria-hidden="true">
          {business.since}
        </div>

        <div className="house__media" data-reveal>
          <div className="house__facade">
            <Picture image="arte-fachada" sizes="(min-width: 1024px) 460px, (min-width: 700px) 46vw, 80vw" />
          </div>
          <div className="house__art" data-reveal style={{ '--reveal-delay': '160ms' } as CSSProperties}>
            <Picture image="arte-pizza" sizes="(min-width: 1024px) 220px, 34vw" />
          </div>
        </div>

        <div className="house__copy" data-reveal style={{ '--reveal-delay': '80ms' } as CSSProperties}>
          <p className="eyebrow">A casa</p>
          <h2 id="house-title" className="display">
            Calabouço. <em>Desde {business.since}.</em>
          </h2>
          <p className="lead">
            No Centro Cívico de Curitiba, o Calabouço reúne pizzas, massas e vinhos em um ambiente de inspiração
            medieval.
          </p>
          <dl className="house__facts">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
