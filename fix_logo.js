import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
  /<div className="top-0 left-0 z-40 px-3 py-1\.5 bg-black\/60 backdrop-blur-md fixed profile-logo-container">/,
  '<div className="top-0 left-0 z-40 px-3 py-1 bg-black/30 backdrop-blur-sm fixed rounded-br-lg border-b border-r border-white/5 profile-logo-container">'
);
code = code.replace(
  /<span className="font-label-md text-label-md font-extrabold text-white uppercase tracking-tighter profile-logo-text">Turnos <span className="text-primary profile-logo-primary">Tattoo<\/span><\/span>/,
  '<span className="text-[10px] font-medium text-white/70 uppercase tracking-widest profile-logo-text drop-shadow-md">Turnos <span className="text-primary/80 profile-logo-primary">Tattoo</span></span>'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
