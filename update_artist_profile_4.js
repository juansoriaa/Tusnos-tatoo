import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `                        finalPhotos.sort((a, b) => {
                            const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;`;

const replacement = `                        const sharedPhotoId = searchParams.get('obra');
                        if (sharedPhotoId && !finalPhotos.find(p => p.id === sharedPhotoId)) {
                            // Check if it's a fallback photo first
                            const fbMatch = DEMO_FALLBACK_PHOTOS.find(f => f.id === sharedPhotoId);
                            if (fbMatch) {
                                finalPhotos.unshift(fbMatch);
                            } else {
                                try {
                                    const { doc, getDoc } = await import('firebase/firestore');
                                    const pDoc = await getDoc(doc(db, 'photos', sharedPhotoId));
                                    if (pDoc.exists()) {
                                        const pData = pDoc.data();
                                        finalPhotos.unshift({
                                            id: pDoc.id,
                                            src: pData.url || pData.imageUrl || pData.src,
                                            alt: pData.alt || pData.title || '',
                                            title: pData.title || '',
                                            categories: pData.tags || pData.categories || [],
                                            hours: pData.hours || 0,
                                            sessions: pData.sessions || 1,
                                            size: pData.size || '',
                                            pinnedOrder: pData.pinnedOrder
                                        });
                                    }
                                } catch (e) {}
                            }
                        }

                        finalPhotos.sort((a, b) => {
                            const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
