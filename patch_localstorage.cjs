const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// Inside fetchTattoos() after setAllTattoos(finalPhotos);
content = content.replace(
  "setAllTattoos(finalPhotos);",
  "setAllTattoos(finalPhotos);\n                        try {\n                            localStorage.setItem('demoAllTattoos_' + artistUid, JSON.stringify(finalPhotos));\n                        } catch(e) {}"
);

// Inside loadProfileData() after setArtistData(data);
content = content.replace(
  "setArtistData(data);\n                    globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], artistData: data };",
  "setArtistData(data);\n                    globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], artistData: data };\n                    try {\n                        localStorage.setItem('demoArtistData_' + artistUid, JSON.stringify(data));\n                    } catch(e) {}"
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched localstorage successfully!");
