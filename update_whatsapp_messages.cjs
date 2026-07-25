const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target1 = `                if (artistData?.whatsapp) {
                  const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                  trackMetric('whatsappClicks');
                  
                  window.open(\`https://wa.me/549\${num}\`, '_blank');
                }`;

const replacement1 = `                if (artistData?.whatsapp) {
                  const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                  trackMetric('whatsappClicks');
                  const message = \`Hola \${artistData?.displayName || 'artista'}, vengo de tu página web. Tengo una duda, pregunta o idea para un tatuaje...\`;
                  window.open(\`https://wa.me/549\${num}?text=\${encodeURIComponent(message)}\`, '_blank');
                }`;

content = content.replace(target1, replacement1);

const target2 = `                               if (artistData?.whatsapp) {
                                   const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                                   trackMetric('whatsappClicks');
                                   window.open(\`https://wa.me/549\${num}?text=Hola,%20me%20interesa%20este%20tatuaje:%20\${encodeURIComponent(visibleTattoos[activeTattooIndex].src)}\`, '_blank');
                               }`;

const replacement2 = `                               if (artistData?.whatsapp) {
                                   const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                                   trackMetric('whatsappClicks');
                                   const photoId = visibleTattoos[activeTattooIndex].id;
                                   const currentUrl = new URL(window.location.href);
                                   currentUrl.searchParams.set('photo', photoId);
                                   const message = \`Hola \${artistData?.displayName || 'artista'}, vengo de tu página web y me encantó este tatuaje. Me gustaría hacerme algo similar o saber más al respecto:\\n\\n\${currentUrl.toString()}\`;
                                   window.open(\`https://wa.me/549\${num}?text=\${encodeURIComponent(message)}\`, '_blank');
                               }`;

content = content.replace(target2, replacement2);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
