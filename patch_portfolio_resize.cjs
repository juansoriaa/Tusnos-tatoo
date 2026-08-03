const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf-8');

const oldEditingBlock = `                if (selectedFile) {
                    photoDataUrl = await createThumbnail(selectedFile, 1080, 1080);
                    thumbDataUrl = await createThumbnail(selectedFile, 400, 400);
                    
                    // Upload to Firebase Storage
                    try {
                        if (!auth.currentUser) throw new Error('Not authenticated, falling back to base64');
                        const uid = auth.currentUser.uid;
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
                    }
                }`;

const newEditingBlock = `                let previewDataUrl = editingPhoto.previewUrl || editingPhoto.url || editingPhoto.src;
                if (selectedFile) {
                    photoDataUrl = await createThumbnail(selectedFile, 1920, 1920);
                    previewDataUrl = await createThumbnail(selectedFile, 800, 800);
                    thumbDataUrl = await createThumbnail(selectedFile, 400, 400);
                    
                    // Upload to Firebase Storage
                    try {
                        if (!auth.currentUser) throw new Error('Not authenticated, falling back to base64');
                        const uid = auth.currentUser.uid;
                        const timestamp = Date.now();
                        
                        // Convert base64 to blob
                        const base64Response = await fetch(photoDataUrl);
                        const blob = await base64Response.blob();
                        const storageRef = ref(storage, \`users/\${uid}/photos/\${timestamp}_full.webp\`);
                        await uploadBytes(storageRef, blob, { contentType: 'image/webp' });
                        photoDataUrl = await getDownloadURL(storageRef);
                        
                        const previewResponse = await fetch(previewDataUrl);
                        const previewBlob = await previewResponse.blob();
                        const previewRef = ref(storage, \`users/\${uid}/photos/\${timestamp}_preview.webp\`);
                        await uploadBytes(previewRef, previewBlob, { contentType: 'image/webp' });
                        previewDataUrl = await getDownloadURL(previewRef);

                        const thumbResponse = await fetch(thumbDataUrl);
                        const thumbBlob = await thumbResponse.blob();
                        const thumbRef = ref(storage, \`users/\${uid}/photos/\${timestamp}_thumb.webp\`);
                        await uploadBytes(thumbRef, thumbBlob, { contentType: 'image/webp' });
                        thumbDataUrl = await getDownloadURL(thumbRef);
                    } catch (err) {
                        console.error('Error uploading to storage, falling back to base64', err);
                    }
                }`;

content = content.replace(oldEditingBlock, newEditingBlock);

// Also need to add previewDataUrl to updatedData
content = content.replace(
`                const updatedData = {
                    url: photoDataUrl,
                    thumbnailUrl: thumbDataUrl,`,
`                const updatedData = {
                    url: photoDataUrl,
                    previewUrl: previewDataUrl,
                    thumbnailUrl: thumbDataUrl,`
);

const oldNewBlock = `            } else {
                const photoDataUrl = await createThumbnail(selectedFile, 1080, 1080);
                const thumbDataUrl = await createThumbnail(selectedFile, 400, 400);

                const newPhotoRef = await addDoc(collection(db, 'photos'), {
                    url: photoDataUrl,
                    thumbnailUrl: thumbDataUrl,`;

const newNewBlock = `            } else {
                let photoDataUrl = await createThumbnail(selectedFile, 1920, 1920);
                let previewDataUrl = await createThumbnail(selectedFile, 800, 800);
                let thumbDataUrl = await createThumbnail(selectedFile, 400, 400);

                // Upload to Firebase Storage
                try {
                    if (!auth.currentUser) throw new Error('Not authenticated, falling back to base64');
                    const uid = auth.currentUser.uid;
                    const timestamp = Date.now();
                    
                    const base64Response = await fetch(photoDataUrl);
                    const blob = await base64Response.blob();
                    const storageRef = ref(storage, \`users/\${uid}/photos/\${timestamp}_full.webp\`);
                    await uploadBytes(storageRef, blob, { contentType: 'image/webp' });
                    photoDataUrl = await getDownloadURL(storageRef);
                    
                    const previewResponse = await fetch(previewDataUrl);
                    const previewBlob = await previewResponse.blob();
                    const previewRef = ref(storage, \`users/\${uid}/photos/\${timestamp}_preview.webp\`);
                    await uploadBytes(previewRef, previewBlob, { contentType: 'image/webp' });
                    previewDataUrl = await getDownloadURL(previewRef);

                    const thumbResponse = await fetch(thumbDataUrl);
                    const thumbBlob = await thumbResponse.blob();
                    const thumbRef = ref(storage, \`users/\${uid}/photos/\${timestamp}_thumb.webp\`);
                    await uploadBytes(thumbRef, thumbBlob, { contentType: 'image/webp' });
                    thumbDataUrl = await getDownloadURL(thumbRef);
                } catch (err) {
                    console.error('Error uploading to storage, falling back to base64', err);
                }

                const newPhotoRef = await addDoc(collection(db, 'photos'), {
                    url: photoDataUrl,
                    previewUrl: previewDataUrl,
                    thumbnailUrl: thumbDataUrl,`;

content = content.replace(oldNewBlock, newNewBlock);

const oldNewPhotoObj = `                const newPhoto = {
                    id: newPhotoRef.id,
                    url: photoDataUrl,
                    thumbnailUrl: thumbDataUrl,`;

const newNewPhotoObj = `                const newPhoto = {
                    id: newPhotoRef.id,
                    url: photoDataUrl,
                    previewUrl: previewDataUrl,
                    thumbnailUrl: thumbDataUrl,`;

content = content.replace(oldNewPhotoObj, newNewPhotoObj);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
console.log("Patched DemoPortfolio sizes successfully!");
