const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// Replace the main loading condition
content = content.replace(
    'if (isProfileLoading || isTattoosLoading) {',
    'if (isProfileLoading) {'
);

// Add loading grid before visibleTattoos.map
const gridStartStr = '<div className="grid grid-cols-3 gap-2">';
const gridReplacement = `
          {isTattoosLoading ? (
            <div className="grid grid-cols-3 gap-2 w-full animate-pulse">
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
            </div>
          ) : (
          <div className="grid grid-cols-3 gap-2">
`;
content = content.replace('          {/* Masonry Grid */}\n          <div className="grid grid-cols-3 gap-2">', '          {/* Masonry Grid */}\n' + gridReplacement);

// Close the conditional after the grid
const gridEndStr = '          </div>\n\n          <div className="flex justify-center mt-12 gap-4">';
content = content.replace(gridEndStr, '          </div>\n          )}\n\n          <div className="flex justify-center mt-12 gap-4">');

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched layout successfully!");
