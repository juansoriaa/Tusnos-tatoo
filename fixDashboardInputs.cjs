const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// 1. Add onClick to clear input value, ensuring onChange fires even for the same file
file = file.replace(
    /<input type="file" accept="image\/\*" className="hidden" onChange=\{\(e\) => handleFileUpload\(e, setBannerUrl, 'banner'\)\} \/>/g,
    `<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setBannerUrl, 'banner')} onClick={(e) => { (e.target as any).value = ''; }} />`
);

file = file.replace(
    /<input type="file" accept="image\/\*" className="hidden" onChange=\{\(e\) => handleFileUpload\(e, setAvatarUrl, 'avatar'\)\} \/>/g,
    `<input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setAvatarUrl, 'avatar')} onClick={(e) => { (e.target as any).value = ''; }} />`
);

// 2. Add a toast notification when the image finishes uploading successfully
const oldUploadBlock = `const imgbbRes = await uploadToImgBB(resizedFile);
                setUrl(imgbbRes.url);`;
const newUploadBlock = `const imgbbRes = await uploadToImgBB(resizedFile);
                setUrl(imgbbRes.url);
                setToastMessage("¡Imagen subida! No olvides guardar los cambios.");
                setTimeout(() => setToastMessage(null), 3000);`;

file = file.replace(oldUploadBlock, newUploadBlock);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Fixed inputs and added toast to DemoDashboard!');
