import { sectionIds } from '../../content/business';
import { images } from '../../content/images';
import { ambience } from '../../content/site';
import { Picture } from '../Picture';
import './Ambience.css';

/** O salão: faixa escura com fotos reais da casa. */
export function Ambience() {
  return (
    <section id={sectionIds.ambience} className="ambience section" aria-labelledby="ambience-title" tabIndex={-1}>
      <div className="container ambience__grid">
        <div className="ambience__text" data-reveal>
          <p className="kicker">{ambience.kicker}</p>
          <h2 id="ambience-title" className="title">
            {ambience.title}
          </h2>
          <p className="lead">{ambience.text}</p>
        </div>

        <ul className="ambience__photos" role="list">
          {ambience.photos.map((photo, i) => {
            const credit = images[photo.image].credit;
            return (
              <li key={photo.image} className={`ambience__photo ambience__photo--${i + 1}`} data-reveal>
                <figure>
                  <Picture image={photo.image} sizes="(min-width: 900px) 26vw, 50vw" />
                  <figcaption>
                    {photo.caption}
                    {credit && <span className="ambience__credit"> · Foto: {credit}</span>}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
