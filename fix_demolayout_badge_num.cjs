const fs = require('fs');
let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

content = content.replace(/>\n\s*\+3\n/g, '>\n                                3\n');

fs.writeFileSync('src/components/DemoLayout.tsx', content);
