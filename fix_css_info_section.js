import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(
  'border-radius: 0 8px 8px 0;',
  'border-radius: 0 8px 8px 0; padding: 2rem;'
);

fs.writeFileSync('src/index.css', code);
