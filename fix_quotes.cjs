const fs = require('fs');
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

code = code.replace(/className=\{\\\`font-headline-md text-xl \\\$\{\!isAvailable \? 'text-error' : 'text-on-surface'\}\\\`\}/, "className={`font-headline-md text-xl ${!isAvailable ? 'text-error' : 'text-on-surface'}`}");

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
