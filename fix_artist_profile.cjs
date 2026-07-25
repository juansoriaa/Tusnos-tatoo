const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
content = content.replace('{/* Footer */}', '</main>\n      {/* Footer */}');
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
