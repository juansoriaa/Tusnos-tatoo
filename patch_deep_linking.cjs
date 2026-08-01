const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// Replace photo parameter to obra
content = content.replace(/searchParams\.get\('photo'\)/g, "searchParams.get('obra')");
content = content.replace(/newParams\.delete\('photo'\)/g, "newParams.delete('obra')");
content = content.replace(/setSearchParams\(\{ photo: photoId \}\)/g, "setSearchParams({ obra: photoId })");

// Replace the WhatsApp button message
// We will find the part where the message is created and replace it.
const oldMessageLine = "const message = `Hola ${artistData?.displayName || 'artista'}, vengo de tu página web y me encantó este tatuaje. Me gustaría hacerme algo similar o saber más al respecto:\\nReferencia: ${photoUrl}\\nPerfil: ${profileUrl}`;";
const tattooTitleVar = "const tattooTitle = visibleTattoos[activeTattooIndex].title || 'Diseño';";
const newMessageLine = "const tattooTitle = visibleTattoos[activeTattooIndex].title || visibleTattoos[activeTattooIndex].alt || 'Diseño';\\n                                   const message = `Hola ${artistData?.displayName || 'artista'}, me interesa este diseño: [${tattooTitle}] (ID: ${photoId}). Me gustaría hacerme algo similar o saber más al respecto.\\nVer obra: ${profileUrl}?obra=${photoId}`;";

content = content.replace(oldMessageLine, newMessageLine);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched successfully");
