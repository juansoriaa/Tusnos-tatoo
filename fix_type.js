import fs from 'fs';
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
code = code.replace(/currentUserTag\.startsWith\('@'\)/g, "String(currentUserTag).startsWith('@')");
fs.writeFileSync('src/components/DemoLayout.tsx', code);
