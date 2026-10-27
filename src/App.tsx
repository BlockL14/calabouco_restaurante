import { About } from './components/About/About';
import { Ambience } from './components/Ambience/Ambience';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { Menu } from './components/Menu/Menu';
import { Signature } from './components/Menu/Signature';
import { Visit } from './components/Visit/Visit';
import { useInitialHashScroll } from './hooks/useInitialHashScroll';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';

export default function App() {
  useRevealOnScroll();
  useInitialHashScroll();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <About />
        <Menu />
        <Signature />
        <Ambience />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
