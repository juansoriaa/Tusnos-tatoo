const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const oldMerge = `const allTatts = [...photos, ...fallback];`;
const newMerge = `const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
            const allTatts = [
                ...photos,
                ...fallback.filter(f => !photos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id))
            ];`;

content = content.replace(oldMerge, newMerge);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
