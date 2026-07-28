const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(
    /<button className="w-full bg-emerald-accent text-on-surface py-2\.5 rounded mb-8 font-label-md hover:brightness-110 transition-all duration-200" style=\{\{backgroundColor: '#054d44', color: '#e5e2e1'\}\}>\s*Nuevo Turno\s*<\/button>/,
    ``
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
