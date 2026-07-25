const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const oldMap = `size: data.size,
                    pinnedOrder: data.pinnedOrder
                };`;

const newMap = `size: data.size,
                    pinnedOrder: data.pinnedOrder,
                    originalFallbackId: data.originalFallbackId
                };`;

content = content.replace(oldMap, newMap);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
