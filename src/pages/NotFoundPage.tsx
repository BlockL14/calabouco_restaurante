import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { ArrowRight, CrownMark } from '../components/Icons';
import { routes } from '../lib/routes';
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
        <section id="topo" className="not-found" aria-labelledby="erro-titulo">
          <div className="container not-found__inner">
            <CrownMark className="not-found__crown" />
            <p className="eyebrow eyebrow--center">Erro 404</p>
            <h1 id="erro-titulo" className="display display--xl">
              Página não encontrada
            </h1>
            <p className="lead">O endereço pode ter mudado ou não existir mais. Volte ao início ou veja o cardápio.</p>
            <div className="not-found__actions">
              <a className="btn" href={routes.home}>
                Voltar ao início
              </a>
              <a className="text-link" href={routes.menu}>
                <span className="text-link__label">Ver o cardápio</span>
                <ArrowRight />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer page="notfound" />
    </>
  );
}
