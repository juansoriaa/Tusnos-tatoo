const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = 'const filterCategories = Array.from(new Set(["All", ...((artistData?.customCategories && artistData.customCategories.length > 0) ? artistData.customCategories : ["Realismo", "Minimalista", "Tradicional", "Blackwork"])]));';
const replacement = `const categoryCounts = allTattoos.reduce((acc, tattoo) => {
    (tattoo.categories || []).forEach((cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {});
  const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
  const filterCategories = ["All", ...sortedCategories];`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
