const fs = require('fs');
let code = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

code = code.replace(/alert\("Error cr.*?tico: Intentando guardar Base64 en base de datos\. Operaci.*?n abortada\."\);/g, 'setErrorModalMsg("Error crítico: Intentando guardar Base64 en base de datos. Operación abortada.");');

fs.writeFileSync('src/components/DemoPortfolio.tsx', code, 'utf8');
console.log('done');
