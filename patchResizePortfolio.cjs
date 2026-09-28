const fs = require('fs');

let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const applyFiltersFuncFixed = `
const applyFiltersToFile = async (file: File, filters: any): Promise<File> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            const MAX_DIMENSION = 1920;
            
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width > height) {
                    height = Math.round((height * MAX_DIMENSION) / width);
                    width = MAX_DIMENSION;
                } else {
                    width = Math.round((width * MAX_DIMENSION) / height);
                    height = MAX_DIMENSION;
                }
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(file);
            
            let filterStr = '';
            if (filters) {
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
            }
            
            if (filterStr) {
                ctx.filter = filterStr.trim();
            }
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const newFile = new File([blob], file.name || 'image.jpg', { type: 'image/jpeg' });
                    resolve(newFile);
                } else {
                    resolve(file);
                }
            }, 'image/jpeg', 0.85);
        };
        img.onerror = () => resolve(file);
        img.src = URL.createObjectURL(file);
    });
};
`;

// Replace the old applyFiltersToFile with the fixed one that scales down
file = file.replace(/const applyFiltersToFile = async[\s\S]*?img\.src = URL\.createObjectURL\(file\);\s*\}\);\s*\};/, applyFiltersFuncFixed.trim());

// Also remove leftover calls to createThumbnail that might have been partially matched previously, just in case
file = file.replace(/let previewDataUrl = await createThumbnail\(selectedFile, 800, 800\);/g, '');
file = file.replace(/let thumbDataUrl = await createThumbnail\(selectedFile, 400, 400\);/g, '');


fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
console.log('Patched DemoPortfolio with resize logic!');
