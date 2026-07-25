const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// 1. Add global cache
const imports = "import { createThumbnail } from '../lib/imageUtils';";
const globalCache = "import { createThumbnail } from '../lib/imageUtils';\n\nlet globalCachedPhotos: any[] | null = null;";
content = content.replace(imports, globalCache);

// 2. Modify fetchPhotos to use cache
const oldFetchPhotos = `    const fetchPhotos = async (userUid: string) => {
            let artistUid = userUid || 'anonymous_demo';
            try {`;
const newFetchPhotos = `    const fetchPhotos = async (userUid: string) => {
            if (globalCachedPhotos) {
                setExistingPhotos(globalCachedPhotos);
                return;
            }
            let artistUid = userUid || 'anonymous_demo';
            try {`;
content = content.replace(oldFetchPhotos, newFetchPhotos);

// 3. Update global cache after fetching
const oldSetPhotos = `                setExistingPhotos([...photos, ...fallback]);`;
const newSetPhotos = `                const finalPhotos = [...photos, ...fallback];
                setExistingPhotos(finalPhotos);
                globalCachedPhotos = finalPhotos;`;
content = content.replace(oldSetPhotos, newSetPhotos);

// 4. Update global cache on saving edits
const oldSetEditingPhotos = `                    setExistingPhotos(prev => prev.map(p => p.id === editingPhoto.id ? { ...p, ...updatedData } : p));`;
const newSetEditingPhotos = `                    setExistingPhotos(prev => {
                        const newPhotos = prev.map(p => p.id === editingPhoto.id ? { ...p, ...updatedData } : p);
                        globalCachedPhotos = newPhotos;
                        return newPhotos;
                    });`;
content = content.replace(oldSetEditingPhotos, newSetEditingPhotos);

const oldSetEditingPhotosNew = `                    setExistingPhotos(prev => prev.map(p => p.id === editingPhoto.id ? newPhoto : p));`;
const newSetEditingPhotosNew = `                    setExistingPhotos(prev => {
                        const newPhotos = prev.map(p => p.id === editingPhoto.id ? newPhoto : p);
                        globalCachedPhotos = newPhotos;
                        return newPhotos;
                    });`;
content = content.replace(oldSetEditingPhotosNew, newSetEditingPhotosNew);

// 5. Update global cache on new photo
const oldSetNewPhotos = `                setExistingPhotos(prev => [newPhoto, ...prev]);`;
const newSetNewPhotos = `                setExistingPhotos(prev => {
                    const newPhotos = [newPhoto, ...prev];
                    globalCachedPhotos = newPhotos;
                    return newPhotos;
                });`;
content = content.replace(oldSetNewPhotos, newSetNewPhotos);

// 6. Fix handleSaveObra size appending
const oldIsSaving = `        setIsSaving(true);`;
const newIsSaving = `        let finalSize = size.trim();
        if (finalSize && !finalSize.toLowerCase().endsWith('cm')) {
            finalSize += ' cm';
        }
        setIsSaving(true);`;
content = content.replace(oldIsSaving, newIsSaving);

// Replace size with finalSize in updatedData and newPhoto
content = content.replace(
    /size,\s+filters: imageFilters/g,
    `size: finalSize,
                    filters: imageFilters`
);

// 7. Update UI for size input
const oldSizeUI = `<input 
                className="w-full bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-2 py-1.5 transition-colors text-center text-sm" 
                placeholder="15x20" 
                type="text" 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={size}
                onChange={e => setSize(e.target.value)}
            />`;
const newSizeUI = `<div className="relative">
            <input 
                className="w-full bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-2 py-1.5 transition-colors text-center text-sm" 
                placeholder="15x20" 
                type="text" 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={size.replace(/\\s*cm$/i, '')}
                onChange={e => setSize(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-sm text-xs pointer-events-none">cm</span>
            </div>`;
content = content.replace(oldSizeUI, newSizeUI);

// 8. Update grid thumbnail url (reduce loading time)
const oldGalleryImg = `<img 
                        src={photo.url || photo.src} 
                        alt={photo.title || "Tattoo"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ filter: getFilterStyle(photo.filters) }}
                        loading="lazy"
                    />`;
const newGalleryImg = `<img 
                        src={photo.thumbnailUrl || photo.url || photo.src} 
                        alt={photo.title || "Tattoo"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ filter: getFilterStyle(photo.filters) }}
                        loading="lazy"
                    />`;
content = content.replace(oldGalleryImg, newGalleryImg);


fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
