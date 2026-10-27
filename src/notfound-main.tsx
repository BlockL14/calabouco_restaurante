import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './setup';
import { NotFoundPage } from './pages/NotFoundPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotFoundPage />
  </StrictMode>,
);
