const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target1 = `<div className="overflow-y-auto pr-2 hide-scrollbar max-h-[30vh] md:max-h-[35vh]">`;
const replacement1 = `<div className="overflow-y-auto pr-2 hide-scrollbar max-h-[15vh] md:max-h-[35vh]">`;
content = content.replace(target1, replacement1);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

