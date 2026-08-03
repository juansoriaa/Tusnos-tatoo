const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// Add previewUrl to mapper
content = content.replace(
    /thumbnailUrl: data\.thumbnailUrl,/,
    "previewUrl: data.previewUrl,\n                                thumbnailUrl: data.thumbnailUrl,"
);

// We need to use previewUrl in the lightbox (modal).
// Currently it's using src={visibleTattoos[activeTattooIndex].src}
content = content.replace(
    /src=\{visibleTattoos\[activeTattooIndex\]\.src\}/g,
    "src={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].src}"
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched ArtistProfile sizes successfully!");
