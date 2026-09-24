const fs = require('fs');
let code = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

code = code.replace(/Tu sesi\ufffdn ha expirado\. Por favor, cierra sesi\ufffdn y vuelve a entrar para subir fotos\./g, 'Tu sesión ha expirado. Por favor, cierra sesión y vuelve a entrar para subir fotos.');
code = code.replace(/Error al subir la imagen\. Por favor verifica tu conexi\ufffdn y sesi\ufffdn\./g, 'Error al subir la imagen. Por favor verifica tu conexión y sesión.');
code = code.replace(/sesi\ufffdn ha expirado/g, 'sesión ha expirado');
code = code.replace(/l\ufffdmite/g, 'límite');
code = code.replace(/m\ufffdximo/g, 'máximo');
code = code.replace(/categor\ufffda/g, 'categoría');
code = code.replace(/Categor\ufffdas/g, 'Categorías');
code = code.replace(/Categor\ufffda/g, 'Categoría');
code = code.replace(/galer\ufffda/g, 'galería');
code = code.replace(/p\ufffdblico/g, 'público');
code = code.replace(/est\ufffd asignado/g, 'está asignado');
code = code.replace(/m\ufffds fotos/g, 'más fotos');
code = code.replace(/tambi\ufffdn/g, 'también');
code = code.replace(/remover\ufffd/g, 'removerá');
code = code.replace(/S\ufffd,/g, 'Sí,');
code = code.replace(/\ufffdEliminar/g, '¿Eliminar');

fs.writeFileSync('src/components/DemoPortfolio.tsx', code, 'utf8');
console.log('done');
