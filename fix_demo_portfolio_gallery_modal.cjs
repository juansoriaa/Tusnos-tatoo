const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// 1. Add new state
const oldState = `const [photoToDelete, setPhotoToDelete] = useState<any>(null);`;
const newState = `const [photoToDelete, setPhotoToDelete] = useState<any>(null);\n    const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<any>(null);\n    const [showHint, setShowHint] = useState(true);`;
content = content.replace(oldState, newState);

// 2. Modify gallery item rendering
const mapStart = `{existingPhotos.filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase())).map(photo => {`;
const mapStartNew = `{existingPhotos.filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase())).map((photo, index) => {`;
content = content.replace(mapStart, mapStartNew);

// Replace card content
const oldCardRegex = /<div key=\{photo\.id\} className="relative group border border-border-muted rounded bg-deep-black aspect-\[4\/5\] overflow-hidden cursor-pointer"[^>]*>[\s\S]*?(?=<\/div>\s*\)\s*\}\)\})/g;

const oldCardMatch = content.match(oldCardRegex);
if(oldCardMatch) {
    const newCard = `<div 
                        key={photo.id} 
                        onClick={() => {
                            setSelectedGalleryPhoto(photo);
                            if (index === 0) setShowHint(false);
                        }}
                        className="relative group border border-border-muted rounded bg-deep-black aspect-[4/5] overflow-hidden cursor-pointer" 
                        style={{borderColor: '#353434', backgroundColor: '#050505'}}
                    >
                        <img 
                            alt={photo.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale hover:grayscale-0" 
                            src={photo.thumbnailUrl || photo.url} 
                            style={{ filter: filterStr.trim() }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Indicador de destacado en la galería (solo visual) */}
                        {photo.pinnedOrder && (
                            <div className="absolute top-1 left-1 bg-surface-elevation/80 backdrop-blur-sm border border-emerald-accent rounded-full w-6 h-6 flex items-center justify-center z-10" style={{backgroundColor: 'rgba(20,19,19,0.8)'}}>
                                <span className="font-label-sm text-[10px] font-bold text-emerald-accent">{photo.pinnedOrder}</span>
                            </div>
                        )}

                        {index === 0 && showHint && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] animate-pulse pointer-events-none">
                                <span className="material-symbols-outlined text-white text-3xl mb-2">touch_app</span>
                                <span className="text-white font-label-md text-xs text-center px-4">Click para ver opciones</span>
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="font-headline-md text-xs md:text-sm text-silver-text truncate" style={{color: '#e5e2e1'}}>{photo.title}</h3>
                            <p className="font-label-sm text-emerald-accent uppercase text-[10px]" style={{color: '#054d44'}}>{photo.tags?.[0]}</p>
                        </div>
                    `;
    content = content.replace(oldCardMatch[0], newCard);
}

// 3. Add Modal
const deleteModalMatch = `{photoToDelete && (`;

const galleryModal = `
            {/* Modal de Configuración de Foto */}
            {selectedGalleryPhoto && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }} onClick={() => setSelectedGalleryPhoto(null)}>
                    <div 
                        className="bg-surface-container border border-outline-variant w-full max-w-sm relative flex flex-col overflow-hidden rounded-lg shadow-2xl" 
                        onClick={(e) => e.stopPropagation()}
                        style={{backgroundColor: '#141313', borderColor: '#353434'}}
                    >
                        <div className="relative aspect-square w-full bg-deep-black" style={{backgroundColor: '#050505'}}>
                            <img 
                                src={selectedGalleryPhoto.url || selectedGalleryPhoto.src} 
                                alt={selectedGalleryPhoto.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            
                            <button 
                                onClick={() => setSelectedGalleryPhoto(null)}
                                className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>

                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-headline-md text-lg truncate">{selectedGalleryPhoto.title}</h3>
                                {selectedGalleryPhoto.tags?.[0] && (
                                    <p className="text-emerald-accent font-label-sm uppercase text-xs mt-1" style={{color: '#10b981'}}>{selectedGalleryPhoto.tags[0]}</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 grid grid-cols-3 gap-2">
                            <button 
                                onClick={(e) => {
                                    handleTogglePin(selectedGalleryPhoto, e);
                                    if (selectedGalleryPhoto.pinnedOrder) {
                                        setSelectedGalleryPhoto({...selectedGalleryPhoto, pinnedOrder: null});
                                    } else {
                                        // just visual update for modal until re-opened, or wait for existingPhotos to update
                                    }
                                    setSelectedGalleryPhoto(null);
                                }}
                                className="flex flex-col items-center justify-center p-3 rounded-lg bg-surface-elevation hover:bg-white/5 transition-colors border border-border-muted hover:border-emerald-accent group"
                                style={{backgroundColor: 'rgba(30,30,30,0.5)', borderColor: '#353434'}}
                            >
                                <span className={\`material-symbols-outlined mb-1 text-[20px] transition-colors \${selectedGalleryPhoto.pinnedOrder ? 'text-emerald-accent' : 'text-silver-text group-hover:text-white'}\`}>push_pin</span>
                                <span className="font-label-sm text-[10px] text-silver-text">{selectedGalleryPhoto.pinnedOrder ? 'Quitar Pin' : 'Destacar'}</span>
                            </button>
                            
                            <button 
                                onClick={(e) => {
                                    startEditing(selectedGalleryPhoto);
                                    setSelectedGalleryPhoto(null);
                                }}
                                className="flex flex-col items-center justify-center p-3 rounded-lg bg-surface-elevation hover:bg-white/5 transition-colors border border-border-muted hover:border-emerald-accent group"
                                style={{backgroundColor: 'rgba(30,30,30,0.5)', borderColor: '#353434'}}
                            >
                                <span className="material-symbols-outlined mb-1 text-[20px] text-silver-text group-hover:text-white transition-colors">brush</span>
                                <span className="font-label-sm text-[10px] text-silver-text">Editar</span>
                            </button>
                            
                            <button 
                                onClick={(e) => {
                                    setPhotoToDelete(selectedGalleryPhoto);
                                    setSelectedGalleryPhoto(null);
                                }}
                                className="flex flex-col items-center justify-center p-3 rounded-lg bg-surface-elevation hover:bg-white/5 transition-colors border border-border-muted hover:border-[#b91c1c] group"
                                style={{backgroundColor: 'rgba(30,30,30,0.5)', borderColor: '#353434'}}
                            >
                                <span className="material-symbols-outlined mb-1 text-[20px] text-silver-text group-hover:text-[#b91c1c] transition-colors">delete</span>
                                <span className="font-label-sm text-[10px] text-silver-text">Eliminar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
`;

content = content.replace(deleteModalMatch, galleryModal + deleteModalMatch);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
