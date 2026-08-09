import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const match = `                        if (finalPhotos.length < 12) {
                            const limitedFallback = DEMO_FALLBACK_PHOTOS.slice(0, 12 - finalPhotos.length);
                            const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                            const addedFallbackPhotos = limitedFallback.filter(f => !finalPhotos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id));
                            finalPhotos = [...finalPhotos, ...addedFallbackPhotos];
                        }
                        
                        setAllTattoos(finalPhotos);`;

const replace = `                        if (finalPhotos.length < 12) {
                            const limitedFallback = DEMO_FALLBACK_PHOTOS.slice(0, 12 - finalPhotos.length);
                            const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                            const addedFallbackPhotos = limitedFallback.filter(f => !finalPhotos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id));
                            finalPhotos = [...finalPhotos, ...addedFallbackPhotos];
                        }
                        
                        if (snap.docs.length > 0) {
                            setLastDoc(snap.docs[snap.docs.length - 1]);
                            setHasMore(snap.docs.length >= 12);
                        } else {
                            setHasMore(false);
                        }
                        
                        setAllTattoos(finalPhotos);`;

code = code.replace(match, replace);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
