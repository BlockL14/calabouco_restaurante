import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
// Cinzel (títulos), Grenze Gotisch (destaques) e UnifrakturCook (só o nome, como no letreiro)
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
