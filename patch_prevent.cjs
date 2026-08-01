const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

content = content.replace(
    /const prevPhoto = \(e: React\.MouseEvent\) => {/g,
    "const prevPhoto = (e: React.MouseEvent) => {\n    e.preventDefault();"
);

content = content.replace(
    /const nextPhoto = \(e: React\.MouseEvent\) => {/g,
    "const nextPhoto = (e: React.MouseEvent) => {\n    e.preventDefault();"
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched preventDefault successfully!");
