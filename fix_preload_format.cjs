const fs = require('fs');
let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const target = `        const snapshot = await getDocs(q);
        const allPhotos = snapshot.docs.map(doc => doc.data());
        localStorage.setItem('demoAllTattoos_' + (id || 'demo'), JSON.stringify(allPhotos));
        
        allPhotos.sort((a, b) => {
           const aPinned = a.pinned === true;
           const bPinned = b.pinned === true;
           if (aPinned && bPinned) return (a.pinnedOrder || 0) - (b.pinnedOrder || 0);
           if (aPinned) return -1;
           if (bPinned) return 1;
           return 0;
        });
        const urlsToPreload = allPhotos.map(data => data.thumbnailUrl || data.url).filter(url => url);
        
        // Grab top 3 pinned/recent for background
        let top3 = allPhotos.slice(0, 3).map(data => data.thumbnailUrl || data.url).filter(url => url);`;

const replacement = `        const snapshot = await getDocs(q);
        const allPhotos = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                src: data.url,
                thumbnailUrl: data.thumbnailUrl,
                alt: data.info || data.title,
                title: data.title,
                categories: data.tags || [],
                filters: data.filters,
                hours: data.hours,
                sessions: data.sessions,
                size: data.size,
                pinnedOrder: data.pinnedOrder,
                pinned: data.pinned,
                originalFallbackId: data.originalFallbackId
            };
        });
        localStorage.setItem('demoAllTattoos_' + (id || 'demo'), JSON.stringify(allPhotos));
        
        allPhotos.sort((a, b) => {
           const aPinned = a.pinned === true;
           const bPinned = b.pinned === true;
           if (aPinned && bPinned) return (a.pinnedOrder || 0) - (b.pinnedOrder || 0);
           if (aPinned) return -1;
           if (bPinned) return 1;
           return 0;
        });
        const urlsToPreload = allPhotos.map(data => data.thumbnailUrl || data.src).filter(url => url);
        
        // Grab top 3 pinned/recent for background
        let top3 = allPhotos.slice(0, 3).map(data => data.thumbnailUrl || data.src).filter(url => url);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Preload.tsx', content);

