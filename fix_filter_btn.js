import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `                  className={\`whitespace-nowrap px-4 py-2 border rounded font-label-md text-[10px] md:text-xs uppercase tracking-widest font-bold transition-colors \${
                    activeCategory === cat 
                      ? 'bg-primary/20 text-primary border-primary/30' 
                      : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                  }\`}`;
const rep = `                  className={\`whitespace-nowrap px-4 py-2 border rounded font-label-md text-[10px] md:text-xs uppercase tracking-widest font-bold transition-colors category-filter-btn \${
                    activeCategory === cat 
                      ? 'bg-primary/20 text-primary border-primary/30 active' 
                      : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                  }\`}`;

code = code.replace(target, rep);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
