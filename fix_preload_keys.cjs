const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

// fix demoArtistData -> demoArtistData_ + id (for artistData states)
content = content.replace(/localStorage\.getItem\('demoArtistData'\)/g, "localStorage.getItem('demoArtistData_' + (id || 'demo'))");
content = content.replace(/localStorage\.setItem\('demoArtistData',/g, "localStorage.setItem('demoArtistData_' + (id || 'demo'),");

// fix demoBgPhotos -> demoBgPhotos_ + id
content = content.replace(/localStorage\.getItem\('demoBgPhotos'\)/g, "localStorage.getItem('demoBgPhotos_' + (id || 'demo'))");
content = content.replace(/localStorage\.setItem\('demoBgPhotos',/g, "localStorage.setItem('demoBgPhotos_' + (id || 'demo'),");

fs.writeFileSync('src/components/Preload.tsx', content);
