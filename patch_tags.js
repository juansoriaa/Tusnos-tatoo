const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /md:justify-start/g,
    'md:justify-center'
);
code = code.replace(
    /md:text-left/g,
    'md:text-center'
);
code = code.replace(
    /md:items-start/g,
    'md:items-center'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
