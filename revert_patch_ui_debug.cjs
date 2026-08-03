const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

content = content.replace(
    /<h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold uppercase tracking-tight">Mi Perfil<\/h1>\s*\{hasUnsavedChanges && \(\s*<div style=\{\{fontSize:'10px', color:'red', wordBreak:'break-all'\}\}>\s*Initial: \{initialDataStr\}<br\/><br\/>Current: \{currentDataStr\}\s*<\/div>\s*\)\}/,
    `<h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold uppercase tracking-tight">Mi Perfil</h1>`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
console.log("Reverted UI debug successfully!");
