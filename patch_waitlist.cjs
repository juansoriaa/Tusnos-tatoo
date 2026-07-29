const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

code = code.replace(
    /const \[waitlistMessages, setWaitlistMessages\] = useState<any\[\]>\(\[\]\);/,
    `const [waitlistMessages, setWaitlistMessages] = useState<any[]>(() => {
        try {
            const uid = localStorage.getItem('demoUserId');
            if (uid) {
                const cacheStr = localStorage.getItem('demoWaitlist_' + uid);
                if (cacheStr) return JSON.parse(cacheStr);
            }
        } catch(e) {}
        return [];
    });`
);

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
