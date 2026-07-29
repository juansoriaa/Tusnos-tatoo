const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /let parsed = null;\s*const demoUserId = localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid;\s*if \(demoUserId\) \{\s*try \{\s*const docSnap = await getDoc/,
    `let parsed = null;
            const demoUserId = localStorage.getItem('demoUserId') || auth.currentUser?.uid;
            if (demoUserId) {
                try {
                    let data = null;
                    const cacheStr = localStorage.getItem('demoArtistData_' + demoUserId);
                    if (cacheStr) {
                        data = JSON.parse(cacheStr);
                    }
                    if (!data) {
                        const docSnap = await getDoc`
);
code = code.replace(
    /if \(docSnap\.exists\(\)\) \{\s*const data = docSnap\.data\(\);/,
    `if (docSnap.exists()) {
                            data = docSnap.data();
                        }
                    }
                    if (data) {`
);

code = code.replace(
    /let isDemoUser = false;\s*if \(demoUserId\) \{\s*const \{ doc, getDoc \} = await import\('firebase\/firestore'\);\s*const userSnap = await getDoc/,
    `let isDemoUser = false;
                if (demoUserId) {
                    let userTag = null;
                    const cacheStr = localStorage.getItem('demoArtistData_' + demoUserId);
                    if (cacheStr) {
                        userTag = JSON.parse(cacheStr).userTag;
                    } else {
                        const { doc, getDoc } = await import('firebase/firestore');
                        const userSnap = await getDoc`
);
code = code.replace(
    /if \(userSnap\.exists\(\)\) \{\s*const tag = userSnap\.data\(\)\.userTag;/,
    `if (userSnap.exists()) {
                            userTag = userSnap.data().userTag;
                        }
                    }
                    if (userTag) {
                        const tag = userTag;`
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
