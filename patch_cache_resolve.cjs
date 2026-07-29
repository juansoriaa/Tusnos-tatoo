const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /const targetId = id \|\| localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid \|\| 'demo';/g,
    `let targetId = id || localStorage.getItem('demoUserId') || auth.currentUser?.uid || 'demo';
        if (id && id.startsWith('@')) {
            // Try to find if we have a cache with this userTag
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('demoArtistData_')) {
                    try {
                        const cached = JSON.parse(localStorage.getItem(key) || '{}');
                        if (cached.userTag === id || cached.userTag === '@' + id || '@' + cached.userTag === id) {
                            targetId = cached.uid;
                            break;
                        }
                    } catch(e) {}
                }
            }
        }`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
