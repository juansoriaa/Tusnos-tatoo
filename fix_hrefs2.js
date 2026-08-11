import fs from 'fs';

let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
code = code.replace(/href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); handleNav\('\/'\); \}\}/g, "href=\"/\" onClick={(e) => { e.preventDefault(); handleNav('/'); }}");
fs.writeFileSync('src/components/DemoLayout.tsx', code);
