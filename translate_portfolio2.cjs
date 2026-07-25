const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

content = content.replace('Minimal Editing', 'Edición Mínima');
content = content.replace('Filter:', 'Filtrar:');
// check for more
fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
