import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// 1. Studio Info
code = code.replace(
  '<div className="text-left">',
  '<div className="text-left info-section">'
);

// 2. Sobre Mí
code = code.replace(
  '<div className="bg-surface-container p-8 border border-outline-variant/20 flex flex-col gap-8 items-center text-center">',
  '<div className="bg-surface-container p-8 border border-outline-variant/20 flex flex-col gap-8 items-center text-center info-section">'
);

// 3. FAQ details
code = code.replace(
  /<details key=\{index\} className="bg-surface-container border border-outline-variant\/30 group">/g,
  '<details key={index} className="bg-surface-container border border-outline-variant/30 group info-section">'
);

// 4. Modal Nav Arrows
code = code.replace(
  /className="hidden md:flex absolute left-2 md:left-4 top-1\/2 -translate-y-1\/2 z-\[110\] w-10 h-10 md:w-12 md:h-12 items-center justify-center p-0 text-white\/90 bg-black\/40 md:bg-black\/20 hover:bg-black\/70 border border-white\/20 backdrop-blur-md rounded-full transition-all duration-300 focus:outline-none hover:scale-110 shadow-lg md:opacity-0 md:group-hover:opacity-100" /g,
  'className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[110] w-10 h-10 md:w-12 md:h-12 items-center justify-center p-0 text-white/90 bg-black/40 md:bg-black/20 hover:bg-black/70 border border-white/20 backdrop-blur-md rounded-full transition-all duration-300 focus:outline-none hover:scale-110 shadow-lg md:opacity-0 md:group-hover:opacity-100 modal-nav-arrow" '
);
code = code.replace(
  /className="hidden md:flex absolute right-2 md:right-4 top-1\/2 -translate-y-1\/2 z-\[110\] w-10 h-10 md:w-12 md:h-12 items-center justify-center p-0 text-white\/90 bg-black\/40 md:bg-black\/20 hover:bg-black\/70 border border-white\/20 backdrop-blur-md rounded-full transition-all duration-300 focus:outline-none hover:scale-110 shadow-lg md:opacity-0 md:group-hover:opacity-100" /g,
  'className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[110] w-10 h-10 md:w-12 md:h-12 items-center justify-center p-0 text-white/90 bg-black/40 md:bg-black/20 hover:bg-black/70 border border-white/20 backdrop-blur-md rounded-full transition-all duration-300 focus:outline-none hover:scale-110 shadow-lg md:opacity-0 md:group-hover:opacity-100 modal-nav-arrow" '
);

// 5. Stat icons
// There are several icons for schedule, content_cut, width. 
// "Los pequeños recuadros estadísticos de la obra (horas, sesiones, tamaño)"
// Let's replace: <span className="material-symbols-outlined text-primary text-xl">
// but wait, is it text-primary or white? Let's check how they are defined.
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
