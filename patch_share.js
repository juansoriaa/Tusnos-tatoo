const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(/window\.location\.href/g, "(id ? window.location.href : (artistData?.userTag ? window.location.origin + '/' + (artistData.userTag.startsWith('@') ? artistData.userTag : '@' + artistData.userTag) : window.location.href))");

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
