import fs from 'fs';
let profileCode = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

profileCode = profileCode.replace(
  /className="fixed inset-0 z-50 bg-black\/80 backdrop-blur-xl flex flex-col items-center justify-center p-2 md:p-8 transition-opacity duration-300 overscroll-none"/g,
  'className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-2 md:p-8 transition-opacity duration-300 overscroll-none modal-backdrop"'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', profileCode);
