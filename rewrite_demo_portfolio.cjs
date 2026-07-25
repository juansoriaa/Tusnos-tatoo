const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Update imports
content = content.replace(
  "import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where } from 'firebase/firestore';",
  "import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';"
);

// Add editing states
const statesSearch = "const [isSuccess, setIsSuccess] = useState(false);";
const newStates = `const [isSuccess, setIsSuccess] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<any>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [initialFormState, setInitialFormState] = useState<any>(null);`;
content = content.replace(statesSearch, newStates);

// Add startEdit and cancelEdit logic
const fetchPhotosSearch = "const fetchPhotos = async () => {";
const editFunctions = `
    const startEditing = (photo: any) => {
        setEditingPhoto(photo);
        setTitle(photo.title || '');
        setDescription(photo.info || '');
        setHours(photo.hours?.toString() || '');
        setSessions(photo.sessions?.toString() || '');
        setSize(photo.size || '');
        setSelectedCategories(photo.tags || []);
        setImageFilters(photo.filters || null);
        setSelectedFile(null);
        
        setInitialFormState({
            title: photo.title || '',
            description: photo.info || '',
            hours: photo.hours?.toString() || '',
            sessions: photo.sessions?.toString() || '',
            size: photo.size || '',
            tags: photo.tags || [],
            filters: photo.filters || null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasChanges = () => {
        if (!initialFormState) return false;
        if (title !== initialFormState.title) return true;
        if (description !== initialFormState.description) return true;
        if (hours !== initialFormState.hours) return true;
        if (sessions !== initialFormState.sessions) return true;
        if (size !== initialFormState.size) return true;
        
        if (selectedCategories.length !== initialFormState.tags.length) return true;
        const sortedTags1 = [...selectedCategories].sort();
        const sortedTags2 = [...initialFormState.tags].sort();
        for (let i = 0; i < sortedTags1.length; i++) {
            if (sortedTags1[i] !== sortedTags2[i]) return true;
        }
        
        if (JSON.stringify(imageFilters) !== JSON.stringify(initialFormState.filters)) return true;
        if (selectedFile) return true;
        
        return false;
    };

    const handleCancelEdit = () => {
        if (hasChanges()) {
            setShowCancelConfirm(true);
        } else {
            cancelEdit();
        }
    };

    const cancelEdit = () => {
        setEditingPhoto(null);
        setInitialFormState(null);
        setShowCancelConfirm(false);
        
        setTitle('');
        setDescription('');
        setHours('');
        setSessions('');
        setSize('');
        setSelectedCategories([]);
        setImageFilters(null);
        setSelectedFile(null);
    };
`;
content = content.replace(fetchPhotosSearch, editFunctions + '\n    ' + fetchPhotosSearch);

