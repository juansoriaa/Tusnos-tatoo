const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /import \{ doc, getDoc, updateDoc, increment, query, collection, where, getDocs, orderBy \} from 'firebase\/firestore';/,
    `import { doc, getDoc, updateDoc, increment, query, collection, where, getDocs, orderBy, limit } from 'firebase/firestore';`
);

code = code.replace(
    /orderBy\('createdAt', 'desc'\)\s*\);/,
    `orderBy('createdAt', 'desc'),
                limit(20)
            );`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
