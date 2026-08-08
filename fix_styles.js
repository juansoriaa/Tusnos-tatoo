import fs from 'fs';

// 1. Fix DemoLayout.tsx theme classes
let layoutCode = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
layoutCode = layoutCode.replace(
  /className=\{`bg-deep-black text-silver-text font-body-md h-\[100dvh\] overflow-hidden flex text-\[#e5e2e1\] bg-\[#050505\] \$\{theme === 'pink_neon' \? 'theme-pink-neon' : ''\} \$\{theme === 'minimal_clean' \? 'theme-minimal-clean' : ''\} \$\{theme === 'cyber_neon' \? 'theme-cyber-neon' : ''\}`\}/g,
  'className="bg-deep-black text-silver-text font-body-md h-[100dvh] overflow-hidden flex text-[#e5e2e1] bg-[#050505]"'
);
fs.writeFileSync('src/components/DemoLayout.tsx', layoutCode);

// 2. Fix ArtistProfile.tsx logo and banner overlays
let profileCode = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
profileCode = profileCode.replace(
  /<div className="top-0 left-0 z-40 px-3 py-1.5 bg-black\/60 backdrop-blur-md fixed">/g,
  '<div className="top-0 left-0 z-40 px-3 py-1.5 bg-black backdrop-blur-md fixed border border-black profile-logo-container">'
);
profileCode = profileCode.replace(
  /<span className="font-label-md text-label-md font-extrabold text-on-surface uppercase tracking-tighter">Turnos <span className="text-primary">Tattoo<\/span><\/span>/g,
  '<span className="font-label-md text-label-md font-extrabold text-white uppercase tracking-tighter profile-logo-text">Turnos <span className="text-primary profile-logo-primary">Tattoo</span></span>'
);
profileCode = profileCode.replace(
  /<div className="absolute inset-0 bg-black\/40"><\/div>/g,
  '<div className="absolute inset-0 bg-black/40 banner-overlay-1"></div>'
);
profileCode = profileCode.replace(
  /<div className="absolute inset-0 bg-gradient-to-t from-background via-black\/50 to-transparent"><\/div>/g,
  '<div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent banner-overlay-2"></div>'
);
// Also fix the technical grid cards to have a class we can target
profileCode = profileCode.replace(
  /className="flex flex-col items-center justify-center text-center py-1.5 px-2 md:px-4 border border-outline-variant\/10 bg-surface-container-high rounded-lg transition-colors hover:bg-surface-container-highest min-w-\[80px\] md:min-w-\[95px\]"/g,
  'className="flex flex-col items-center justify-center text-center py-1.5 px-2 md:px-4 border border-outline-variant/10 bg-surface-container-high rounded-lg transition-colors hover:bg-surface-container-highest min-w-[80px] md:min-w-[95px] tech-stat-card"'
);
fs.writeFileSync('src/components/ArtistProfile.tsx', profileCode);

