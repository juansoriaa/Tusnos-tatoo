const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

const fetchTattoosOld = "fetchTattoos();\n\n            if (isMounted) {";
const fetchTattoosNew = "promises.push(fetchTattoos());\n\n            await Promise.all(promises);\n\n            if (isMounted) {";

if (content.includes(fetchTattoosOld)) {
    content = content.replace(fetchTattoosOld, fetchTattoosNew);
    fs.writeFileSync('src/components/ArtistProfile.tsx', content);
    console.log("Patched Promise.all successfully!");
} else {
    console.log("Could not find the target string.");
}
