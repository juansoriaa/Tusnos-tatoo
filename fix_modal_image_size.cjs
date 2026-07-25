const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target1 = `className="w-full h-[55vh] md:h-auto md:w-2/3 bg-black flex items-center justify-center p-2 md:p-4 relative overflow-hidden flex-shrink-0"`;
const replacement1 = `className="w-full h-[45vh] md:h-auto md:w-2/3 bg-black flex items-center justify-center p-2 md:p-4 relative overflow-hidden flex-shrink-0"`;
content = content.replace(target1, replacement1);

const target2 = `className="max-w-full max-h-[55vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl"`;
const replacement2 = `className="max-w-full max-h-[45vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl"`;
content = content.replace(target2, replacement2);

// Let's also adjust the info container bottom padding
const target3 = `<div className="mt-auto pt-10 flex flex-col gap-8">`;
const replacement3 = `<div className="mt-auto pt-4 md:pt-10 flex flex-col gap-4 md:gap-8">`;
content = content.replace(target3, replacement3);

const target4 = `<div className="flex justify-between w-full border-t border-outline-variant/10 pt-6">`;
const replacement4 = `<div className="flex justify-between w-full border-t border-outline-variant/10 pt-4 md:pt-6">`;
content = content.replace(target4, replacement4);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

