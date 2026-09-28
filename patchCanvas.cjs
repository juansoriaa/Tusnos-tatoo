const fs = require('fs');

let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const applyFiltersFunc = `
const applyFiltersToFile = async (file: File, filters: any): Promise<File> => {
    if (!filters) return file;
    
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(file);
            
            let filterStr = '';
            const { activePreset, contrast, brightness, blackIntensity } = filters;
            const isAnyManualActive = contrast?.active || brightness?.active || blackIntensity?.active;
            if (activePreset && !isAnyManualActive) {
                if (activePreset === 'tinta_negra') filterStr = 'contrast(125%) brightness(95%) grayscale(15%)';
                if (activePreset === 'color') filterStr = 'contrast(110%) brightness(105%) saturate(130%)';
                if (activePreset === 'piel') filterStr = 'contrast(95%) brightness(105%) saturate(90%)';
                if (activePreset === 'blanco_y_negro') filterStr = 'grayscale(100%) contrast(130%)';
            } else {
                if (contrast?.active) filterStr += \`contrast(\${contrast.value * 2}%) \`;
                if (brightness?.active) filterStr += \`brightness(\${brightness.value * 2}%) \`;
                if (blackIntensity?.active) filterStr += \`grayscale(\${blackIntensity.value}%) \`;
            }
            
            if (filterStr) {
                ctx.filter = filterStr.trim();
            }
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const newFile = new File([blob], file.name || 'image.jpg', { type: 'image/jpeg' });
                    resolve(newFile);
                } else {
                    resolve(file);
                }
            }, 'image/jpeg', 0.92);
        };
        img.onerror = () => resolve(file);
        img.src = URL.createObjectURL(file);
    });
};
`;

// Insert the helper function right after imports
file = file.replace(/let globalCachedPhotos:/, applyFiltersFunc + '\nlet globalCachedPhotos:');

// Fix the "Edit Mode" block
file = file.replace(/let photoDataUrl = await createThumbnail\(selectedFile, 1920, 1920\);\s*let previewDataUrl = await createThumbnail\(selectedFile, 800, 800\);\s*let thumbDataUrl = await createThumbnail\(selectedFile, 400, 400\);/g, '');

file = file.replace(/const result = await uploadToImgBB\(selectedFile\);/g, `const finalFile = await applyFiltersToFile(selectedFile, imageFilters);
                        const result = await uploadToImgBB(finalFile);`);

// Since filters are baked in, we should save `filters: null` instead of `filters: imageFilters` for new saves, 
// BUT wait, what if the user wants to re-edit them? If they are baked into the image, re-editing the same image would stack filters.
// If we bake them, we MUST clear them so they don't apply double via CSS.
file = file.replace(/filters: imageFilters/g, 'filters: null');


fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
console.log('Patched canvas filters and removed createThumbnail!');
