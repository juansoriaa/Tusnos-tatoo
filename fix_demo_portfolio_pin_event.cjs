const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldTogglePin = `                setExistingPhotos(prev => {
                    const newPhotos = prev.map(p => {
                        if (p.id === photo.id) return { ...p, pinnedOrder: null };
                        const pinnedIndex = updatedPinned.findIndex(up => up.id === p.id);
                        if (pinnedIndex !== -1) return { ...p, pinnedOrder: pinnedIndex + 1 };
                        return p;
                    });
                    globalCachedPhotos = newPhotos;
                    return newPhotos;
                });
            } else {`;

const newTogglePin = `                setExistingPhotos(prev => {
                    const newPhotos = prev.map(p => {
                        if (p.id === photo.id) return { ...p, pinnedOrder: null };
                        const pinnedIndex = updatedPinned.findIndex(up => up.id === p.id);
                        if (pinnedIndex !== -1) return { ...p, pinnedOrder: pinnedIndex + 1 };
                        return p;
                    });
                    globalCachedPhotos = newPhotos;
                    return newPhotos;
                });
                
                if (photo.id.startsWith('fallback_')) {
                    const pinnedFallbacks = JSON.parse(localStorage.getItem('pinnedFallbacks') || '{}');
                    delete pinnedFallbacks[photo.id];
                    
                    updatedPinned.forEach((p, index) => {
                        if (p.id.startsWith('fallback_')) {
                            pinnedFallbacks[p.id] = index + 1;
                        }
                    });
                    localStorage.setItem('pinnedFallbacks', JSON.stringify(pinnedFallbacks));
                }
                
                window.dispatchEvent(new CustomEvent('profileDataChanged'));
            } else {`;
content = content.replace(oldTogglePin, newTogglePin);

const oldTogglePin2 = `                setExistingPhotos(prev => {
                    const newPhotos = prev.map(p => p.id === photo.id ? { ...p, pinnedOrder: newOrder } : p);
                    globalCachedPhotos = newPhotos;
                    return newPhotos;
                });
            }
        } catch (error) {`;

const newTogglePin2 = `                setExistingPhotos(prev => {
                    const newPhotos = prev.map(p => p.id === photo.id ? { ...p, pinnedOrder: newOrder } : p);
                    globalCachedPhotos = newPhotos;
                    return newPhotos;
                });
                
                if (photo.id.startsWith('fallback_')) {
                    const pinnedFallbacks = JSON.parse(localStorage.getItem('pinnedFallbacks') || '{}');
                    pinnedFallbacks[photo.id] = newOrder;
                    localStorage.setItem('pinnedFallbacks', JSON.stringify(pinnedFallbacks));
                }
                
                window.dispatchEvent(new CustomEvent('profileDataChanged'));
            }
        } catch (error) {`;

content = content.replace(oldTogglePin2, newTogglePin2);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
