const fs = require('fs');

let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Improve error handling to hint about AdBlockers
file = file.replace(/setErrorModalMsg\(err\.message \|\| 'Error al subir la imagen\. Por favor intenta nuevamente\.'\);/g, `
let msg = err.message || 'Error al subir la imagen. Por favor intenta nuevamente.';
if (msg.includes('Failed to fetch')) {
    msg = 'Error de conexión (Failed to fetch).\\n\\nSi usas un bloqueador de anuncios (AdBlock, uBlock, Brave Shields), por favor desactívalo temporalmente, ya que suelen bloquear el servidor de imágenes.';
}
setErrorModalMsg(msg);
`);

fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
console.log('Patched DemoPortfolio!');
