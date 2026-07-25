const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldPinIcon = `className={\`absolute top-1 left-1 bg-surface-elevation/80 backdrop-blur-sm border border-border-muted rounded-full w-6 h-6 flex items-center justify-center hover:border-emerald-accent z-20 transition-colors \${photo.pinnedOrder ? 'text-emerald-accent border-emerald-accent' : 'text-silver-text opacity-0 group-hover:opacity-100'}\`}`;

const newPinIcon = `className={\`absolute top-1 left-1 bg-surface-elevation/80 backdrop-blur-sm border border-border-muted rounded-full w-6 h-6 flex items-center justify-center hover:border-emerald-accent z-20 transition-all duration-300 \${photo.pinnedOrder ? 'text-emerald-accent border-emerald-accent opacity-100' : 'text-silver-text opacity-100 md:opacity-60 group-hover:opacity-100'}\`}`;

content = content.replace(oldPinIcon, newPinIcon);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
