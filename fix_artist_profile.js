import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) \=\> \{ setActiveCategory\(cat\); setShowMore\(false\); \}\}/g,
  "onClick={() => { setActiveCategory(cat); }}"
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
