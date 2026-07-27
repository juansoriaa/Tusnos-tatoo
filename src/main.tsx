import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const originalConsoleError = console.error;
console.error = (...args) => {
  if (args.some(arg => typeof arg === 'string' && arg.includes('client is offline'))) {
    return;
  }
  if (args.some(arg => arg instanceof Error && arg.message.includes('client is offline'))) {
    return;
  }
  if (args.some(arg => arg && arg.code === 'unavailable')) {
    return;
  }
  originalConsoleError(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
