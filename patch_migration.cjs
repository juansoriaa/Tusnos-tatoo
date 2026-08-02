const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf-8');

const migrationHook = `
    // Background migration of base64 images to Firebase Storage
    useEffect(() => {
        const migrateImages = async () => {
            const photosToMigrate = existingPhotos.filter(p => p.url?.startsWith('data:image') || p.src?.startsWith('data:image') || p.thumbnailUrl?.startsWith('data:image'));
            if (photosToMigrate.length === 0) return;
            
            console.log(\`Found \${photosToMigrate.length} photos to migrate to storage\`);
            
            for (const photo of photosToMigrate) {
                try {
                    const uid = (localStorage.getItem('demoUserId') || auth.currentUser?.uid) || 'anonymous_demo';
                    let newUrl = photo.url || photo.src;
                    let newThumb = photo.thumbnailUrl;
                    
                    if (newUrl?.startsWith('data:image')) {
                        const res = await fetch(newUrl);
                        const blob = await res.blob();
                        const sRef = ref(storage, \`users/\${uid}/photos/\${photo.id}_full.webp\`);
                        await uploadBytes(sRef, blob, { contentType: 'image/webp' });
                        newUrl = await getDownloadURL(sRef);
                    }
                    
                    if (newThumb?.startsWith('data:image')) {
                        const res = await fetch(newThumb);
                        const blob = await res.blob();
                        const sRef = ref(storage, \`users/\${uid}/photos/\${photo.id}_thumb.webp\`);
                        await uploadBytes(sRef, blob, { contentType: 'image/webp' });
                        newThumb = await getDownloadURL(sRef);
                    }
                    
                    await updateDoc(doc(db, 'photos', photo.id), {
                        url: newUrl,
                        src: newUrl,
                        thumbnailUrl: newThumb
                    });
                    console.log(\`Migrated photo \${photo.id}\`);
                } catch(e) {
                    console.error(\`Failed to migrate photo \${photo.id}\`, e);
                }
            }
        };
        migrateImages();
    }, [existingPhotos]);
`;

content = content.replace(
    /const trackPhotoClick = \(photoId: string\) => {/g,
    migrationHook + "\n    const trackPhotoClick = (photoId: string) => {"
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
console.log("Patched migration hook successfully!");
