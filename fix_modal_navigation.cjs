const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldModalContent = `                            <button 
                                onClick={() => setSelectedGalleryPhoto(null)}
                                className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>

                            <div className="absolute bottom-4 left-4 right-4">`;

const newModalContent = `                            <button 
                                onClick={() => setSelectedGalleryPhoto(null)}
                                className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full p-1 hover:bg-black/80 transition-colors z-30"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>

                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const filteredPhotos = existingPhotos.filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase()));
                                    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedGalleryPhoto.id);
                                    if (currentIndex > 0) {
                                        setSelectedGalleryPhoto(filteredPhotos[currentIndex - 1]);
                                    }
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/80 transition-colors z-30 flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const filteredPhotos = existingPhotos.filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase()));
                                    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedGalleryPhoto.id);
                                    if (currentIndex < filteredPhotos.length - 1) {
                                        setSelectedGalleryPhoto(filteredPhotos[currentIndex + 1]);
                                    }
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/80 transition-colors z-30 flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-[24px]">chevron_right</span>
                            </button>

                            <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none">`;

content = content.replace(oldModalContent, newModalContent);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
