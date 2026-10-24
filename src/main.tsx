import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Cinzel (títulos) e Poppins (texto), só o necessário: o navegador baixa apenas o que usa
import '@fontsource-variable/cinzel/wght.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import './styles/tokens.css';
import './styles/base.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
