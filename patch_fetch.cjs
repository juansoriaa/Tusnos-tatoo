const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

const oldFetch = `        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const works = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));`;
          
const newFetch = `        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          // Filter to ensure photos have a valid URL and are not empty
          const works = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                                     .filter(w => (w.url && w.url.length > 10) || (w.src && w.src.length > 10));`;

content = content.replace(oldFetch, newFetch);

const oldMap = `                  return {
                      ...w,
                      src: w.url,`;
                      
const newMap = `                  return {
                      ...w,
                      src: w.url || w.src || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ',`;

content = content.replace(oldMap, newMap);

fs.writeFileSync('src/components/Landing.tsx', content);
