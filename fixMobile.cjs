const fs = require('fs');

// 1. Remove syncFromStorage from DemoDashboard.tsx
let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

file = file.replace(
    /useEffect\(\(\) => \{\n\s*const syncFromStorage = \(\) => \{[\s\S]*?window\.removeEventListener\('focus', syncFromStorage\);\n\s*\};\n\s*\}, \[\]\);/,
    `// removed syncFromStorage to prevent focus events from wiping unsaved changes on mobile`
);

// 2. Add onError to avatar img tag
file = file.replace(
    /<img className="w-full h-full object-cover" src=\{avatarUrl \|\| undefined\} \/>/,
    `<img className="w-full h-full object-cover" src={avatarUrl || undefined} onError={(e) => e.currentTarget.src = defaultAvatar} />`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);

// 3. Fix SuperAdmin.tsx broken URLs for new accounts
let superAdmin = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

superAdmin = superAdmin.replace(
    /profilePhotoUrl: "https:\/\/lh3\.googleusercontent\.com\/[^"]+",/,
    `profilePhotoUrl: "/default-avatar.png",`
);

superAdmin = superAdmin.replace(
    /backgroundPhotos: \[\s*"https:\/\/lh3\.googleusercontent\.com\/[^"]+",\s*"https:\/\/lh3\.googleusercontent\.com\/[^"]+"\s*\],/,
    `backgroundPhotos: [\n              "/default-banner.jpg"\n          ],`
);

fs.writeFileSync('src/components/SuperAdmin.tsx', superAdmin);

console.log('Fixed focus bug and broken fallback URLs');
