const fs = require('fs');
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

code = code.replace(/tama\ufffdo m\u01edximo/g, 'tamaño máximo');
code = code.replace(/M\u01edx:/g, 'Máx:');

fs.writeFileSync('src/components/DemoDashboard.tsx', code, 'utf8');
console.log('done');
