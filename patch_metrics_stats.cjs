const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /let finalPhotos = dbPhotos\.map\(p => \(\{\n.*?id: p\.id,\n.*?imageUrl: p\.imageUrl \|\| p\.src,\n.*?title: p\.title \|\| p\.tags\?\.\[0\] \|\| 'Foto de Tatuaje',\n.*?category: p\.category \|\| p\.tags\?\.\[0\] \|\| 'Portfolio'\n.*?}\)\);\n\s*const stats = JSON\.parse\(localStorage\.getItem\('photoStats'\) \|\| '\{\}'\);\n\s*const photosWithStats = finalPhotos\.map\(photo => \(\{\n.*?\.\.\.photo,\n.*?clicks: stats\[photo\.id\] \|\| 0.*?\n.*?}\)\);\n\s*photosWithStats\.sort\(\(a, b\) => b\.clicks - a\.clicks\);\n\s*setTopPhotos\(photosWithStats\.slice\(0, 10\)\);/s,
    `let finalPhotos = dbPhotos.map(p => ({
                    id: p.id,
                    imageUrl: p.imageUrl || p.src,
                    title: p.title || p.tags?.[0] || 'Foto de Tatuaje',
                    category: p.category || p.tags?.[0] || 'Portfolio',
                    clicks: p.clicks || 0
                }));
                finalPhotos.sort((a, b) => b.clicks - a.clicks);
                setTopPhotos(finalPhotos.slice(0, 10));`
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
