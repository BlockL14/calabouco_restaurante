import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './setup';
import { MenuPage } from './pages/MenuPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MenuPage />
  </StrictMode>,
);
