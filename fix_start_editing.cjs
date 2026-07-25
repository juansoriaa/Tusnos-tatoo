const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

content = content.replace(
  "setDescription(photo.info || '');",
  "setDescription(photo.info || photo.alt || '');"
);

content = content.replace(
  "description: photo.info || '',",
  "description: photo.info || photo.alt || '',"
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
