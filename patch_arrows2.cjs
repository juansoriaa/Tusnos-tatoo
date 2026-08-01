const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

content = content.replace(
    /setSearchParams\(\{ obra: photoId \}, \{ replace: true \}\);/g,
    "setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('obra', photoId); return p; }, { replace: true });"
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched prev/next arrows successfully 2!");
