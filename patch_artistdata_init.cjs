const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /let targetId = id \|\| localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid \|\| 'demo';[\s\S]*?break;\s*\}\s*\} catch\(e\) \{\}\s*\}\s*\}\s*\}/,
    `const targetId = resolveTargetId();`
);

code = code.replace(
    /globalPreloadCache\[id \|\| localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid \|\| 'demo'\]/g,
    `globalPreloadCache[targetId]`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
