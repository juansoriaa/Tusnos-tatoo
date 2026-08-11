import fs from 'fs';
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
code = code.replace(/const uTag = docSnap\.data\(\)\.userTag \|\| '';/g, "const uTag = String(docSnap.data().userTag || '');");
fs.writeFileSync('src/components/DemoLayout.tsx', code);
