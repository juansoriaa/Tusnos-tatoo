const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
content = content.replace(/window\.open\(\`https:\/\/wa\.me\//g, "trackMetric('whatsappClicks');\n                                   window.open(`https://wa.me/");
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
