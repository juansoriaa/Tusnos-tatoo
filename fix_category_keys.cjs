const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `{visibleTattoos[activeTattooIndex].categories.map(cat => (
                          <span key={cat} className="px-2 py-0.5 border border-primary text-[9px] font-bold tracking-widest text-primary uppercase bg-primary/5">`;

const replacement = `{visibleTattoos[activeTattooIndex].categories.map((cat, idx) => (
                          <span key={idx} className="px-2 py-0.5 border border-primary text-[9px] font-bold tracking-widest text-primary uppercase bg-primary/5">`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

