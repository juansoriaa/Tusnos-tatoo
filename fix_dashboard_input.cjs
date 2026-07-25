const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');
content = content.replace(/onClick=\{\(e\) => e\.preventDefault\(\)\}/g, 'onClick={(e) => e.stopPropagation()}');
fs.writeFileSync('src/components/DemoDashboard.tsx', content);
