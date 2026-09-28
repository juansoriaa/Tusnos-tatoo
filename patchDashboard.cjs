const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// Fix button visibility logic
file = file.replace(/\{hasUnsavedChanges && \(/, '{(hasUnsavedChanges || isUploading) && (');

// Improve error handling to hint about AdBlockers
file = file.replace(/alert\('Error al subir la imagen a ImgBB\.'\);/g, `alert('Error de conexión al subir la imagen (Failed to fetch).\\n\\nSi usas un bloqueador de anuncios (AdBlock, uBlock, Brave Shields), por favor desactívalo temporalmente para esta página, ya que suelen bloquear las subidas de imágenes.');`);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Patched DemoDashboard!');
