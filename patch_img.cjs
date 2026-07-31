const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

content = content.replace(
    'highResUrl={tattoo.src || tattoo.thumbnailUrl}',
    'highResUrl={tattoo.thumbnailUrl || tattoo.src}'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
