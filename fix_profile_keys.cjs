const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

content = content.replace(/localStorage\.getItem\('demoArtistData'\)/g, "localStorage.getItem('demoArtistData_' + (id || 'demo'))");

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
