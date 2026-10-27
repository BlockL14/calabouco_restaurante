import { signature } from '../../content/home';
import { featuredDish } from '../../content/menu';
import { menuSection } from '../../lib/routes';
import { ArrowRight } from '../Icons';
import { Picture } from '../Picture';
import { CrownIllustration } from './CrownIllustration';
import './Signature.css';

export function Signature() {
  return (
    <section className="signature" aria-labelledby="signature-title">
      <div className="signature__art" aria-hidden="true">
        <Picture image="velas" sizes="(min-width: 900px) 66vw, 100vw" alt="" className="signature__light" />
        <div className="signature__table" />
        <CrownIllustration className="signature__crown" />
      </div>

      <div className="container signature__inner">
        <div className="signature__content" data-reveal>
          <p className="eyebrow">{featuredDish.eyebrow}</p>
          <h2 id="signature-title" className="display display--xl signature__title">
            {featuredDish.name}
          </h2>
          <p className="lead">{featuredDish.description}</p>
          <a className="text-link" href={menuSection(featuredDish.id)}>
            <span className="text-link__label">{signature.link}</span>
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
