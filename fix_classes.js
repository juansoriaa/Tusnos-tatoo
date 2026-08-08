import fs from 'fs';

let profileCode = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// Add profile-photo-container
profileCode = profileCode.replace(
  /className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary"/g,
  'className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary profile-photo-container"'
);

// Add specialty-badge
profileCode = profileCode.replace(
  /className="px-2 py-1 md:px-3 md:py-1 bg-surface-container border border-outline-variant/g,
  'className="px-2 py-1 md:px-3 md:py-1 bg-surface-container border border-outline-variant specialty-badge'
);

// Add primary-action-btn to the main 'QUIERO UN TURNO' button
profileCode = profileCode.replace(
  /className=\{`w-full max-w-md py-3 px-6 font-label-md text-label-md font-extrabold uppercase tracking-widest shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4 relative overflow-hidden bg-primary text-on-primary hover:bg-\[#065f46\] active:scale-95 shimmer-btn`\}/g,
  'className={`w-full max-w-md py-3 px-6 font-label-md text-label-md font-extrabold uppercase tracking-widest shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4 relative overflow-hidden bg-primary text-on-primary hover:bg-[#065f46] active:scale-95 shimmer-btn primary-action-btn`}'
);

// Add tattoo-card
profileCode = profileCode.replace(
  /className=\{`group relative overflow-hidden border border-white\/5 \$\{index === 0 \? 'interactive-cue' : ''\}`\}/g,
  'className={`group relative overflow-hidden border border-white/5 tattoo-card ${index === 0 ? \'interactive-cue\' : \'\'}`}'
);

// Add modal-backdrop
profileCode = profileCode.replace(
  /className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black\/95 backdrop-blur-sm"/g,
  'className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm modal-backdrop"'
);

// Add modal-container
profileCode = profileCode.replace(
  /className="relative z-10 w-full max-w-6xl h-\[100dvh\] md:h-auto md:max-h-\[95vh\] md:min-h-\[80vh\] flex flex-col bg-surface-container border border-outline-variant\/20 shadow-2xl transform transition-transform duration-300"/g,
  'className="relative z-10 w-full max-w-6xl h-[100dvh] md:h-auto md:max-h-[95vh] md:min-h-[80vh] flex flex-col bg-surface-container border border-outline-variant/20 shadow-2xl transform transition-transform duration-300 modal-container"'
);

// Add modal-nav-arrow
profileCode = profileCode.replace(
  /className="absolute left-2 md:left-6 top-1\/2 -translate-y-1\/2 w-10 h-10 md:w-14 md:h-14 bg-background\/50 border border-outline-variant\/30 rounded-full flex items-center justify-center/g,
  'className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-background/50 border border-outline-variant/30 rounded-full flex items-center justify-center modal-nav-arrow'
);
profileCode = profileCode.replace(
  /className="absolute right-2 md:right-6 top-1\/2 -translate-y-1\/2 w-10 h-10 md:w-14 md:h-14 bg-background\/50 border border-outline-variant\/30 rounded-full flex items-center justify-center/g,
  'className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-background/50 border border-outline-variant/30 rounded-full flex items-center justify-center modal-nav-arrow'
);

// Add stat-icon
profileCode = profileCode.replace(
  /className="material-symbols-outlined text-primary text-lg md:text-xl shrink-0"/g,
  'className="material-symbols-outlined text-primary text-lg md:text-xl shrink-0 stat-icon"'
);

// Ensure the filters have scroll horizontally
// The user says: "Asegúrate de que la barra de botones de filtro ('ALL', 'BLACKWORK', 'REALISMO', etc.) mantenga un contenedor con scroll horizontal fluido y sin barras de desplazamiento visibles, permitiendo deslizar con el dedo."
// There should be something like flex overflow-x-auto no-scrollbar
profileCode = profileCode.replace(
  /className="flex flex-wrap md:flex-nowrap justify-center gap-2"/g,
  'className="flex overflow-x-auto justify-start md:justify-center gap-2 no-scrollbar px-4 md:px-0 w-full"'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', profileCode);
