const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /let isExplicitDemoTarget = !id \|\| id === 'demo' \|\| id === 'victor_ink' \|\| id === '@victor_ink';/,
    `let isExplicitDemoTarget = false;` // Don't use fallback if no data
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
