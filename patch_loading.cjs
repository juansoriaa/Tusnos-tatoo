const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /const \[isProfileLoading, setIsProfileLoading\] = useState\(true\);/,
    `const [isProfileLoading, setIsProfileLoading] = useState(() => {
        try {
            const targetId = id || localStorage.getItem('demoUserId') || 'demo';
            if (globalPreloadCache[targetId]?.artistData) return false;
            if (localStorage.getItem('demoArtistData_' + targetId)) return false;
        } catch(e) {}
        return true;
    });`
);

code = code.replace(
    /if \(targetId\) \{\s*setIsProfileLoading\(true\);/g,
    `if (targetId) {
        if (!artistData) setIsProfileLoading(true);`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
