const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

content = content.replace(/<ProgressiveImage/g, '<OptimizedImage');
content = content.replace(/thumbnailUrl=\{/g, 'lowResUrl={');

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Fixed ProgressiveImage in ArtistProfile!");
