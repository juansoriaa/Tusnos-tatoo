import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `                                        finalPhotos.unshift({
                                            id: pDoc.id,
                                            src: pData.url || pData.imageUrl || pData.src,
                                            alt: pData.alt || pData.title || '',
                                            title: pData.title || '',
                                            categories: pData.tags || pData.categories || [],
                                            hours: pData.hours || 0,
                                            sessions: pData.sessions || 1,
                                            size: pData.size || '',
                                            pinnedOrder: pData.pinnedOrder
                                        });`;

const replacement = `                                        finalPhotos.unshift({
                                            id: pDoc.id,
                                            src: pData.url || pData.imageUrl || pData.src,
                                            previewUrl: pData.previewUrl,
                                            thumbnailUrl: pData.thumbnailUrl,
                                            alt: pData.alt || pData.title || '',
                                            title: pData.title || '',
                                            categories: pData.tags || pData.categories || [],
                                            hours: pData.hours || 0,
                                            sessions: pData.sessions || 1,
                                            size: pData.size || '',
                                            pinnedOrder: pData.pinnedOrder
                                        });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
