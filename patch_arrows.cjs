const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

content = content.replace(/setSearchParams\(\{ photo: photoId \}, \{ replace: true \}\);/g, "setSearchParams({ obra: photoId }, { replace: true });");

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched prev/next arrows successfully!");
