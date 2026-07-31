const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

content = content.replace(
    '<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 w-full">',
    '<div className="grid grid-cols-3 gap-2 w-full">'
);

content = content.replace(
    '<div className="aspect-[4/5] bg-surface-container hidden md:block" />',
    '<div className="aspect-square bg-surface-container hidden md:block" />\n                <div className="aspect-square bg-surface-container hidden md:block" />\n                <div className="aspect-square bg-surface-container hidden md:block" />'
);

content = content.replace(
    '<div className="aspect-[4/5] bg-surface-container" />',
    '<div className="aspect-square bg-surface-container" />'
);
content = content.replace(
    '<div className="aspect-[4/5] bg-surface-container" />',
    '<div className="aspect-square bg-surface-container" />'
);
content = content.replace(
    '<div className="aspect-[4/5] bg-surface-container" />',
    '<div className="aspect-square bg-surface-container" />'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
