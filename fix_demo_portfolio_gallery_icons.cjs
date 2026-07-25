const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Replace brush icon
const oldBrush = `                    <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(photo); }}
                        className="absolute top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-elevation/80 backdrop-blur-sm border border-border-muted rounded-full p-1 hover:border-emerald-accent hover:text-emerald-accent text-silver-text z-10" 
                        style={{backgroundColor: 'rgba(20,19,19,0.8)', borderColor: '#353434', color: '#e5e2e1'}}
                        title="Editar foto"
                    >
                        <span className="material-symbols-outlined text-[14px]">brush</span>
                    </button>`;

const newIcons = `                    <button 
                        onClick={(e) => handleTogglePin(photo, e)}
                        className={\`absolute top-1 left-1 bg-surface-elevation/80 backdrop-blur-sm border border-border-muted rounded-full w-6 h-6 flex items-center justify-center hover:border-emerald-accent z-20 transition-colors \${photo.pinnedOrder ? 'text-emerald-accent border-emerald-accent' : 'text-silver-text opacity-0 group-hover:opacity-100'}\`}
                        style={{backgroundColor: 'rgba(20,19,19,0.8)'}}
                        title={photo.pinnedOrder ? 'Quitar destacado' : 'Destacar en perfil'}
                    >
                        {photo.pinnedOrder ? (
                            <span className="font-label-sm text-[10px] font-bold">{photo.pinnedOrder}</span>
                        ) : (
                            <span className="material-symbols-outlined text-[12px]">push_pin</span>
                        )}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(photo); }}
                        className="absolute -top-2 -right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-elevation/90 backdrop-blur-md border border-border-muted rounded-full p-1 hover:border-emerald-accent hover:text-emerald-accent text-silver-text z-20 shadow-md" 
                        style={{backgroundColor: 'rgba(20,19,19,0.9)', borderColor: '#353434', color: '#e5e2e1'}}
                        title="Editar foto"
                    >
                        <span className="material-symbols-outlined text-[12px]">brush</span>
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setPhotoToDelete(photo); }}
                        className="absolute bottom-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-elevation/80 backdrop-blur-sm border border-border-muted rounded-full p-1 hover:border-[#b91c1c] hover:text-[#b91c1c] text-silver-text z-20" 
                        style={{backgroundColor: 'rgba(20,19,19,0.8)', borderColor: '#353434'}}
                        title="Eliminar foto"
                    >
                        <span className="material-symbols-outlined text-[12px]">delete</span>
                    </button>`;

content = content.replace(oldBrush, newIcons);

// Ensure bottom panel is visually separated from delete icon if possible, but delete is top layer.
// We'll add the delete modal just before showCancelConfirm.
const oldCancelConfirm = `{showCancelConfirm && (`;
const newDeleteModal = `            {photoToDelete && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
                    <div className="bg-surface-container border border-outline-variant w-full max-w-sm p-6 relative flex flex-col gap-4 overflow-hidden rounded-lg">
                        <h3 className="text-white text-lg font-bold">¿Eliminar foto?</h3>
                        <p className="text-on-surface-variant text-sm">¿Estás seguro de que quieres eliminar la obra "{photoToDelete.title}"? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={() => setPhotoToDelete(null)} className="px-4 py-2 text-sm text-silver-text hover:text-white transition-colors">Cancelar</button>
                            <button onClick={handleDeletePhoto} className="px-4 py-2 text-sm bg-[#b91c1c] text-white rounded hover:bg-[#991b1b] transition-colors">Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
            {showCancelConfirm && (`;

content = content.replace(oldCancelConfirm, newDeleteModal);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
