const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const analyticsFn = `
    const trackPhotoClick = (photoId: string) => {
        try {
            const stats = JSON.parse(localStorage.getItem('photoStats') || '{}');
            if (!stats[photoId]) stats[photoId] = 0;
            stats[photoId] += 1;
            localStorage.setItem('photoStats', JSON.stringify(stats));
        } catch(e) {}
    };
`;

const stateDeclarationRegex = /    const \[filterCategory, setFilterCategory\] = useState\('all'\);/;
content = content.replace(stateDeclarationRegex, "    const [filterCategory, setFilterCategory] = useState('all');\n" + analyticsFn);


// Find onClick={() => { setSelectedGalleryPhoto(photo);
content = content.replace(
    /onClick=\{\(\) => \{\n\s*setSelectedGalleryPhoto\(photo\);/g, 
    "onClick={() => {\n                            trackPhotoClick(photo.id);\n                            setSelectedGalleryPhoto(photo);"
);

// Find navigation clicks (previous)
content = content.replace(
    /if \(currentIndex > 0\) \{\n\s*setSelectedGalleryPhoto\(filteredPhotos\[currentIndex - 1\]\);\n\s*\}/g,
    "if (currentIndex > 0) {\n                                        const nextPhoto = filteredPhotos[currentIndex - 1];\n                                        trackPhotoClick(nextPhoto.id);\n                                        setSelectedGalleryPhoto(nextPhoto);\n                                    }"
);

// Find navigation clicks (next)
content = content.replace(
    /if \(currentIndex < filteredPhotos\.length - 1\) \{\n\s*setSelectedGalleryPhoto\(filteredPhotos\[currentIndex \+ 1\]\);\n\s*\}/g,
    "if (currentIndex < filteredPhotos.length - 1) {\n                                        const nextPhoto = filteredPhotos[currentIndex + 1];\n                                        trackPhotoClick(nextPhoto.id);\n                                        setSelectedGalleryPhoto(nextPhoto);\n                                    }"
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
