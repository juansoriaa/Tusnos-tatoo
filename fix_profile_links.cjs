const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const targetMainButton = `<button 
            className={\`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-10 py-4 \${artistData?.isAvailable !== false ? 'bg-primary hover:bg-[#065f46]' : 'bg-surface-container-high border border-outline-variant text-on-surface-variant'} text-on-primary font-label-md text-label-md font-bold uppercase tracking-widest shadow-[0_10px_40px_rgba(5,77,68,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 backdrop-blur-sm \${artistData?.isAvailable !== false ? 'animate-button-pop' : ''}\`}
            disabled={artistData?.isAvailable === false}
          >`;

const replaceMainButton = `<button 
            className={\`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-10 py-4 \${artistData?.isAvailable !== false ? 'bg-primary hover:bg-[#065f46]' : 'bg-surface-container-high border border-outline-variant text-on-surface-variant'} text-on-primary font-label-md text-label-md font-bold uppercase tracking-widest shadow-[0_10px_40px_rgba(5,77,68,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 backdrop-blur-sm \${artistData?.isAvailable !== false ? 'animate-button-pop' : ''}\`}
            disabled={artistData?.isAvailable === false}
            onClick={() => {
              if (artistData?.whatsapp) {
                const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                window.open(\`https://wa.me/549\${num}\`, '_blank');
              }
            }}
          >`;

content = content.replace(targetMainButton, replaceMainButton);

const targetModalButton = `<button 
                        className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#065f46] transition-all duration-300 group shadow-lg animate-button-pop"
                      >`;

const replaceModalButton = `<button 
                        className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#065f46] transition-all duration-300 group shadow-lg animate-button-pop"
                        onClick={() => {
                           if (artistData?.whatsapp) {
                               const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                               window.open(\`https://wa.me/549\${num}?text=Hola,%20me%20interesa%20este%20tatuaje:%20\${encodeURIComponent(visibleTattoos[activeTattooIndex].src)}\`, '_blank');
                           }
                        }}
                      >`;

content = content.replace(targetModalButton, replaceModalButton);

const oldFooterLinks = `{artistData?.facebook && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href={artistData.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          )}
          {(!artistData?.whatsapp && !artistData?.instagram && !artistData?.facebook) && (`;

const newFooterLinks = `{artistData?.facebook && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href={artistData.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          )}
          {artistData?.tiktok && (
             <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" href={artistData.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
          )}
          {(!artistData?.whatsapp && !artistData?.instagram && !artistData?.facebook && !artistData?.tiktok) && (`;

content = content.replace(oldFooterLinks, newFooterLinks);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

