const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// 1. Add originalFallbackId to new docs created from fallbacks
const oldFallbackSave = `                if (editingPhoto.id.startsWith('fallback_')) {
                    const newPhotoRef = await addDoc(collection(db, 'photos'), {
                        ...updatedData,
                        createdBy: auth.currentUser?.uid || 'anonymous_demo',
                        createdAt: serverTimestamp()
                    });
                    
                    const newPhoto = { id: newPhotoRef.id, ...updatedData, createdBy: auth.currentUser?.uid || 'anonymous_demo' };
                    setExistingPhotos(prev => {
                        const newPhotos = prev.map(p => p.id === editingPhoto.id ? newPhoto : p);
                        globalCachedPhotos = newPhotos;
                        return newPhotos;
                    });
                } else {`;

const newFallbackSave = `                if (editingPhoto.id.startsWith('fallback_')) {
                    const newPhotoRef = await addDoc(collection(db, 'photos'), {
                        ...updatedData,
                        originalFallbackId: editingPhoto.id,
                        createdBy: auth.currentUser?.uid || 'anonymous_demo',
                        createdAt: serverTimestamp()
                    });
                    
                    const newPhoto = { id: newPhotoRef.id, originalFallbackId: editingPhoto.id, ...updatedData, createdBy: auth.currentUser?.uid || 'anonymous_demo' };
                    setExistingPhotos(prev => {
                        const newPhotos = prev.map(p => p.id === editingPhoto.id ? newPhoto : p);
                        globalCachedPhotos = newPhotos;
                        return newPhotos;
                    });
                } else {`;

content = content.replace(oldFallbackSave, newFallbackSave);

// 2. Filter fallback array in fetchPhotos
const oldFetchSet = `                const finalPhotos = [...photos, ...fallback];`;
const newFetchSet = `                const finalPhotos = [
                    ...photos,
                    ...fallback.filter(f => !photos.some(p => p.originalFallbackId === f.id))
                ];`;
content = content.replace(oldFetchSet, newFetchSet);


// 3. Add originalFallbackId to the deleted list in local storage? If they delete a fallback photo, it comes back on refresh!
// The user says "al igual cuando elimina una foto desde la galería existente qué no quede rastro de esta imagen eliminada"
// We can use localStorage to keep track of deleted fallbacks.
const oldDeleteFunc = `    const handleDeletePhoto = async () => {
        if (!photoToDelete) return;
        try {
            if (!photoToDelete.id.startsWith('fallback_')) {
                await deleteDoc(doc(db, 'photos', photoToDelete.id));
            }
            setExistingPhotos(prev => {`;

const newDeleteFunc = `    const handleDeletePhoto = async () => {
        if (!photoToDelete) return;
        try {
            if (!photoToDelete.id.startsWith('fallback_')) {
                await deleteDoc(doc(db, 'photos', photoToDelete.id));
            } else {
                const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                deletedFallbacks.push(photoToDelete.id);
                localStorage.setItem('deletedFallbacks', JSON.stringify(deletedFallbacks));
            }
            setExistingPhotos(prev => {`;

content = content.replace(oldDeleteFunc, newDeleteFunc);

const oldFetchSet2 = `                const finalPhotos = [
                    ...photos,
                    ...fallback.filter(f => !photos.some(p => p.originalFallbackId === f.id))
                ];`;

const newFetchSet2 = `                const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                const finalPhotos = [
                    ...photos,
                    ...fallback.filter(f => !photos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id))
                ];`;

content = content.replace(oldFetchSet2, newFetchSet2);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
