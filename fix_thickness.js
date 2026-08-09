import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
  /<span className="text-\[10px\] font-medium text-white\/70 uppercase tracking-widest profile-logo-text drop-shadow-md">Turnos <span className="text-primary\/80 profile-logo-primary">Tattoo<\/span><\/span>/g,
  '<span className="font-label-md text-label-md font-extrabold text-white/70 uppercase tracking-tighter profile-logo-text drop-shadow-md">Turnos <span className="text-primary/80 profile-logo-primary">Tattoo</span></span>'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
