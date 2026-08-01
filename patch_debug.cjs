const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

content = content.replace("} else if (!photoId && modalOpen) {", "} else if (!photoId && modalOpen) {\n      console.log('Closing modal because photoId is null');");

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched debug successfully!");
