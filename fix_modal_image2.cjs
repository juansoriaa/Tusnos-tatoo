const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target1 = `className="max-w-full h-full max-h-[65vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl"`;
const replacement1 = `className="max-w-full max-h-[65vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl"`;

content = content.replace(target1, replacement1);

const target2 = `<div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4 relative overflow-hidden">`;
const replacement2 = `<div className="w-full h-[60vh] md:h-auto md:w-2/3 bg-black flex items-center justify-center p-4 relative overflow-hidden">`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

