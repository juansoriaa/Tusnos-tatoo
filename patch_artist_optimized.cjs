const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// Replace ProgressiveImage import with OptimizedImage
content = content.replace(/import \{ ProgressiveImage \} from '\.\/ProgressiveImage';/, "import { OptimizedImage } from './OptimizedImage';");

// Replace grid ProgressiveImage with OptimizedImage
const oldGrid = `<ProgressiveImage 
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer object-cover aspect-square" 
                  alt={tattoo.alt} 
                  onClick={() => openModal(index)} 
                  thumbnailUrl={tattoo.thumbnailUrl}
                  highResUrl={tattoo.thumbnailUrl || tattoo.previewUrl || tattoo.src} 
                />`;
const newGrid = `<OptimizedImage 
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer object-cover aspect-square" 
                  alt={tattoo.alt} 
                  onClick={() => openModal(index)} 
                  highResUrl={tattoo.thumbnailUrl || tattoo.previewUrl || tattoo.src} 
                  useIntersectionObserver={true}
                />`;
content = content.replace(oldGrid, newGrid);

// Replace Modal images
const oldModalGlow = `<img 
                    key={\`glow-\${visibleTattoos[activeTattooIndex].id}\`}
                    alt="" 
                    className="w-full h-full object-cover animate-fade-in opacity-50" 
                    src={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].src} 
                    style={{ filter: getFilterStr(visibleTattoos[activeTattooIndex].filters) }}
                  />`;
const newModalGlow = `<OptimizedImage 
                    key={\`glow-\${visibleTattoos[activeTattooIndex].id}\`}
                    alt="" 
                    className="w-full h-full object-cover animate-fade-in opacity-50" 
                    highResUrl={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].src} 
                    style={{ filter: getFilterStr(visibleTattoos[activeTattooIndex].filters) }}
                  />`;
content = content.replace(oldModalGlow, newModalGlow);

const oldModalImg = `<img 
                  key={visibleTattoos[activeTattooIndex].id}
                  alt={visibleTattoos[activeTattooIndex].alt} 
                  className="max-w-full max-h-[45vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl" 
                  src={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].src} 
                  style={{ filter: getFilterStr(visibleTattoos[activeTattooIndex].filters) }}
                />`;
const newModalImg = `<OptimizedImage 
                  key={visibleTattoos[activeTattooIndex].id}
                  alt={visibleTattoos[activeTattooIndex].alt} 
                  className="max-w-full max-h-[45vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl" 
                  lowResUrl={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].thumbnailUrl}
                  highResUrl={visibleTattoos[activeTattooIndex].src} 
                  style={{ filter: getFilterStr(visibleTattoos[activeTattooIndex].filters) }}
                  useIntersectionObserver={false}
                  loading="eager"
                />`;
content = content.replace(oldModalImg, newModalImg);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched ArtistProfile with OptimizedImage!");
