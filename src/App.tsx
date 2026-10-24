import { useState } from 'react';
import { About } from './components/About/About';
import { Ambience } from './components/Ambience/Ambience';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { Menu } from './components/Menu/Menu';
import { Signature } from './components/Menu/Signature';
import { Visit } from './components/Visit/Visit';
import type { MenuCategoryId } from './content/menu';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';

export default function App() {
  // A categoria do cardápio fica aqui para que outras seções (ex.: a Coroa Real)
  // possam abrir a aba correspondente.
  const [menuCategory, setMenuCategory] = useState<MenuCategoryId>('pizzas');
  useRevealOnScroll();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <About />
        <Menu category={menuCategory} onCategoryChange={setMenuCategory} />
        <Signature onSelectCategory={setMenuCategory} />
        <Ambience />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
