import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// 1. Change visibleCount initial state and resets from 12 to 6
code = code.replace(/useState\(12\);/g, 'useState(6);');
code = code.replace(/setVisibleCount\(12\);/g, 'setVisibleCount(6);');
code = code.replace(/visibleCount > 12/g, 'visibleCount > 6');

// 2. Change the increment from + 12 to + 6
code = code.replace(/setVisibleCount\(prev => prev \+ 12\);/g, 'setVisibleCount(prev => prev + 6);');

// 3. Remove grayscale from the photo gallery
code = code.replace(
  /className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer object-cover aspect-square"/g,
  'className="w-full h-full transition-all duration-700 cursor-pointer object-cover aspect-square"'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
