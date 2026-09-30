const fs = require('fs');

let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// The issue in DemoPortfolio is missing `let` declarations because my regex removed them.
// Let's add them back right before the try block in the `else` (new upload) section.
file = file.replace(/const demoUserId = localStorage\.getItem\('demoUserId'\);\s*const isRealUser = demoUserId && demoUserId !== 'demo';\s*try \{/g, `
let photoDataUrl = '';
let previewDataUrl = '';
let thumbDataUrl = '';
const demoUserId = localStorage.getItem('demoUserId');
const isRealUser = demoUserId && demoUserId !== 'demo';
try {`);

fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
console.log('Fixed let declarations in DemoPortfolio!');
