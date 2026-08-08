import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen">`;
const rep = `    <div className={\`bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen \${artistData?.theme === 'pink_neon' ? 'theme-pink-neon' : ''}\`}>`;

code = code.replace(target, rep);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
