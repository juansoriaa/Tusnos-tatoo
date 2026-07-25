const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

content = content.replace(/    const handleProfileDataChanged = \(\) => \{\n        fetchTattoos\(\);\n    \};/g, "    const handleProfileDataChanged = () => {\n        fetchTattoos();\n        fetchArtist();\n    };");

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
