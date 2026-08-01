const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

const regex = /const message = `Hola \$\{artistData\?\.displayName \|\| 'artista'\}, vengo de tu página web y me encantó este tatuaje\. Me gustaría hacerme algo similar o saber más al respecto:[\s\S]*?Perfil: \$\{profileUrl\}`;/m;

const replacement = `const tattooTitle = visibleTattoos[activeTattooIndex].title || visibleTattoos[activeTattooIndex].alt || 'Diseño';
                                   const message = \`Hola \${artistData?.displayName || 'artista'}, me interesa este diseño: [\${tattooTitle}] (ID: \${photoId}). Me gustaría hacerme algo similar o saber más al respecto.\\nVer obra: \${profileUrl}?obra=\${photoId}\`;`;

if(regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/ArtistProfile.tsx', content);
    console.log("Patched message via regex successfully!");
} else {
    console.log("Regex not found!");
}
