const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

code = code.replace(
    /const localUid = id \|\| localStorage\.getItem\('demoUserId'\);/,
    `const localUid = localStorage.getItem('demoUserId');`
);

code = code.replace(
    /const targetId = id \|\| localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid \|\| 'demo';/g,
    `const targetId = localStorage.getItem('demoUserId') || auth.currentUser?.uid || 'demo';`
);

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
