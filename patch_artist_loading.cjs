const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /const \[isProfileLoading, setIsProfileLoading\] = useState\(\(\) => \{/,
    `const [isTattoosLoading, setIsTattoosLoading] = useState(() => {
        try {
            const targetId = id || localStorage.getItem('demoUserId') || 'demo';
            if (globalPreloadCache[targetId]?.allTattoos) return false;
            if (localStorage.getItem('demoAllTattoos_' + targetId)) return false;
        } catch(e) {}
        return true;
    });\n  const [isProfileLoading, setIsProfileLoading] = useState(() => {`
);

code = code.replace(
    /setAllTattoos\(finalPhotos\);\s*\} catch \(error\) \{/,
    `setAllTattoos(finalPhotos);
            setIsTattoosLoading(false);
        } catch (error) {`
);

code = code.replace(
    /if \(isProfileLoading\) \{/,
    `if (isProfileLoading || isTattoosLoading) {`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
