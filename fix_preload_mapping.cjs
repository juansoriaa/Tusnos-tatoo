const fs = require('fs');
let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const regex = /const snapshot = await getDocs\(q\);([\s\S]*?)\/\/ Grab top 3 pinned\/recent for background\s+let top3 = allPhotos\.slice\(0, 3\)\.map\(data => data\.thumbnailUrl \|\| data\.url\)\.filter\(url => url\);/m;

const replacement = `const snapshot = await getDocs(q);
        const mappedPhotos = snapshot.docs.map(doc => {
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
        localStorage.setItem('demoAllTattoos_' + (id || 'demo'), JSON.stringify(mappedPhotos));
        
        mappedPhotos.sort((a, b) => {
           const aPinned = a.pinned === true;
           const bPinned = b.pinned === true;
           if (aPinned && bPinned) return (a.pinnedOrder || 0) - (b.pinnedOrder || 0);
           if (aPinned) return -1;
           if (bPinned) return 1;
           return 0;
        });
        const urlsToPreload = mappedPhotos.map(data => data.thumbnailUrl || data.src).filter(url => url);
        
        // Grab top 3 pinned/recent for background
        let top3 = mappedPhotos.slice(0, 3).map(data => data.thumbnailUrl || data.src).filter(url => url);`;

content = content.replace(regex, replacement);

if (content.includes("mappedPhotos")) {
  console.log("Success");
  fs.writeFileSync('src/components/Preload.tsx', content);
} else {
  console.log("Failed to replace");
}
