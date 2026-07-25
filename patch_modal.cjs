const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
content = content.replace(/setModalOpen\(true\);/g, "setModalOpen(true);\n    trackMetric('photoClicks');");
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
