import fs from 'fs';

let profileCode = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

profileCode = profileCode.replace(
  /className="flex flex-col items-center justify-center text-center py-1\.5 px-2 md:px-4 border border-outline-variant\/10 bg-surface-container-high rounded-lg transition-colors hover:bg-surface-container-highest min-w-\[80px\] md:min-w-\[95px\] tech-stat-card"/g,
  'className="flex flex-col items-center justify-center text-center py-2 px-3 md:px-4 border border-white/10 bg-black/40 backdrop-blur-md rounded-lg transition-colors hover:bg-black/60 min-w-[80px] md:min-w-[95px] tech-stat-card shadow-xl"'
);

profileCode = profileCode.replace(
  /<span className="text-\[9px\] font-bold tracking-widest text-on-surface-variant\/70 uppercase">Horas<\/span>/g,
  '<span className="text-[9px] font-bold tracking-widest text-white/70 uppercase">Horas</span>'
);
profileCode = profileCode.replace(
  /<span className="font-bold text-on-surface text-\[11px\] mt-0\.5">\{visibleTattoos\[activeTattooIndex\]\.hours\}h<\/span>/g,
  '<span className="font-bold text-white text-[11px] mt-0.5">{visibleTattoos[activeTattooIndex].hours}h</span>'
);

profileCode = profileCode.replace(
  /<span className="text-\[9px\] font-bold tracking-widest text-on-surface-variant\/70 uppercase">Sesiones<\/span>/g,
  '<span className="text-[9px] font-bold tracking-widest text-white/70 uppercase">Sesiones</span>'
);
profileCode = profileCode.replace(
  /<span className="font-bold text-on-surface text-\[11px\] mt-0\.5">\{visibleTattoos\[activeTattooIndex\]\.sessions\}<\/span>/g,
  '<span className="font-bold text-white text-[11px] mt-0.5">{visibleTattoos[activeTattooIndex].sessions}</span>'
);

profileCode = profileCode.replace(
  /<span className="text-\[9px\] font-bold tracking-widest text-on-surface-variant\/70 uppercase">Tamaño<\/span>/g,
  '<span className="text-[9px] font-bold tracking-widest text-white/70 uppercase">Tamaño</span>'
);
profileCode = profileCode.replace(
  /<span className="font-bold text-on-surface text-\[11px\] mt-0\.5">\{visibleTattoos\[activeTattooIndex\]\.size\}<\/span>/g,
  '<span className="font-bold text-white text-[11px] mt-0.5">{visibleTattoos[activeTattooIndex].size}</span>'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', profileCode);
