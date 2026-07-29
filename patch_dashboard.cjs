const fs = require('fs');
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

code = code.replace(
    /let data = null;\s*if \(demoUserId\) \{\s*try \{\s*const docSnap = await getDoc/,
    `let data = null;
            if (demoUserId) {
                try {
                    const cacheStr = localStorage.getItem('demoArtistData_' + demoUserId);
                    if (cacheStr) {
                        data = JSON.parse(cacheStr);
                    } else {
                        const { globalPreloadCache } = await import('../lib/cache');
                        if (globalPreloadCache[demoUserId]?.artistData) {
                            data = globalPreloadCache[demoUserId].artistData;
                        }
                    }
                    if (!data) {
                        const docSnap = await getDoc`
);
code = code.replace(
    /if \(docSnap\.exists\(\)\) \{\s*data = docSnap\.data\(\);\s*\}/,
    `if (docSnap.exists()) {
                            data = docSnap.data();
                        }
                    }`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
