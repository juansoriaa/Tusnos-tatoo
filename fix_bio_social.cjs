const fs = require('fs');
let profile = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const oldBio = `<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black &amp; grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.</p>`;

const newBio = `<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">{artistData?.bio || "Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente."}</p>`;

profile = profile.replace(oldBio, newBio);

const oldContact = `<a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>`;

const newContact = `
          {artistData?.whatsapp && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href={artistData.whatsapp.startsWith('http') ? artistData.whatsapp : \`https://wa.me/\${artistData.whatsapp.replace(/[^0-9]/g, '')}\`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          )}
          {artistData?.instagram && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href={artistData.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          )}
          {artistData?.facebook && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href={artistData.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          )}
          {(!artistData?.whatsapp && !artistData?.instagram && !artistData?.facebook) && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
          )}
`;

profile = profile.replace(oldContact, newContact);

fs.writeFileSync('src/components/ArtistProfile.tsx', profile);

