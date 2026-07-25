const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
content = content.replace(/setWaitlistModalOpen\(true\);/g, "trackMetric('agendaClicks');\n                setWaitlistModalOpen(true);");
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
