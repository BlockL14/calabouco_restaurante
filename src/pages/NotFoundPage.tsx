import { ActionBar } from '../components/ActionBar/ActionBar';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { CrownMark } from '../components/Icons';
import { sectionIds } from '../content/business';
import { homeSection, routes } from '../lib/routes';
import './NotFoundPage.css';

/** Página 404 (endereço inexistente), no mesmo estilo do site. */
export function NotFoundPage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header page="notfound" />
      <main id="conteudo" tabIndex={-1}>
        <section className="not-found" aria-labelledby="erro-titulo">
          <div className="container not-found__inner">
            <CrownMark className="not-found__crown" />
            <p className="kicker">Erro 404</p>
            <h1 id="erro-titulo" className="title">
              Página não encontrada
            </h1>
            <p className="lead">O endereço pode ter mudado. O cardápio e o contato estão na página inicial.</p>
            <div className="not-found__actions">
              <a className="btn" href={homeSection(sectionIds.menu, 'notfound')}>
                Ver o cardápio
              </a>
              <a className="btn btn--ghost" href={routes.home}>
                Página inicial
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer page="notfound" />
      <ActionBar />
    </>
  );
}
