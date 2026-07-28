const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /if \(!modalOpen \|\| activeTattooIndex !== vIndex\) \{\s*setActiveTattooIndex\(vIndex\);\s*if \(!modalOpen\) \{\s*setModalOpen\(true\);\s*trackMetric\('photoClicks', photoId\);\s*document\.body\.classList\.add\('overflow-hidden'\);\s*\}\s*\}/,
    `if (!modalOpen || activeTattooIndex !== vIndex) {
          setActiveTattooIndex(vIndex);
          trackMetric('photoClicks', photoId);
          if (!modalOpen) {
            setModalOpen(true);
            document.body.classList.add('overflow-hidden');
          }
        }`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
