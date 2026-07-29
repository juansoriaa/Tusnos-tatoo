const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(/const \[shouldPreload\] = useState\(\(\) => !sessionStorage\.getItem\('preloaded_' \+ \(id \|\| localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid \|\| 'demo'\)\)\);/, '');
code = code.replace(/useEffect\(\(\) => \{\s*if \(shouldPreload\) \{\s*navigate\(id \? '\/' \+ \(id\.startsWith\('@'\) \? id : '@' \+ id\) \+ '\/preload' : '\/demo\/preload', \{ replace: true \}\);\s*\}\s*\}, \[navigate, id, shouldPreload\]\);/, '');

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
