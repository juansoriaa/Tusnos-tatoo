import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
  /setAllTattoos\(prev => \[\.\.\.prev, \.\.\.newPhotos\]\);/g,
  `setAllTattoos(prev => [...prev, ...newPhotos]);
        setVisibleCount(prev => prev + 12);`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
