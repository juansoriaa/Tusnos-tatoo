const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const oldFallbackArray = `const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
            const allTatts = [
                ...photos,
                ...fallback.filter(f => !photos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id))
            ];`;

const newFallbackArray = `const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
            const pinnedFallbacks = JSON.parse(localStorage.getItem('pinnedFallbacks') || '{}');
            const allTatts = [
                ...photos,
                ...fallback
                    .filter(f => !photos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id))
                    .map(f => ({ ...f, pinnedOrder: pinnedFallbacks[f.id] || null }))
            ];`;

content = content.replace(oldFallbackArray, newFallbackArray);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

let portfolioContent = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');
const oldPortfolioFallbackArray = `const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                const finalPhotos = [
                    ...photos,
                    ...fallback.filter(f => !photos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id))
                ];`;

const newPortfolioFallbackArray = `const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                const pinnedFallbacks = JSON.parse(localStorage.getItem('pinnedFallbacks') || '{}');
                const finalPhotos = [
                    ...photos,
                    ...fallback
                        .filter(f => !photos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id))
                        .map(f => ({ ...f, pinnedOrder: pinnedFallbacks[f.id] || null }))
                ];`;
portfolioContent = portfolioContent.replace(oldPortfolioFallbackArray, newPortfolioFallbackArray);
fs.writeFileSync('src/components/DemoPortfolio.tsx', portfolioContent);
