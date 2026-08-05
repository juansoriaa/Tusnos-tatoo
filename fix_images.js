import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const targetGrid = `<OptimizedImage 
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer object-cover aspect-square" 
                  alt={tattoo.alt} 
                  onClick={() => openModal(index)} 
                  lowResUrl={tattoo.thumbnailUrl}
                  highResUrl={tattoo.thumbnailUrl || tattoo.previewUrl || tattoo.src} 
                  style={{ filter: getFilterStr(tattoo.filters) }}
                />`;

const replacementGrid = `<OptimizedImage 
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer object-cover aspect-square" 
                  alt={tattoo.alt} 
                  onClick={() => openModal(index)} 
                  lowResUrl={tattoo.thumbnailUrl}
                  highResUrl={tattoo.thumbnailUrl || tattoo.previewUrl || tattoo.src} 
                  style={{ filter: getFilterStr(tattoo.filters) }}
                  useIntersectionObserver={true}
                />`;

const targetModalGlow = `<OptimizedImage 
                    key={\`glow-\${visibleTattoos[activeTattooIndex].id}\`}
                    alt="" 
                    className="w-full h-full object-cover animate-fade-in opacity-50" 
                    highResUrl={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].src} 
                    style={{ filter: getFilterStr(visibleTattoos[activeTattooIndex].filters) }}
                  />`;

const replacementModalGlow = `<OptimizedImage 
                    key={\`glow-\${visibleTattoos[activeTattooIndex].id}\`}
                    alt="" 
                    className="w-full h-full object-cover animate-fade-in opacity-50" 
                    lowResUrl={visibleTattoos[activeTattooIndex].thumbnailUrl}
                    highResUrl={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].src} 
                    style={{ filter: getFilterStr(visibleTattoos[activeTattooIndex].filters) }}
                  />`;

code = code.replace(targetGrid, replacementGrid).replace(targetModalGlow, replacementModalGlow);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
