const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const getFilterStyleCode = `    const getFilterStyle = (filters: any) => {
        if (!filters) return '';
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
        return filterStr.trim();
    };`;

const insertAfter = `    const hasChanges = () => {`;
if (!content.includes('getFilterStyle(')) {
    content = content.replace(insertAfter, getFilterStyleCode + '\n\n' + insertAfter);
}


const oldModalImg = `<img 
                                src={selectedGalleryPhoto.url || selectedGalleryPhoto.src} 
                                alt={selectedGalleryPhoto.title} 
                                className="w-full h-full object-cover"
                            />`;
const newModalImg = `<img 
                                src={selectedGalleryPhoto.url || selectedGalleryPhoto.src} 
                                alt={selectedGalleryPhoto.title} 
                                className="w-full h-full object-cover"
                                style={{ filter: getFilterStyle(selectedGalleryPhoto.filters) }}
                            />`;

content = content.replace(oldModalImg, newModalImg);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
