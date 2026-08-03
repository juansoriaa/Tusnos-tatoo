const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

content = content.replace(
    /highResUrl=\{tattoo\.thumbnailUrl \|\| tattoo\.src\}/,
    "highResUrl={tattoo.thumbnailUrl || tattoo.previewUrl || tattoo.src}"
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched ArtistProfile grid successfully!");
