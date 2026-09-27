const fs = require('fs');

let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Replace the upload blocks
// The first block is inside `if (editingPhoto)`:
file = file.replace(/const base64Response = await fetch\(photoDataUrl\);[\s\S]*?thumbDataUrl = await getDownloadURL\(thumbRef\);/g, `
// Upload to ImgBB instead of Firebase Storage
const result = await uploadToImgBB(selectedFile);
photoDataUrl = result.url;
previewDataUrl = result.url; // ImgBB handles optimization
thumbDataUrl = result.thumbUrl;
`);

// Also remove the `import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';` if it's there
// Actually, let's just do it directly. Let's fix the modal color too.
// Modal color: The user says "el modal que tiene un color rosa que no me gusta adapta el modal al color verde esmeraldo profundo".
// The Error modal in DemoPortfolio has a red/pink background?
// Or is it the PhotoUploader modal?
fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
console.log('Patched upload logic');
