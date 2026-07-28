const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /className="bg-surface-elevation border border-border-muted w-full max-w-md max-h-\[85vh\] flex flex-col relative"/g,
    'className="bg-surface-elevation border border-border-muted w-full max-w-md max-h-[85vh] flex flex-col relative overflow-hidden"'
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
