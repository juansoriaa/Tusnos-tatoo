const fs = require('fs');
let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const target = `            });
            localStorage.setItem('demoBgPhotos_' + (id || 'demo'), JSON.stringify(bg4));
        }
        // Wait for images to load in browser cache`;

const replacement = `            });
            localStorage.setItem('demoBgPhotos_' + (id || 'demo'), JSON.stringify(bg4));
        }
        setIsFetchingBg(false);
        // Wait for images to load in browser cache`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Preload.tsx', content);

