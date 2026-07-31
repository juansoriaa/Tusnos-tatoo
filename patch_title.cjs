const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

content = content.replace(
  /title: user\?\.name \? \`Obra de \$\{user\.name\}\` : 'Obra Destacada',/g,
  "title: w.title || (user?.name ? \`Obra de \${user.name}\` : 'Obra Destacada'),"
);

fs.writeFileSync('src/components/Landing.tsx', content);
