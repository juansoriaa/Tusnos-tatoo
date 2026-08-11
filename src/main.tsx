
window.onerror = function(message, source, lineno, colno, error) {
    console.error('GLOBAL ERROR:', message, source, lineno, colno, error);
};
window.addEventListener('unhandledrejection', function(event) {
    console.error('UNHANDLED PROMISE:', event.reason);
});
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';

const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function(key, value) {
  try {
    originalSetItem.call(this, key, value);
  } catch (e) {
    console.warn('LocalStorage quota exceeded for key:', key);
  }
};

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
  originalConsoleError('Caught by interceptor:', ...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
