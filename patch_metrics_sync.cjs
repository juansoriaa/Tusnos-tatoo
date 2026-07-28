const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /parsed = \{\s*views: data\.views \|\| 0,\s*photoClicks: data\.photoClicks \|\| 0,\s*whatsappClicks: data\.whatsappClicks \|\| 0,\s*agendaClicks: data\.agendaClicks \|\| 0\s*\};/,
    `parsed = {
                                views: data.views || 0,
                                whatsappClicks: data.whatsappClicks || 0,
                                agendaClicks: data.agendaClicks || 0
                            };`
);

code = code.replace(
    /return parsed;/,
    `return { ...prev, ...parsed };`
);

code = code.replace(
    /let finalPhotos = dbPhotos\.map\(p => \(\{\s*id: p\.id,\s*imageUrl: p\.imageUrl \|\| p\.src,\s*title: p\.title \|\| p\.tags\?\.\[0\] \|\| 'Foto de Tatuaje',\s*category: p\.category \|\| p\.tags\?\.\[0\] \|\| 'Portfolio',\s*clicks: p\.clicks \|\| 0,\s*originalFallbackId: p\.originalFallbackId\s*\}\)\);/,
    `let totalPhotoClicks = 0;
                let finalPhotos = dbPhotos.map(p => {
                    const clicks = p.clicks || 0;
                    totalPhotoClicks += clicks;
                    return {
                        id: p.id,
                        imageUrl: p.imageUrl || p.src,
                        title: p.title || p.tags?.[0] || 'Foto de Tatuaje',
                        category: p.category || p.tags?.[0] || 'Portfolio',
                        clicks: clicks,
                        originalFallbackId: p.originalFallbackId
                    };
                });
                setMetrics(prev => ({ ...prev, photoClicks: totalPhotoClicks }));`
);

code = code.replace(/<div className="flex-1 overflow-y-auto p-5 hide-scrollbar">/g, '<div className="flex-1 overflow-y-auto p-5 custom-scrollbar">');

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
