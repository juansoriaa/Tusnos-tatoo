const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

const oldEffect = "  useEffect(() => {\n    const loadData";
const newEffect = `  useEffect(() => {
    const preloadDemo = async () => {
        try {
            const { query, collection, where, getDocs } = await import('firebase/firestore');
            const { db } = await import('../firebase');
            const q = query(collection(db, 'users'), where('userTag', '==', '@victor_ink'));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const demoUid = snap.docs[0].id;
                const { preloadDashboardData } = await import('../lib/dashboardPreloader');
                preloadDashboardData(demoUid);
            }
        } catch(e) {}
    };
    preloadDemo();
  }, []);

  useEffect(() => {
    const loadData`;

content = content.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/Landing.tsx', content);
