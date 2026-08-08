import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// Replace stat icons
code = code.replace(
  /<span className="material-symbols-outlined text-primary mb-0.5 text-base">/g,
  '<span className="material-symbols-outlined text-primary mb-0.5 text-base stat-icon">'
);

// WhatsApp button in modal
// It's probably something like: <button onClick={...} className="w-full bg-primary hover:bg-primary/90 text-on-primary ...">
// I already replaced "w-full bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-primary/50 font-label-md text-label-md uppercase tracking-wider relative overflow-hidden group" 
// with the primary-action-btn one. Let's check if the modal one has the same exact class.
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
