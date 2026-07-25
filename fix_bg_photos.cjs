const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const target = `        // Grab top 3 pinned/recent for background
        let top3 = allPhotos.slice(0, 3).map(data => data.url || data.thumbnailUrl).filter(url => url);
        if (top3.length > 0) {
            setBgPhotos(top3);
        }`;

const replacement = `        // Grab top 3 pinned/recent for background
        let top3 = allPhotos.slice(0, 3).map(data => data.url || data.thumbnailUrl).filter(url => url);
        if (top3.length > 0) {
            // Need exactly 4 items for the CSS 25% width logic to work correctly
            let bg4 = [...top3];
            while(bg4.length < 4) {
                bg4.push(bg4[bg4.length % top3.length]);
            }
            setBgPhotos(bg4);
        }`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Preload.tsx', content);
