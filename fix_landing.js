import fs from 'fs';
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const targetFetch = `    const fetchDirectoryWorks = async () => {
      try {
        const q = query(
            collection(db, 'photos'),
            orderBy('createdAt', 'desc'),
            limit(12)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          // Filter to ensure photos have a valid URL and are not empty
          const works = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any))
                                     .filter(w => (w.url && w.url.length > 10) || (w.src && w.src.length > 10));
          // Now fetch user details for these works`;

const replaceFetch = `    const fetchDirectoryWorks = async () => {
      try {
        let snapshot;
        try {
            const q = query(
                collection(db, 'photos'),
                orderBy('createdAt', 'desc'),
                limit(12)
            );
            snapshot = await getDocs(q);
        } catch (idxErr) {
            console.warn("Index missing, falling back to local sort", idxErr);
            const fallbackQ = query(collection(db, 'photos'));
            snapshot = await getDocs(fallbackQ);
        }
        
        if (!snapshot.empty) {
          // Filter to ensure photos have a valid URL and are not empty
          let works = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any))
                                     .filter(w => (w.url && w.url.length > 10) || (w.src && w.src.length > 10) || (w.imageUrl && w.imageUrl.length > 10));
          
          // Local sort if we didn't use the ordered query (i.e. size is likely > 12 if no limit was applied)
          if (works.length > 12) {
              works.sort((a, b) => {
                  const timeA = a.createdAt?.toMillis?.() || a.createdAt || 0;
                  const timeB = b.createdAt?.toMillis?.() || b.createdAt || 0;
                  return timeB - timeA;
              });
              works = works.slice(0, 12);
          }
          
          // Now fetch user details for these works`;

code = code.replace(targetFetch, replaceFetch);
fs.writeFileSync('src/components/Landing.tsx', code);
