const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const oldCard = `<div className="w-full bg-surface-container-low p-6 border-2 border-primary shadow-[0_0_30px_rgba(5,77,68,0.4)] flex items-center justify-between gap-4 transition-all" style={{borderColor: '#054d44'}}>`;
const newCard = `<div className={\`w-full bg-surface-container-low p-6 border-2 flex items-center justify-between gap-4 transition-all duration-300 \${!isAvailable ? 'border-error shadow-[0_0_30px_rgba(255,180,171,0.4)] animate-pulse-ring' : 'border-primary shadow-[0_0_30px_rgba(5,77,68,0.4)]'}\`} style={{borderColor: !isAvailable ? '#ffb4ab' : '#054d44'}}>`;

content = content.replace(oldCard, newCard);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
