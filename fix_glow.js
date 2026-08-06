import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `                {/* Ambient Smart Glow */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-25 blur-[2rem] md:blur-[4rem] scale-110 pointer-events-none animate-pulse duration-3000">
                  <OptimizedImage 
                    key={\`glow-\${visibleTattoos[activeTattooIndex].id}\`}
                    alt="" 
                    className="w-full h-full object-cover animate-fade-in opacity-50" 
                    lowResUrl={visibleTattoos[activeTattooIndex].thumbnailUrl}
                    highResUrl={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].src} 
                    style={{ filter: getFilterStr(visibleTattoos[activeTattooIndex].filters) }}
                  />
                </div>`;

code = code.replace(target, "");
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
