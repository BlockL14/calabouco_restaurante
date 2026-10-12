import { useState } from 'react';
import { Experience } from './components/Experience/Experience';
import { Flavors } from './components/Flavors/Flavors';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { House } from './components/House/House';
import { Showcase } from './components/Showcase/Showcase';
import { Visit } from './components/Visit/Visit';
import type { MenuCategoryId } from './content/menu';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';

export default function App() {
  // A categoria do cardápio fica aqui para que as chamadas da abertura
  // (ex.: “Ver as pizzas”) possam abrir a aba correspondente.
  const [menuCategory, setMenuCategory] = useState<MenuCategoryId>('pizzas');
  useRevealOnScroll();

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Showcase onSelectCategory={setMenuCategory} />
        <Flavors category={menuCategory} onCategoryChange={setMenuCategory} />
        <Experience />
        <House />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
