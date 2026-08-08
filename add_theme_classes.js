import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// 1. Profile photo
code = code.replace(
  'className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary"',
  'className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary profile-photo-container"'
);

// 2. Specialty badges
// find: className="px-4 py-1.5 border border-outline-variant rounded-full text-sm font-medium tracking-wide text-on-surface-variant backdrop-blur-sm bg-surface-container/50 whitespace-nowrap shadow-sm hover:border-primary/50 transition-colors"
code = code.replace(
  /className="px-4 py-1\.5 border border-outline-variant rounded-full text-sm font-medium tracking-wide text-on-surface-variant backdrop-blur-sm bg-surface-container\/50 whitespace-nowrap shadow-sm hover:border-primary\/50 transition-colors"/g,
  'className="px-4 py-1.5 border border-outline-variant rounded-full text-sm font-medium tracking-wide text-on-surface-variant backdrop-blur-sm bg-surface-container/50 whitespace-nowrap shadow-sm hover:border-primary/50 transition-colors specialty-badge"'
);

// 3. Primary Button
// find: <button className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 px-8 ...
code = code.replace(
  /className="w-full bg-primary hover:bg-primary\/90 text-on-primary font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-\[1\.02\] shadow-lg hover:shadow-primary\/50 font-label-md text-label-md uppercase tracking-wider relative overflow-hidden group"/g,
  'className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-primary/50 font-label-md text-label-md uppercase tracking-wider relative overflow-hidden group primary-action-btn"'
);

// Turnos cerrados button
code = code.replace(
  /className="w-full bg-surface-variant border border-outline-variant text-on-surface-variant font-bold py-4 px-8 rounded-full cursor-not-allowed font-label-md text-label-md uppercase tracking-wider"/g,
  'className="w-full bg-surface-variant border border-outline-variant text-on-surface-variant font-bold py-4 px-8 rounded-full cursor-not-allowed font-label-md text-label-md uppercase tracking-wider primary-action-btn"'
);

// 4. Category Filters
// Need to find the categories map
// className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${activeCategory === cat ? 'bg-primary text-on-primary border-primary' : 'bg-surface-variant/80 text-on-surface-variant border-outline-variant/30 hover:border-primary/50'}`}
code = code.replace(
  /className=\{\`px-5 py-2 rounded-full whitespace-nowrap border text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-sm \$\{activeCategory === cat \? 'bg-primary text-on-primary border-primary' : 'bg-surface-variant\/80 text-on-surface-variant border-outline-variant\/30 hover:border-primary\/50'\}\`\}/g,
  'className={`px-5 py-2 rounded-full whitespace-nowrap border text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-sm category-filter-btn ${activeCategory === cat ? \'bg-primary text-on-primary border-primary active\' : \'bg-surface-variant/80 text-on-surface-variant border-outline-variant/30 hover:border-primary/50\'}`}'
);
// Also it might be without "border" in the regex? Let's check exactly how it is.
