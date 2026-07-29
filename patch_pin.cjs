const fs = require('fs');
let code = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Replace handleTogglePin logic to only allow 1 pinned photo
code = code.replace(
    /const handleTogglePin = async \(photo: any, e: React\.MouseEvent\) => \{[\s\S]*?console\.error\("Error toggling pin", error\);\s*\}\s*\};/,
    `const handleTogglePin = async (photo: any, e: React.MouseEvent) => {
        e.stopPropagation();
        
        try {
            const batch = writeBatch(db);
            const pinnedFallbacks = JSON.parse(localStorage.getItem('pinnedFallbacks') || '{}');
            let isUnpinning = typeof photo.pinnedOrder === 'number' && photo.pinnedOrder > 0;
            
            // Unpin all currently pinned photos
            existingPhotos.forEach(p => {
                if (typeof p.pinnedOrder === 'number' && p.pinnedOrder > 0) {
                    if (!p.id.startsWith('fallback_')) {
                        batch.update(doc(db, 'photos', p.id), { pinnedOrder: null });
                    }
                    delete pinnedFallbacks[p.id];
                }
            });

            if (!isUnpinning) {
                // Pin the new one
                if (!photo.id.startsWith('fallback_')) {
                    batch.update(doc(db, 'photos', photo.id), { pinnedOrder: 1 });
                }
                pinnedFallbacks[photo.id] = 1;
            }

            // Commit batch if there's any non-fallback to update
            if (existingPhotos.some(p => !p.id.startsWith('fallback_') && typeof p.pinnedOrder === 'number' && p.pinnedOrder > 0) || (!isUnpinning && !photo.id.startsWith('fallback_'))) {
                await batch.commit();
            }
            
            localStorage.setItem('pinnedFallbacks', JSON.stringify(pinnedFallbacks));
            
            setExistingPhotos(prev => {
                const newPhotos = prev.map(p => {
                    if (isUnpinning && p.id === photo.id) return { ...p, pinnedOrder: null };
                    if (!isUnpinning && p.id === photo.id) return { ...p, pinnedOrder: 1 };
                    return { ...p, pinnedOrder: null };
                });
                globalCachedPhotos = newPhotos;
                return newPhotos;
            });
            
        } catch (error) {
            console.error("Error toggling pin", error);
        }
    };`
);

// Replace visual badge from numbered to star icon
code = code.replace(
    /\{photo\.pinnedOrder && \(\s*<div className="absolute top-1 left-1 bg-surface-elevation\/80 backdrop-blur-sm border border-emerald-accent rounded-full w-6 h-6 flex items-center justify-center z-10" style=\{\{backgroundColor: 'rgba\(20,19,19,0\.8\)'\}\}>\s*<span className="font-label-sm text-\[10px\] font-bold text-emerald-accent">\{photo\.pinnedOrder\}<\/span>\s*<\/div>\s*\)\}/g,
    `{photo.pinnedOrder && (
                            <div className="absolute top-2 left-2 bg-emerald-accent rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-lg" style={{backgroundColor: '#054d44'}}>
                                <span className="material-symbols-outlined text-[14px] text-white">star</span>
                            </div>
                        )}`
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', code);
