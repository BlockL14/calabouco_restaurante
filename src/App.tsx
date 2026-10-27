import { ActionBar } from './components/ActionBar/ActionBar';
import { Ambience } from './components/Ambience/Ambience';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { HERO_ACTIONS_ID, Hero } from './components/Hero/Hero';
import { Menu } from './components/Menu/Menu';
import { Reasons } from './components/Reasons/Reasons';
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
        <Reasons />
        <Menu />
        <Ambience />
        <Visit />
      </main>
      <Footer />
      <ActionBar after={HERO_ACTIONS_ID} />
    </>
  );
}
