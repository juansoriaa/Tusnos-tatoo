const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');
content = content.replace(/lion's/g, 'lion');
fs.writeFileSync('src/components/DemoPortfolio.tsx', content, 'utf8');
content = fs.readFileSync('src/components/Landing.tsx', 'utf8');
content = content.replace(/lion's/g, 'lion');
fs.writeFileSync('src/components/Landing.tsx', content, 'utf8');
content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');
content = content.replace(/lion's/g, 'lion');
fs.writeFileSync('src/components/SuperAdmin.tsx', content, 'utf8');
content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');
content = content.replace(/lion's/g, 'lion');
fs.writeFileSync('src/components/DemoMetrics.tsx', content, 'utf8');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

const translations = [
    ['"Blackwork Samurai"', '"Samurai Blackwork"'],
    ['"Blackwork samurai tattoo on forearm."', '"Tatuaje de samurai estilo blackwork en antebrazo."'],
    ['"Detailed black & grey realism"', '"Realismo detallado en sombras"'],
    ['"A highly detailed black and grey realism tattoo of a lion face on a human forearm."', '"Tatuaje de realismo detallado de león en el antebrazo."'],
    ['"Delicate minimalist single rose"', '"Rosa minimalista delicada"'],
    ['"Close-up of a delicate minimalist tattoo of a single rose."', '"Tatuaje minimalista de línea fina de una rosa."'],
    ['"Large-scale blackwork back piece"', '"Pieza completa de espalda en Blackwork"'],
    ['"Large-scale blackwork tattoo covering a full back."', '"Tatuaje de espalda completa con diseños oscuros."']
];

replaceInFile('src/components/DemoPortfolio.tsx', translations);
replaceInFile('src/components/Landing.tsx', translations);
replaceInFile('src/components/DemoMetrics.tsx', translations);
replaceInFile('src/components/SuperAdmin.tsx', translations);

let demoPortfolio = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');
demoPortfolio = demoPortfolio.replace(/alert\('Por favor selecciona una imagen primero.'\);/g, "setErrorModalMsg('Por favor selecciona una imagen primero.');");
demoPortfolio = demoPortfolio.replace(/alert\('El nombre de la obra es requerido.'\);/g, "setErrorModalMsg('El nombre de la obra es requerido.');");
demoPortfolio = demoPortfolio.replace(/alert\(err\.message \|\| 'Error al subir la imagen\. Por favor verifica tu conexi.n y sesi.n\.'\);/g, "setErrorModalMsg(err.message || 'Error al subir la imagen. Por favor verifica tu conexión y sesión.');");
demoPortfolio = demoPortfolio.replace(/alert\("Error cr.tico: Intentando guardar Base64 en base de datos\. Operaci.n abortada\."\);/g, "setErrorModalMsg('Error crítico: Intentando guardar Base64 en base de datos. Operación abortada.');");
demoPortfolio = demoPortfolio.replace(/alert\('Hubo un error al guardar la obra.'\);/g, "setErrorModalMsg('Hubo un error al guardar la obra.');");
demoPortfolio = demoPortfolio.replace(/alert\("Hubo un error al eliminar la foto."\);/g, "setErrorModalMsg('Hubo un error al eliminar la foto.');");
demoPortfolio = demoPortfolio.replace('if (!editingPhoto && existingPhotos.length >= 15) {', 'if (!editingPhoto && existingPhotos.length >= 12) {');
demoPortfolio = demoPortfolio.replace('<strong>15 obras</strong>', '<strong>12 obras</strong>');
fs.writeFileSync('src/components/DemoPortfolio.tsx', demoPortfolio, 'utf8');

console.log('done');
