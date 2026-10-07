const fs = require('fs');

let file = fs.readFileSync('src/main.tsx', 'utf8');

file = file.replace(
    /if \('serviceWorker' in navigator\) \{[\s\S]*?\}\);\s*\}\);\s*\}/,
    `if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('ServiceWorker registration failed: ', error);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}`
);

fs.writeFileSync('src/main.tsx', file);
console.log('Added SW auto-reload logic');
