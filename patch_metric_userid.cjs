const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /const demoUserId = auth\.currentUser\?\.uid;/g,
    "const demoUserId = localStorage.getItem('demoUserId') || auth.currentUser?.uid;"
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
