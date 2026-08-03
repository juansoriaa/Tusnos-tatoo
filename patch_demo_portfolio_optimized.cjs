const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf-8');

// Add import
if (!content.includes("import { OptimizedImage }")) {
    content = content.replace(/import \{ createThumbnail \} from '\.\.\/lib\/imageUtils';/, "import { createThumbnail } from '../lib/imageUtils';\nimport { OptimizedImage } from './OptimizedImage';");
}

// Replace grid images
const oldGridImg = `<img 
                            alt={photo.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                            src={photo.thumbnailUrl || photo.url || photo.src} 
                            style={{ filter: filterStr.trim() }}
                        />`;
const newGridImg = `<OptimizedImage 
                            alt={photo.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                            highResUrl={photo.thumbnailUrl || photo.previewUrl || photo.url || photo.src} 
                            style={{ filter: filterStr.trim() }}
                            useIntersectionObserver={true}
                        />`;
content = content.replace(oldGridImg, newGridImg);

// Replace selected image
const oldSelectedImg = `<img 
                                src={selectedGalleryPhoto.url || selectedGalleryPhoto.src} 
                                alt={selectedGalleryPhoto.title} 
                                className="w-full h-full object-cover"
                                style={{ filter: getFilterStyle(selectedGalleryPhoto.filters) }}
                            />`;
const newSelectedImg = `<OptimizedImage 
                                lowResUrl={selectedGalleryPhoto.previewUrl || selectedGalleryPhoto.thumbnailUrl}
                                highResUrl={selectedGalleryPhoto.url || selectedGalleryPhoto.src} 
                                alt={selectedGalleryPhoto.title} 
                                className="w-full h-full object-cover"
                                style={{ filter: getFilterStyle(selectedGalleryPhoto.filters) }}
                                useIntersectionObserver={false}
                            />`;
content = content.replace(oldSelectedImg, newSelectedImg);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
console.log("Patched DemoPortfolio with OptimizedImage!");
