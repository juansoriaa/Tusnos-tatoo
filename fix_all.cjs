const fs = require('fs');

// 1. Fix DemoMetrics.tsx (chart-data-path relative and remove fixed)
let metrics = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');
metrics = metrics.replace('className="chart-data-path"', 'className="chart-data-path relative w-full h-full"');
metrics = metrics.replace('<div className="absolute" style={{left: \'60%\', top: \'15%\', transform: \'translate(-50%, -100%)\'}}>', '<div className="absolute z-10" style={{left: \'60%\', top: \'15%\', transform: \'translate(-50%, -100%)\'}}>');
fs.writeFileSync('src/components/DemoMetrics.tsx', metrics);

// 2. Fix DemoWaitlist.tsx (Restore article classes)
let waitlist = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');
// The user says message containers lost their design. Maybe they used to be glass-panel or neon-border? 
// Let's add them to make them look like what the user might have expected if it "lost" it. 
// "el apartado agenda los contenedores de mensajes se perdió el diseño que tenían originalmente"
// I will add 'glass-panel' and 'neon-border' to them, or just replace bg-surface-elevation with them.
waitlist = waitlist.replace(/className="bg-surface-elevation border border-border-muted p-4 md:p-6 cursor-pointer hover:border-emerald-accent transition-all duration-300 group"/g, 'className="glass-panel p-4 md:p-6 cursor-pointer hover:border-emerald-accent transition-all duration-300 group neon-border"');
waitlist = waitlist.replace(/className="bg-surface-elevation border border-border-muted p-4 md:p-6 cursor-pointer hover:border-emerald-accent transition-all duration-300 group opacity-75"/g, 'className="glass-panel p-4 md:p-6 cursor-pointer hover:border-emerald-accent transition-all duration-300 group neon-border opacity-75"');
fs.writeFileSync('src/components/DemoWaitlist.tsx', waitlist);

