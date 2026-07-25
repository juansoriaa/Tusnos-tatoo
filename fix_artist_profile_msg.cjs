const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const oldMsg = `                  hasImage: !!waitlistForm.referenceImage,
                  referenceImage: waitlistForm.referenceImage,
                  tags: [`;

const newMsg = `                  hasImage: !!waitlistForm.referenceImage,
                  referenceImage: waitlistForm.referenceImage,
                  referenceTitle: waitlistForm.referenceImage ? (allTattoos.find(t => t.src === waitlistForm.referenceImage)?.title || 'Imagen adjuntada') : undefined,
                  tags: [`;

content = content.replace(oldMsg, newMsg);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
