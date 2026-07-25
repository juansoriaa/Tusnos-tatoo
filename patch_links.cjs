const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `<div className="flex flex-wrap justify-center gap-8 mb-4">
          <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
          <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>`;

const replacement = `<div className="flex flex-wrap justify-center gap-8 mb-4">
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setTermsModalOpen(true)}>Términos</button>
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setPrivacyModalOpen(true)}>Privacidad</button>
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setContactModalOpen(true)}>Contacto</button>`;

content = content.replace(target, replacement);

const target2 = `          {(!artistData?.whatsapp && !artistData?.instagram && !artistData?.facebook && !artistData?.tiktok) && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
          )}`;

const replacement2 = `          {(!artistData?.whatsapp && !artistData?.instagram && !artistData?.facebook && !artistData?.tiktok) && (
             <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setContactModalOpen(true)}>Contact</button>
          )}`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
