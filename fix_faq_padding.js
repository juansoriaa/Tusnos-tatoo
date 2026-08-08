import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
  /className="bg-surface-container border border-outline-variant\/30 group info-section"/g,
  'className="bg-surface-container border border-outline-variant/30 group"'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
