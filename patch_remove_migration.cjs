const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf-8');

const regex = /\/\/ Background migration of base64 images to Firebase Storage[\s\S]*?migrateImages\(\);\n    \}, \[existingPhotos\]\);/m;

if (regex.test(content)) {
    content = content.replace(regex, "");
    fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
    console.log("Removed migration script.");
} else {
    console.log("Could not find migration script.");
}
