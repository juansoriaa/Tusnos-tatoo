const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

// Replace grid container
content = content.replace(
    '<div className="grid grid-cols-1 md:grid-cols-4 gap-4">',
    '<div className="grid grid-cols-2 md:grid-cols-5 gap-4">'
);

// Quick action
content = content.replace(
    '<div className="md:col-span-1 rounded-xl bg-gradient-to-br from-primary-container to-surface-container border border-outline-variant/30 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">',
    '<div className="col-span-2 md:col-span-1 rounded-xl bg-gradient-to-br from-primary-container to-surface-container border border-outline-variant/30 p-4 md:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">'
);

// Replace "Artistas Totales" and the other 2 to have col-span-1
content = content.replace(
    '<div className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">',
    '<div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">'
);
content = content.replace(
    '<div className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">',
    '<div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">'
);
content = content.replace(
    '<div className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">',
    '<div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">'
);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
