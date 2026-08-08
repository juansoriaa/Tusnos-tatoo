import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
  '<span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>',
  '<span className="material-symbols-outlined text-on-surface-variant group-open:text-primary group-open:rotate-180 transition-transform">expand_more</span>'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
