import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
// Telas largas: Cinzel (títulos), Grenze Gotisch (destaques) e UnifrakturCook (só o nome,
// como no letreiro). As fontes só são baixadas onde são usadas: o celular continua
// carregando apenas Inter e Cormorant.
import '@fontsource-variable/cinzel/wght.css';
import '@fontsource/grenze-gotisch/700.css';
import '@fontsource/unifrakturcook/700.css';
import './styles/tokens.css';
import './styles/base.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
