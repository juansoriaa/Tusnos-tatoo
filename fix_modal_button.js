import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = 'className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#065f46] transition-all duration-300 group shadow-lg animate-button-pop"';
const rep = 'className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#065f46] transition-all duration-300 group shadow-lg animate-button-pop primary-action-btn"';

code = code.replace(target, rep);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
