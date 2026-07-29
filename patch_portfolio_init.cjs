const fs = require('fs');
let code = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

code = code.replace(
    /const \[existingPhotos, setExistingPhotos\] = useState<any\[\]>\(\[\]\);/,
    `const [existingPhotos, setExistingPhotos] = useState<any[]>(() => {
        try {
            const uid = localStorage.getItem('demoUserId');
            if (uid) {
                const cacheStr = localStorage.getItem('demoAllTattoos_' + uid);
                if (cacheStr) return JSON.parse(cacheStr);
            }
        } catch(e) {}
        return [];
    });`
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', code);
