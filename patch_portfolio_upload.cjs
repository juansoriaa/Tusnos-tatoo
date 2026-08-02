const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf-8');

// replace createThumbnail to upload to storage
content = content.replace(
    /photoDataUrl = await createThumbnail\(selectedFile, 1080, 1080\);\n\s*thumbDataUrl = await createThumbnail\(selectedFile, 400, 400\);/g,
    `photoDataUrl = await createThumbnail(selectedFile, 1080, 1080);
                    thumbDataUrl = await createThumbnail(selectedFile, 400, 400);
                    
                    // Upload to Firebase Storage
                    try {
                        const uid = (localStorage.getItem('demoUserId') || auth.currentUser?.uid) || 'anonymous_demo';
                        const timestamp = Date.now();
                        
                        // Convert base64 to blob
                        const base64Response = await fetch(photoDataUrl);
                        const blob = await base64Response.blob();
                        const storageRef = ref(storage, \`users/\${uid}/photos/\${timestamp}_full.webp\`);
                        await uploadBytes(storageRef, blob, { contentType: 'image/webp' });
                        photoDataUrl = await getDownloadURL(storageRef);
                        
                        const thumbResponse = await fetch(thumbDataUrl);
                        const thumbBlob = await thumbResponse.blob();
                        const thumbRef = ref(storage, \`users/\${uid}/photos/\${timestamp}_thumb.webp\`);
                        await uploadBytes(thumbRef, thumbBlob, { contentType: 'image/webp' });
                        thumbDataUrl = await getDownloadURL(thumbRef);
                    } catch (err) {
                        console.error('Error uploading to storage, falling back to base64', err);
                    }`
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
console.log("Patched DemoPortfolio upload successfully!");
