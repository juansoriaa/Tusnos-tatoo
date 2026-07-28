const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /const q = demoUserId\s*\?\s*query\(collection\(db, 'photos'\), where\('createdBy', '==', demoUserId\)\)\s*:\s*query\(collection\(db, 'photos'\), orderBy\('createdAt', 'desc'\)\);/,
    `if (!demoUserId) { setTopPhotos([]); return; }
                const q = query(collection(db, 'photos'), where('createdBy', '==', demoUserId));`
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
