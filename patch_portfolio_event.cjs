const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

content = content.replace(/localStorage\.setItem\('photoStats', JSON\.stringify\(stats\)\);/, "localStorage.setItem('photoStats', JSON.stringify(stats));\n            window.dispatchEvent(new Event('photoStatsUpdated'));");

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
