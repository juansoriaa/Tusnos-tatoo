const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `className="max-w-full max-h-[40vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl"`;
const replacement = `className="max-w-full h-full max-h-[65vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl"`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

