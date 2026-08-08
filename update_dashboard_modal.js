import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

code = code.replace(/onClick=\{\(\) => \{ setTheme\('default'\); handleSave\(\); \}\}/g, "onClick={() => { setTheme('default'); }}");
code = code.replace(/onClick=\{\(\) => \{ setTheme\('pink_neon'\); handleSave\(\); \}\}/g, "onClick={() => { setTheme('pink_neon'); }}");
code = code.replace(/faqs: faqs\n/g, "faqs: faqs,\ntheme: theme\n");

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
