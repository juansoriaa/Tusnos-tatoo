const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

content = content.replace('<div className="grid grid-cols-2 md:grid-cols-4 gap-4">', '<div className="grid grid-cols-2 md:grid-cols-5 gap-4">');

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
