const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldImport = "import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';";
const newImport = "import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';";
content = content.replace(oldImport, newImport);

// Add photoToDelete state
const oldState = "const [showCancelConfirm, setShowCancelConfirm] = useState(false);";
const newState = "const [showCancelConfirm, setShowCancelConfirm] = useState(false);\n    const [photoToDelete, setPhotoToDelete] = useState<any>(null);";
content = content.replace(oldState, newState);

// Add delete function
const deleteFunc = `
    const handleDeletePhoto = async () => {
        if (!photoToDelete) return;
        try {
            if (!photoToDelete.id.startsWith('fallback_')) {
                await deleteDoc(doc(db, 'photos', photoToDelete.id));
            }
            setExistingPhotos(prev => {
                const newPhotos = prev.filter(p => p.id !== photoToDelete.id);
                globalCachedPhotos = newPhotos;
                return newPhotos;
            });
            setPhotoToDelete(null);
            window.dispatchEvent(new CustomEvent('profileDataChanged'));
        } catch (error) {
            console.error("Error deleting photo", error);
            alert("Hubo un error al eliminar la foto.");
        }
    };
`;

// Add toggle pin function
const pinFunc = `
    const handleTogglePin = async (photo: any, e: React.MouseEvent) => {
        e.stopPropagation();
        
        const currentPinned = existingPhotos.filter(p => typeof p.pinnedOrder === 'number' && p.pinnedOrder > 0).sort((a, b) => a.pinnedOrder - b.pinnedOrder);
        
        try {
            if (typeof photo.pinnedOrder === 'number' && photo.pinnedOrder > 0) {
                // Unpinning
                const updatedPinned = currentPinned.filter(p => p.id !== photo.id);
                const batch = writeBatch(db);
                if (!photo.id.startsWith('fallback_')) {
                    batch.update(doc(db, 'photos', photo.id), { pinnedOrder: null });
                }
                updatedPinned.forEach((p, index) => {
                    if (!p.id.startsWith('fallback_')) {
                        batch.update(doc(db, 'photos', p.id), { pinnedOrder: index + 1 });
                    }
                });
                if (!photo.id.startsWith('fallback_') || updatedPinned.some(p => !p.id.startsWith('fallback_'))) {
                     await batch.commit();
                }
                
                setExistingPhotos(prev => {
                    const newPhotos = prev.map(p => {
                        if (p.id === photo.id) return { ...p, pinnedOrder: null };
                        const pinnedIndex = updatedPinned.findIndex(up => up.id === p.id);
                        if (pinnedIndex !== -1) return { ...p, pinnedOrder: pinnedIndex + 1 };
                        return p;
                    });
                    globalCachedPhotos = newPhotos;
                    return newPhotos;
                });
            } else {
                // Pinning
                if (currentPinned.length >= 6) {
                    alert('Puedes destacar un máximo de 6 fotos.');
                    return;
                }
                const newOrder = currentPinned.length + 1;
                if (!photo.id.startsWith('fallback_')) {
                    await updateDoc(doc(db, 'photos', photo.id), { pinnedOrder: newOrder });
                }
                setExistingPhotos(prev => {
                    const newPhotos = prev.map(p => p.id === photo.id ? { ...p, pinnedOrder: newOrder } : p);
                    globalCachedPhotos = newPhotos;
                    return newPhotos;
                });
            }
        } catch (error) {
            console.error("Error toggling pin", error);
        }
    };
`;

const insertPoint = "const handleSaveObra = async () => {";
content = content.replace(insertPoint, deleteFunc + pinFunc + insertPoint);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
