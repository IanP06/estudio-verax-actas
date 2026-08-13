import { Buffer } from 'buffer';

// Polyfill Buffer globally for @react-pdf/renderer browser PNG parsing
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
