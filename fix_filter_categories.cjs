const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const filterCategories = ["All", "Realismo", "Minimalista", "Tradicional", "Blackwork"];`;

const replacement = `  const filterCategories = ["All", ...((artistData?.specialtyTags && artistData.specialtyTags.length > 0) ? artistData.specialtyTags : ["Realismo", "Minimalista", "Tradicional", "Blackwork"])];`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

