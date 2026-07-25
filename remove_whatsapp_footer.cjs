const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `          {artistData?.whatsapp && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href={artistData.whatsapp.startsWith('http') ? artistData.whatsapp : \`https://wa.me/\${artistData.whatsapp.replace(/[^0-9]/g, '')}\`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          )}`;

content = content.replace(target, '');
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
