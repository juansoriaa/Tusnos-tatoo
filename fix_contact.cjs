const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `          {(!artistData?.whatsapp && !artistData?.instagram && !artistData?.facebook && !artistData?.tiktok) && (
             <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setContactModalOpen(true)}>Contact</button>
          )}`;

content = content.replace(target, '');
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

