const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target1 = `<div className="w-full h-[60vh] md:h-auto md:w-2/3 bg-black flex items-center justify-center p-4 relative overflow-hidden">`;
const replacement1 = `<div className="w-full h-[65vh] md:h-auto md:w-2/3 bg-black flex items-center justify-center p-2 md:p-4 relative overflow-hidden flex-shrink-0">`;

content = content.replace(target1, replacement1);

const target2 = `<div className="w-full md:w-1/3 p-4 md:p-6 flex flex-col border-l border-outline-variant/10 overflow-y-auto touch-pan-y overscroll-contain">`;
const replacement2 = `<div className="w-full md:w-1/3 p-4 md:p-6 flex flex-col flex-1 border-l border-outline-variant/10 overflow-y-auto touch-pan-y overscroll-contain">`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

