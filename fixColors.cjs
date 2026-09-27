const fs = require('fs');

let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

file = file.replace(/bg-error/g, 'bg-primary');
file = file.replace(/text-error/g, 'text-primary');
file = file.replace(/border-error/g, 'border-primary');
file = file.replace(/from-error/g, 'from-primary');
file = file.replace(/to-error/g, 'to-primary');
file = file.replace(/shadow-\[0_0_40px_rgba\(255,0,0,0\.1\)\]/g, 'shadow-[0_0_40px_rgba(5,77,68,0.3)]'); // primary shadow

fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
console.log('Fixed pink modals in DemoPortfolio!');
