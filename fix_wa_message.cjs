const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const regex = /if \(artistData\?\.whatsapp\) \{\s*const num = artistData\.whatsapp\.replace\(\/\[\^0-9\]\/g, ''\);\s*trackMetric\('whatsappClicks'\);\s*window\.open\(\`https:\/\/wa\.me\/549\$\{num\}\`, '_blank'\);\s*\}/;

const replacement = `if (artistData?.whatsapp) {
                  const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                  trackMetric('whatsappClicks');
                  const message = \`Hola \${artistData?.displayName || 'artista'}, vengo de tu página web. Tengo una duda, pregunta o idea para un tatuaje...\`;
                  window.open(\`https://wa.me/549\${num}?text=\${encodeURIComponent(message)}\`, '_blank');
                }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
