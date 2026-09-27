const fs = require('fs');

let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Replace error modal colors
file = file.replace(/border-error\/30/g, 'border-primary/50');
file = file.replace(/text-error/g, 'text-primary');

// Replace uploadBytes fallback logic with ImgBB
// Locate the `isRealUser` catch block and the `const base64Response = await fetch(photoDataUrl);` blocks
file = file.replace(/const base64Response = await fetch\(photoDataUrl\);[\s\S]*?thumbDataUrl = await getDownloadURL\(thumbRef\);/g, `
// Upload to ImgBB instead of Firebase Storage
const result = await uploadToImgBB(selectedFile);
photoDataUrl = result.url;
previewDataUrl = result.url; // ImgBB handles optimization
thumbDataUrl = result.thumbUrl;
`);

fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
console.log('Patched colors and upload logic!');
