const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

code = code.replace(
    /localStorage\.setItem\('demoWaitlistMessages_' \+ \(auth\.currentUser\?\.uid \|\| 'anonymous_demo'\), JSON\.stringify\(updatedMessages\)\);/,
    `const targetId = id || localStorage.getItem('demoUserId') || auth.currentUser?.uid || 'demo';
            localStorage.setItem('demoWaitlistMessages_' + targetId, JSON.stringify(updatedMessages));`
);

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
