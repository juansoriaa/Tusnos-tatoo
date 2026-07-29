const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /let isDemoUser = false;\s*if \(artistData && \(artistData\.userTag === '@demo' \|\| artistData\.userTag === '@victor_ink' \|\| artistData\.userTag === 'victor_ink' \|\| artistData\.userTag === 'demo'\)\) \{\s*isDemoUser = true;\s*\}\s*if \(artistUid === 'anonymous_demo'\) isDemoUser = true;/,
    `let isDemoUser = false;
            if (artistUid === '@victor_ink' || artistUid === 'victor_ink' || artistUid === 'demo' || artistUid === '@demo' || artistUid === 'anonymous_demo') isDemoUser = true;
            if (artistData && (artistData.userTag === '@demo' || artistData.userTag === '@victor_ink' || artistData.userTag === 'victor_ink' || artistData.userTag === 'demo')) {
                isDemoUser = true;
            }`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
