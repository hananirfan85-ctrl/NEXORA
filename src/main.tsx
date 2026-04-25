import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatically register the service worker
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });

// Auto-reload the page if a new deployment removed old JS chunks
window.addEventListener('vite:preloadError', (event) => {
  console.log('Detected outdated assets, reloading the page...');
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
