const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(
    /setShowSettingsModal\(true\)/g,
    'setIsConfigModalOpen(true)'
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
