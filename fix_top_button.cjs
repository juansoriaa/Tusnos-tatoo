const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const targetTopButton = `className={\`w-full max-w-md py-3 px-6 font-label-md text-label-md font-extrabold uppercase tracking-widest shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4 relative overflow-hidden \${artistData?.isAvailable !== false ? 'bg-primary text-on-primary hover:bg-[#065f46] active:scale-95 shimmer-btn' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'}\`}
            disabled={artistData?.isAvailable === false}
          >`;

const replaceTopButton = `className={\`w-full max-w-md py-3 px-6 font-label-md text-label-md font-extrabold uppercase tracking-widest shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4 relative overflow-hidden \${artistData?.isAvailable !== false ? 'bg-primary text-on-primary hover:bg-[#065f46] active:scale-95 shimmer-btn' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'}\`}
            disabled={artistData?.isAvailable === false}
            onClick={() => {
              if (artistData?.whatsapp) {
                const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                window.open(\`https://wa.me/549\${num}\`, '_blank');
              }
            }}
          >`;

content = content.replace(targetTopButton, replaceTopButton);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

