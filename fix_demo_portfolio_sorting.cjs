const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldGalleryGridStart = `{/* Gallery Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            
            {existingPhotos.filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase())).map((photo, index) => {`;

const newGalleryGridStart = `{/* Gallery Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            
            {[...existingPhotos].sort((a, b) => {
                const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                if (aPinned) return -1;
                if (bPinned) return 1;
                return 0;
            }).filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase())).map((photo, index) => {`;

content = content.replace(oldGalleryGridStart, newGalleryGridStart);

const oldNavPrev = `const filteredPhotos = existingPhotos.filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase()));`;
const newNavPrev = `const filteredPhotos = [...existingPhotos].sort((a, b) => {
                                        const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                                        const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                                        if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                                        if (aPinned) return -1;
                                        if (bPinned) return 1;
                                        return 0;
                                    }).filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase()));`;

// This replaces both occurrences since they are identical
content = content.replaceAll(oldNavPrev, newNavPrev);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
