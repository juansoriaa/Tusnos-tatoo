const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const regex = /let finalPhotos = dbPhotos\.map\(p => \(\{\s*id: p\.id,\s*imageUrl: p\.imageUrl \|\| p\.src,\s*title: p\.title \|\| p\.tags\?\.\[0\] \|\| 'Foto de Tatuaje',\s*category: p\.category \|\| p\.tags\?\.\[0\] \|\| 'Portfolio',\s*clicks: p\.clicks \|\| 0\s*\}\)\);/;

const replacement = `let finalPhotos = dbPhotos.map(p => ({
                    id: p.id,
                    imageUrl: p.imageUrl || p.src,
                    title: p.title || p.tags?.[0] || 'Foto de Tatuaje',
                    category: p.category || p.tags?.[0] || 'Portfolio',
                    clicks: p.clicks || 0,
                    originalFallbackId: p.originalFallbackId
                }));
                
                if (isDemoUser) {
                    const limitedFallback = fallback.slice(0, 5);
                    const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                    const filteredFallback = limitedFallback.filter(f => !dbPhotos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id));
                    finalPhotos = [...finalPhotos, ...filteredFallback.map(f => ({
                        id: f.id,
                        imageUrl: f.imageUrl,
                        title: f.title,
                        category: f.category,
                        clicks: 0
                    }))];
                }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/DemoMetrics.tsx', code);
