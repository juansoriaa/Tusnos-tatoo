const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf-8');

content = content.replace(
    /const uid = \(localStorage.getItem\('demoUserId'\) \|\| auth.currentUser\?.uid\) \|\| 'anonymous_demo';\s*const timestamp = Date.now\(\);/m,
    `if (!auth.currentUser) throw new Error('Not authenticated, falling back to base64');
                        const uid = auth.currentUser.uid;
                        const timestamp = Date.now();`
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
console.log("Patched authentication requirement for storage upload.");
