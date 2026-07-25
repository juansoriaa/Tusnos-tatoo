const fs = require('fs');
let content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

content = content.replace(/style=\{\{backgroundColor: '#141313', borderColor: '#353434'\}\}/g, '');

fs.writeFileSync('src/components/DemoWaitlist.tsx', content);