// Replace handleSaveObra
const saveObraOldRegex = /const handleSaveObra = async \(\) => \{[\s\S]*?setIsSaving\(false\);\n        \}\n    \};/;
const saveObraNew = `const handleSaveObra = async () => {
        if (!selectedFile && !editingPhoto) {
            alert('Por favor selecciona una imagen primero.');
            return;
        }
        if (!title.trim()) {
            alert('El nombre de la obra es requerido.');
            return;
        }
        
        setIsSaving(true);
        try {
            if (editingPhoto) {
                let photoDataUrl = editingPhoto.url || editingPhoto.src;
                let thumbDataUrl = editingPhoto.thumbnailUrl || editingPhoto.src;
                
                if (selectedFile) {
                    photoDataUrl = await createThumbnail(selectedFile, 1080, 1080);
                    thumbDataUrl = await createThumbnail(selectedFile, 400, 400);
                }
                
                const updatedData = {
                    url: photoDataUrl,
                    thumbnailUrl: thumbDataUrl,
                    title,
                    tags: selectedCategories,
                    info: description,
                    hours: hours ? Number(hours) : null,
                    sessions: sessions ? Number(sessions) : null,
                    size,
                    filters: imageFilters,
                };
                
                if (editingPhoto.id.startsWith('fallback_')) {
                    const newPhotoRef = await addDoc(collection(db, 'photos'), {
                        ...updatedData,
                        createdBy: auth.currentUser?.uid || 'anonymous_demo',
                        createdAt: serverTimestamp()
                    });
                    
                    const newPhoto = { id: newPhotoRef.id, ...updatedData, createdBy: auth.currentUser?.uid || 'anonymous_demo' };
                    setExistingPhotos(prev => prev.map(p => p.id === editingPhoto.id ? newPhoto : p));
                } else {
                    const docRef = doc(db, 'photos', editingPhoto.id);
                    await updateDoc(docRef, updatedData);
                    setExistingPhotos(prev => prev.map(p => p.id === editingPhoto.id ? { ...p, ...updatedData } : p));
                }
                
                setIsSuccess(true);
                window.dispatchEvent(new CustomEvent('profileDataChanged'));
                
                setTimeout(() => {
                    setIsSuccess(false);
                    cancelEdit();
                }, 2000);
            } else {
                const photoDataUrl = await createThumbnail(selectedFile, 1080, 1080);
                const thumbDataUrl = await createThumbnail(selectedFile, 400, 400);

                const newPhotoRef = await addDoc(collection(db, 'photos'), {
                    url: photoDataUrl,
                    thumbnailUrl: thumbDataUrl,
                    title,
                    tags: selectedCategories,
                    info: description,
                    hours: hours ? Number(hours) : null,
                    sessions: sessions ? Number(sessions) : null,
                    size,
                    filters: imageFilters,
                    createdBy: auth.currentUser?.uid || 'anonymous_demo',
                    createdAt: serverTimestamp()
                });

                const newPhoto = {
                    id: newPhotoRef.id,
                    url: photoDataUrl,
                    thumbnailUrl: thumbDataUrl,
                    title,
                    tags: selectedCategories,
                    info: description,
                    hours: hours ? Number(hours) : null,
                    sessions: sessions ? Number(sessions) : null,
                    size,
                    filters: imageFilters,
                    createdBy: auth.currentUser?.uid || 'anonymous_demo',
                };
                
                setExistingPhotos(prev => [newPhoto, ...prev]);

                setIsSuccess(true);
                window.dispatchEvent(new CustomEvent('profileDataChanged'));
                setTimeout(() => {
                    setIsSuccess(false);
                    cancelEdit();
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar la obra.');
        } finally {
            setIsSaving(false);
        }
    };`;
content = content.replace(saveObraOldRegex, saveObraNew);

// Update PhotoUploader props
content = content.replace(
  '<PhotoUploader \n                onImageSelected={setSelectedFile}\n                onFiltersChanged={setImageFilters}\n            />',
  `<PhotoUploader 
                onImageSelected={setSelectedFile}
                onFiltersChanged={setImageFilters}
                initialImageUrl={editingPhoto ? (editingPhoto.thumbnailUrl || editingPhoto.url || editingPhoto.src) : null}
                initialFilters={editingPhoto ? editingPhoto.filters : null}
                isEditMode={!!editingPhoto}
                onCancelEdit={handleCancelEdit}
            />`
);

// Update Section 2 title depending on edit mode
content = content.replace(
  'Subir Obra\n                                        </h2>',
  `{editingPhoto ? 'Editar Obra' : 'Subir Obra'}
                                        </h2>`
);
content = content.replace(
  '<span className="material-symbols-outlined mr-2 text-emerald-accent" style={{color: \'#054d44\'}}>upload</span>',
  `<span className="material-symbols-outlined mr-2 text-emerald-accent" style={{color: '#054d44'}}>
                {editingPhoto ? 'edit' : 'upload'}
            </span>`
);

// Update button texts
content = content.replace(
  'Guardar Obra\n                    </>',
  `{editingPhoto ? 'Guardar Cambios' : 'Guardar Obra'}
                    </>`
);

// Add the brush to the gallery and make both edit buttons trigger edit mode
// Wait, the "fallback" photos in existingPhotos initially don't have existingPhotos since DemoPortfolio.tsx only fetches from DB!
// Wait! `ArtistProfile` uses fallback if no DB photos. `DemoPortfolio` might only show DB photos.
// Actually, `DemoPortfolio` should probably also show fallback photos if empty, or at least they can just edit whatever is in `existingPhotos`. Let's check `existingPhotos` mapping.

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
