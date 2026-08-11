import fs from 'fs';

let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
  /<div className="text-left info-section">/g,
  '<div className="text-left info-section bg-surface-container p-8 border border-outline-variant/20">'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
