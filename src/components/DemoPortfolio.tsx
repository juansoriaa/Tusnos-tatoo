import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';
import PhotoUploader, { ImageFilters } from './PhotoUploader';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createThumbnail } from '../lib/imageUtils';

let globalCachedPhotos: any[] | null = null;

export default function DemoPortfolio() {
    const [categories, setCategories] = useState(['Realismo', 'Blackwork', 'Minimalista', 'Tradicional']);
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageFilters, setImageFilters] = useState<ImageFilters | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState('');
    const [sessions, setSessions] = useState('');
    const [size, setSize] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<any>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState<any>(null);
    const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<any>(null);
    const [showHint, setShowHint] = useState(true);
    const [initialFormState, setInitialFormState] = useState<any>(null);
    const [resetUploader, setResetUploader] = useState(0);
    const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
    const [filterCategory, setFilterCategory] = useState('all');

    const trackPhotoClick = (photoId: string) => {
        try {
            const stats = JSON.parse(localStorage.getItem('photoStats') || '{}');
            if (!stats[photoId]) stats[photoId] = 0;
            stats[photoId] += 1;
            localStorage.setItem('photoStats', JSON.stringify(stats));
            window.dispatchEvent(new Event('photoStatsUpdated'));
        } catch(e) {}
    };


    const startEditing = (photo: any) => {
        setEditingPhoto(photo);
        setTitle(photo.title || '');
        setDescription(photo.info || photo.alt || '');
        setHours(photo.hours?.toString() || '');
        setSessions(photo.sessions?.toString() || '');
        setSize(photo.size || '');
        setSelectedCategories(photo.tags || []);
        setImageFilters(photo.filters || null);
        setSelectedFile(null);
        
        setInitialFormState({
            title: photo.title || '',
            description: photo.info || photo.alt || '',
            hours: photo.hours?.toString() || '',
            sessions: photo.sessions?.toString() || '',
            size: photo.size || '',
            tags: photo.tags || [],
            filters: photo.filters || null
        });
        setTimeout(() => {
            document.getElementById('subir-obra-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const getFilterStyle = (filters: any) => {
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
            if (contrast?.active) filterStr += `contrast(${contrast.value * 2}%) `;
            if (brightness?.active) filterStr += `brightness(${brightness.value * 2}%) `;
            if (blackIntensity?.active) filterStr += `grayscale(${blackIntensity.value}%) `;
        }
        return filterStr.trim();
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
        
        const isFiltersActive = (f: any) => f && (f.activePreset || f.contrast?.active || f.brightness?.active || f.blackIntensity?.active);
        const currentActive = isFiltersActive(imageFilters);
        const initialActive = isFiltersActive(initialFormState.filters);
        
        if (currentActive !== initialActive) return true;
        if (currentActive && JSON.stringify(imageFilters) !== JSON.stringify(initialFormState.filters)) return true;
        
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
        setResetUploader(prev => prev + 1);
    };

    useEffect(() => {
        // Fetch existing photos when component mounts
    const fetchPhotos = async (userUid: string) => {
            if (globalCachedPhotos) {
                setExistingPhotos(globalCachedPhotos);
                return;
            }
            let artistUid = userUid || 'anonymous_demo';
            try {
                const q = query(
                    collection(db, 'photos'),
                    where('createdBy', '==', artistUid),
                    orderBy('createdAt', 'desc')
                );
                const snapshot = await getDocs(q);
                const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
                const fallback = [
    {
      id: "fallback_1",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
      alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
      title: "Detailed black & grey realism",
      tags: ["Realismo", "Blackwork"],
      hours: 12,
      sessions: 2,
      size: "20x15 cm"
    },
    {
      id: "fallback_2",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
      alt: "Close-up of a delicate minimalist tattoo of a single rose.",
      title: "Delicate minimalist single rose",
      tags: ["Minimalista"],
      hours: 3,
      sessions: 1,
      size: "8x5 cm"
    },
    {
      id: "fallback_3",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
      alt: "Large-scale blackwork tattoo covering a full back.",
      title: "Large-scale blackwork back piece",
      tags: ["Blackwork", "Tradicional"],
      hours: 24,
      sessions: 4,
      size: "Espalda completa"
    },
    {
      id: "fallback_4",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_bLleuw4yQOy32XLTc-ZA36ZI1Tx20UNajjWgcV5DQKPXzxE6vuXBvD3Ov7hcyCDB0Wpbc1BK7v4CJMIFC3KWS1bBdxzGJUcjSraTSohPMSOjESD5If5O8I8ZxmV0rWCZ_T_ncpPVYMBz9OD9_NXcCjwNkftJNjmowLcbK_jq3Fy-FieRJHky4A0G8SWmDSNGfDrlvoUxmb8aYt9Dxvi2w5uLOR4ir0BxgO2Sh5IfSstId4FI96uowW3Y1Jw1YCCRUk82ep4yPk",
      alt: "Hyper-realistic black and grey realism tattoo",
      title: "Hyper-realistic black & grey",
      tags: ["Realismo", "Blackwork"],
      hours: 15,
      sessions: 3,
      size: "Media manga"
    },
    {
      id: "fallback_5",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5LMtrwwTSFu95uiU0bVfXq9VmWZIJ10dyJ3Lwbu6VmGCGEnBfZXi0WQlrXz0JAAAXzBurYTXa8IleL_Z1UTW7x4BHigWcVZCarsYy-PDu3G5JOwCsz3c0mgBTVI90e2b4bcw5lLDYzc5mU0qXptlWkjo0e3ynOS0xxfhCjxtvA0Bykbfo3wSX79T_fwcMg4uFHYXGxws2NYoOaKhhgr6J8ErFHQqB5QJSnK9c2zkwmEgiIM-74wbPKlVjQPO8pxETkDa8jrj1OmA",
      alt: "Detailed blackwork owl",
      title: "Detailed blackwork owl",
      tags: ["Blackwork", "Realismo"],
      hours: 8,
      sessions: 2,
      size: "15x15 cm"
    },
    {
      id: "fallback_6",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiCcgze-zMmmFAOjCN4xQ6CeoqLv_BgkKj7iZWfDqCXh_QoGPCTeSVYBVbA3H_kloM0bS3tXxBa3cY1pNmeNr4CtKPuWY_AFMUCkSb29fVkPS2cJxnOnCZXdCOsST5XxUvicao5fv4hZLXgol8izTusYUx7vRcLz4wQi2YO2jqeWtkjahkSIkJ9bsZTT9Yc4B7Xyxsbuht5vClIiVLFRgAVTnmtfvKmMPDtXdGMokCs42r9vRajXl7r_QmrmtosOLgBWwvZeva_eLj",
      alt: "Minimalist mountain",
      title: "Minimalist mountain",
      tags: ["Minimalista"],
      hours: 2,
      sessions: 1,
      size: "5x5 cm"
    },
    {
      id: "fallback_7",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kAzmGiitSjdk2D4_OGK9WYclBZmk7cefWe8BPMcY8LBacqpcoUc38Awd5FqNh4Eba1D7004xOI8zM_OfSwqcVZtS51XTNjE110SdiB0YMIgxjjBiNGxIGDifU-2yV2DRHxJyft8AS6K6D8tdWl2VVOQfu7wbFLEt11twfKV6pV5KYEwWElAna9GN2J36mCgbidD9hs4hjuPVR45M0Pps7tijbmPhi-RljtyBBrI8SYhiXDvFxXBFVQP1eN6iXqLAzNKsTq_SVt3I",
      alt: "Realistic koi fish",
      title: "Realistic koi fish",
      tags: ["Realismo", "Tradicional"],
      hours: 10,
      sessions: 2,
      size: "20x20 cm"
    },
    {
      id: "fallback_8",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeiQ96QvK_CB1f544ltSr7zUBzrf2JkPLOlygIBhVzlG8_X5vs1kq9-qAOcPYyPpmhMJ1zn9Tcmc7NtA_i3PYk36Iz_1F__r0TDyBqJSggpzoN5zrF7-cvpX9b6WXiYVcfeoqEuaJYzdSoe8kUbhd0B4xu4PGqI41o9CycgDPQVit7QtUNuxbu8VjI8LNqibJ2Qpoa09qjNLV4Jo2vA81r1KdlIAW9YBEaay9duZ3ZH7HaFAD81admkcERAH-uJz-36mHQSAIx-9Eb",
      alt: "Micro-realism pocket watch",
      title: "Micro-realism pocket watch",
      tags: ["Realismo", "Minimalista"],
      hours: 4,
      sessions: 1,
      size: "8x8 cm"
    },
    {
      id: "fallback_9",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq1VnZZF7nLUADCQTiQU7dFsZs6g49GFftf-8vLI5Eht2qRTRatf1CSOeX5KEYDypiRNGBkOf_c2xFWSl0jIvxnDMDACEPe9flYK5v_8YXNAZsg1vf9sU4ErKlOyti57hRTbY2bE0gaC06B9DTveMjFNKECVQukrTC9VKQib6kXWcVETRdRFmdCUJdFtzLRk4Dnc1UmNwEx2kNBrXTze-GZPlY4FY-H1oaaAh6UzJLZKz8EHc8jTj761A7z6b_CVlSjqiWdBYTjuCS",
      alt: "Large-scale abstract geometric",
      title: "Large-scale abstract geometric",
      tags: ["Blackwork", "Minimalista"],
      hours: 6,
      sessions: 1,
      size: "10x20 cm"
    },
    {
      id: "fallback_10",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhMj-R1FS_ht2tgrQqme6b2-Hg846oZVQyQ8p1Rchy_7azS2BnqJ5ysLJC8ekDsqqJ8r8LVqJy7K0vGLwO3JKB2uZz_KP8CkOCEmoJ8VMPaUL6cRZryKuQ6HnyRnPdwZ1Qjl2e9IwAs2V3gj-qNn3VIs25WmVqhxfKa7qTsFCOZujgAJV7F3Sot0QO3TJ23bSoB7cpiXHeyHfC00e9Z2qW6y_9DnVNd3R4U30ZGgtAdmqv9-xhzzVl6qAEs0focdc8_W14OXWEfcFu",
      alt: "Small elegant script",
      title: "Small elegant script",
      tags: ["Minimalista"],
      hours: 1,
      sessions: 1,
      size: "3x10 cm"
    },
    {
      id: "fallback_11",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeHO5mvih_r7YM-AQGfl6iWFA1d3CbUokk5zQ4HXbH3KTIJGeDLkdA-9tQrC1005dLiu4B2NyIL87-Y2DeE-B2IaiAIAPscoi7yJyYW7p5C1BPnRQPAcrbpxuDExdI3Xp8j__iKVjs1sqqpCXXVAVzm8PpbbFoPB7ca91f2keDdXcwyQz10d28H_44u4UwZFaPaQzuS6lKDiS77IZ05qxOyMiiwJd0D48vNuQQqLxWFA4X67UB_J03NSR6pFTMBXwwJWUIXU-RHbwf",
      alt: "Forest landscape inside diamond",
      title: "Forest landscape",
      tags: ["Blackwork", "Minimalista"],
      hours: 5,
      sessions: 1,
      size: "12x12 cm"
    },
    {
      id: "fallback_12",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_jhISTzGUC2siSj7XIqc-tB7Bzph9Pa50g881aLp9acURUaH40UfWqwlaPN8vl_o5GGNJwNHZFFRzpVpoVffXojuHdynlpn4l8usek3UlfDg4f2TZsxxNPWV8Iqm6jgpbW3-TnVjiwYzCzrj_Htjt1I3iffZTFCM68lixk6Oz4Jml38mAv0HpdJWGJaSe1Y8Img_4dzl_iPZkU9_WaeA0xH6i2x-1XthcwczFtCWa1ScOMF05bFoWQ7OSotfbDwUlQeZrcGO8bjT7",
      alt: "Neo-traditional dagger",
      title: "Neo-traditional dagger",
      tags: ["Tradicional"],
      hours: 7,
      sessions: 2,
      size: "15x10 cm"
    }
  ];

                const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                const pinnedFallbacks = JSON.parse(localStorage.getItem('pinnedFallbacks') || '{}');
                const finalPhotos = [
                    ...photos,
                    ...fallback
                        .filter(f => !photos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id))
                        .map(f => ({ ...f, pinnedOrder: pinnedFallbacks[f.id] || null }))
                ];
                setExistingPhotos(finalPhotos);
                globalCachedPhotos = finalPhotos;
            } catch (error) {
                console.error("Error fetching photos", error);
            }
        };
        const unsubscribe = auth.onAuthStateChanged((user) => {
            fetchPhotos(user?.uid || '');
        });
        return () => unsubscribe();
    }, []);

    
    const handleDeletePhoto = async () => {
        if (!photoToDelete) return;
        try {
            if (!photoToDelete.id.startsWith('fallback_')) {
                await deleteDoc(doc(db, 'photos', photoToDelete.id));
            } else {
                const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                deletedFallbacks.push(photoToDelete.id);
                localStorage.setItem('deletedFallbacks', JSON.stringify(deletedFallbacks));
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
                
                if (photo.id.startsWith('fallback_')) {
                    const pinnedFallbacks = JSON.parse(localStorage.getItem('pinnedFallbacks') || '{}');
                    delete pinnedFallbacks[photo.id];
                    
                    updatedPinned.forEach((p, index) => {
                        if (p.id.startsWith('fallback_')) {
                            pinnedFallbacks[p.id] = index + 1;
                        }
                    });
                    localStorage.setItem('pinnedFallbacks', JSON.stringify(pinnedFallbacks));
                }
                
                window.dispatchEvent(new CustomEvent('profileDataChanged'));
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
                
                if (photo.id.startsWith('fallback_')) {
                    const pinnedFallbacks = JSON.parse(localStorage.getItem('pinnedFallbacks') || '{}');
                    pinnedFallbacks[photo.id] = newOrder;
                    localStorage.setItem('pinnedFallbacks', JSON.stringify(pinnedFallbacks));
                }
                
                window.dispatchEvent(new CustomEvent('profileDataChanged'));
            }
        } catch (error) {
            console.error("Error toggling pin", error);
        }
    };
const handleSaveObra = async () => {
        if (!editingPhoto && existingPhotos.length >= 25) {
            alert('Has alcanzado el límite máximo de 25 obras. Por favor, elimina algunas antes de subir más.');
            return;
        }
        if (!selectedFile && !editingPhoto) {
            alert('Por favor selecciona una imagen primero.');
            return;
        }
        if (!title.trim()) {
            alert('El nombre de la obra es requerido.');
            return;
        }
        
        let finalSize = size.trim();
        if (finalSize && !finalSize.toLowerCase().endsWith('cm')) {
            finalSize += ' cm';
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
                    size: finalSize,
                    filters: imageFilters,
                };
                
                if (editingPhoto.id.startsWith('fallback_')) {
                    const newPhotoRef = await addDoc(collection(db, 'photos'), {
                        ...updatedData,
                        originalFallbackId: editingPhoto.id,
                        createdBy: localStorage.getItem('demoUserId') || (localStorage.getItem('demoUserId') || auth.currentUser?.uid) || 'anonymous_demo',
                        createdAt: serverTimestamp()
                    });
                    
                    const newPhoto = { id: newPhotoRef.id, originalFallbackId: editingPhoto.id, ...updatedData, createdBy: localStorage.getItem('demoUserId') || (localStorage.getItem('demoUserId') || auth.currentUser?.uid) || 'anonymous_demo' };
                    setExistingPhotos(prev => {
                        const newPhotos = prev.map(p => p.id === editingPhoto.id ? newPhoto : p);
                        globalCachedPhotos = newPhotos;
                        return newPhotos;
                    });
                } else {
                    const docRef = doc(db, 'photos', editingPhoto.id);
                    await updateDoc(docRef, updatedData);
                    setExistingPhotos(prev => {
                        const newPhotos = prev.map(p => p.id === editingPhoto.id ? { ...p, ...updatedData } : p);
                        globalCachedPhotos = newPhotos;
                        return newPhotos;
                    });
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
                    size: finalSize,
                    filters: imageFilters,
                    createdBy: localStorage.getItem('demoUserId') || (localStorage.getItem('demoUserId') || auth.currentUser?.uid) || 'anonymous_demo',
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
                    size: finalSize,
                    filters: imageFilters,
                    createdBy: localStorage.getItem('demoUserId') || (localStorage.getItem('demoUserId') || auth.currentUser?.uid) || 'anonymous_demo',
                };
                
                setExistingPhotos(prev => {
                    const newPhotos = [newPhoto, ...prev];
                    globalCachedPhotos = newPhotos;
                    return newPhotos;
                });

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
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.map(c => c.toLowerCase()).includes(newCategory.trim().toLowerCase())) {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (catToRemove: string) => {
        setCategories(categories.filter(c => c !== catToRemove));
        setSelectedCategories(selectedCategories.filter(c => c !== catToRemove));
    };

    const toggleCategorySelection = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat));
        } else if (selectedCategories.length < 2) {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    return (
        <DemoLayout 
            activeTab="portfolio"
            titlePrefix="Gestión de"
            titleAccent="Portafolio"
            description="Gestiona tu galería. Maneja categorías, sube nuevas obras y organiza tu portafolio público."
        >
            <div className="flex flex-col gap-6 mb-8">
            
            {/* Section 1 - Categorías (Moved up) */}
            <section className="bg-surface-elevation p-4 md:p-5 border border-border-muted rounded-lg" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
            <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-silver-text flex items-center text-lg" style={{color: '#e5e2e1'}}>
            <span className="material-symbols-outlined mr-2 text-emerald-accent" style={{color: '#054d44'}}>category</span>
                                            Categorías
                                        </h2>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex space-x-2 w-full md:max-w-sm">
            <input 
                className="flex-1 bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-3 py-1.5 transition-colors placeholder:text-on-surface-variant text-sm" 
                placeholder="Nueva categoría..." 
                type="text" 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button 
                type="button"
                onClick={handleAddCategory}
                className="bg-transparent border border-border-muted rounded text-silver-text px-3 py-1.5 hover:border-emerald-accent transition-colors font-label-md uppercase tracking-wider text-xs flex items-center shrink-0" 
                style={{borderColor: '#353434', color: '#e5e2e1'}}
            >
            <span className="material-symbols-outlined mr-1 text-sm">add</span>
                                            Agregar
                                        </button>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:flex-1">
            {categories.map((cat) => (
                <div key={cat} className="bg-surface-container px-2 py-1.5 md:py-1 rounded flex items-center border border-border-muted/50 group hover:border-emerald-accent transition-colors cursor-pointer" style={{backgroundColor: '#201f1f', borderColor: 'rgba(53,52,52,0.5)'}} onClick={() => handleRemoveCategory(cat)}>
                <span className="font-label-sm uppercase text-silver-text mr-1 text-xs md:text-[10px]" style={{color: '#e5e2e1'}}>{cat}</span>
                <span className="material-symbols-outlined text-sm md:text-[12px] text-on-surface-variant group-hover:text-error transition-colors">close</span>
                </div>
            ))}
            </div>
            </div>
            </section>

            {/* Section 2 - Subir Obra */}
            <section id="subir-obra-section" className="bg-surface-elevation p-4 md:p-5 border border-border-muted rounded-lg w-full" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
            <div className="flex items-center justify-between mb-4 border-b border-border-muted pb-3" style={{borderColor: '#353434'}}>
            <h2 className="font-headline-md text-silver-text flex items-center text-xl" style={{color: '#e5e2e1'}}>
            <span className="material-symbols-outlined mr-2 text-emerald-accent" style={{color: '#054d44'}}>
                {editingPhoto ? 'edit' : 'upload'}
            </span>
                                            {editingPhoto ? 'Editar Obra' : 'Subir Obra'}
                                        </h2>
            </div>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Image & Edit */}
            <div className="space-y-4">
            {/* Image Upload Area */}
            <PhotoUploader 
                onImageSelected={setSelectedFile}
                onFiltersChanged={setImageFilters}
                initialImageUrl={editingPhoto ? (editingPhoto.thumbnailUrl || editingPhoto.url || editingPhoto.src) : null}
                initialFilters={editingPhoto ? editingPhoto.filters : null}
                isEditMode={!!editingPhoto}
                onCancelEdit={handleCancelEdit}
                resetTrigger={resetUploader}
            />
            </div>
            {/* Right Col: Details */}
            <div className="space-y-4 flex flex-col">
            <div>
            <label className="font-label-md text-on-surface-variant block mb-1 text-sm">Nombre de la obra</label>
            <input 
                className="w-full bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-3 py-2 transition-colors text-sm" 
                type="text" 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            </div>
            <div>
            <div className="flex items-center justify-between mb-1">
                <label className="font-label-md text-on-surface-variant block text-sm">Categoría</label>
                <span className="font-caption text-on-surface-variant/70 text-[10px]">Máx 2</span>
            </div>
            <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategorySelection(cat)}
                    className={`px-3 py-1.5 rounded font-label-sm text-xs transition-colors border ${selectedCategories.includes(cat) ? 'bg-emerald-accent/20 border-emerald-accent text-emerald-accent' : 'bg-deep-black border-border-muted text-on-surface-variant hover:border-emerald-accent/50'}`}
                    style={{
                        backgroundColor: selectedCategories.includes(cat) ? 'rgba(5, 77, 68, 0.2)' : '#050505',
                        borderColor: selectedCategories.includes(cat) ? '#054d44' : '#353434',
                        color: selectedCategories.includes(cat) ? '#054d44' : '#b3b3b3'
                    }}
                >
                    {cat}
                </button>
            ))}
            </div>
            </div>
            <div>
            <label className="font-label-md text-on-surface-variant block mb-1 text-sm">Detalle / Descripción</label>
            <textarea 
                className="w-full bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-3 py-2 transition-colors resize-none h-24 text-sm" 
                rows={3} 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={description}
                onChange={e => setDescription(e.target.value)}
            ></textarea>
            </div>
            {/* Technical Details Row */}
            <div className="border-t border-border-muted pt-4 mt-auto" style={{borderColor: '#353434'}}>
            <h3 className="font-label-md text-on-surface-variant mb-3 uppercase tracking-wider text-[10px]">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-3 gap-3">
            <div>
            <label className="font-label-sm text-on-surface-variant block mb-1 text-[10px]">Horas</label>
            <input 
                className="w-full bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-2 py-1.5 transition-colors text-center text-sm" 
                placeholder="Ej: 6" 
                type="number" 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={hours}
                onChange={e => setHours(e.target.value)}
            />
            </div>
            <div>
            <label className="font-label-sm text-on-surface-variant block mb-1 text-[10px]">Sesiones</label>
            <input 
                className="w-full bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-2 py-1.5 transition-colors text-center text-sm" 
                placeholder="Ej: 2" 
                type="number" 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={sessions}
                onChange={e => setSessions(e.target.value)}
            />
            </div>
            <div>
            <label className="font-label-sm text-on-surface-variant block mb-1 text-[10px]">Tamaño</label>
            <div className="relative">
            <input 
                className="w-full bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-2 py-1.5 transition-colors text-center text-sm" 
                placeholder="15x20" 
                type="text" 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={size.replace(/\s*cm$/i, '')}
                onChange={e => setSize(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-sm text-xs pointer-events-none">cm</span>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            <button 
                onClick={handleSaveObra}
                disabled={isSaving}
                className={`w-full text-on-surface py-3 mt-4 rounded font-label-md uppercase tracking-widest transition-all duration-300 flex justify-center items-center text-sm ${isSuccess ? 'bg-[#10b981] scale-[1.02]' : 'bg-emerald-accent hover:brightness-110'} ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`} 
                type="button" 
                style={isSuccess ? { color: '#ffffff' } : { backgroundColor: '#054d44', color: '#e5e2e1' }}
            >
                {isSaving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subiendo...
                    </>
                ) : isSuccess ? (
                    <>
                        <span className="material-symbols-outlined mr-2 text-[18px]">check_circle</span>
                        ¡Guardado!
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined mr-2 text-[18px]">save</span>
                        {editingPhoto ? 'Guardar Cambios' : 'Guardar Obra'}
                    </>
                )}
            </button>
            </form>
            </section>

            {/* Section 3 - Galería Existente */}
            <section className="bg-surface-elevation p-4 md:p-5 border border-border-muted rounded-lg" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-border-muted pb-3 gap-3" style={{borderColor: '#353434'}}>
            <h2 className="font-headline-md text-silver-text flex items-center text-lg" style={{color: '#e5e2e1'}}>
            <span className="material-symbols-outlined mr-2 text-emerald-accent" style={{color: '#054d44'}}>grid_view</span>
                                            Galería Existente
                                        </h2>
            <div className="flex items-center space-x-3">
            <span className="font-label-sm uppercase text-on-surface-variant text-[10px]">Filtrar:</span>
            <select 
                className="bg-deep-black border border-border-muted rounded focus:border-emerald-accent focus:ring-0 text-silver-text font-body-md px-2 py-1.5 md:py-1 transition-colors appearance-none cursor-pointer text-xs flex-1 sm:flex-none" 
                style={{backgroundColor: '#050505', borderColor: '#353434', color: '#e5e2e1'}}
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
            >
            <option value="all">Todas</option>
            {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
            </select>
            </div>
            </div>
            {/* Gallery Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            
            {[...existingPhotos].sort((a, b) => {
                const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                if (aPinned) return -1;
                if (bPinned) return 1;
                return 0;
            }).filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase())).map((photo, index) => {
                let filterStr = '';
                if (photo.filters) {
                    const { activePreset, contrast, brightness, blackIntensity } = photo.filters;
                    const isAnyManualActive = contrast?.active || brightness?.active || blackIntensity?.active;
                    if (activePreset && !isAnyManualActive) {
                        if (activePreset === 'tinta_negra') filterStr = 'contrast(125%) brightness(95%) grayscale(15%)';
                        if (activePreset === 'color') filterStr = 'contrast(110%) brightness(105%) saturate(130%)';
                        if (activePreset === 'piel') filterStr = 'contrast(95%) brightness(105%) saturate(90%)';
                        if (activePreset === 'blanco_y_negro') filterStr = 'grayscale(100%) contrast(130%)';
                    } else {
                        if (contrast?.active) filterStr += `contrast(${contrast.value * 2}%) `;
                        if (brightness?.active) filterStr += `brightness(${brightness.value * 2}%) `;
                        if (blackIntensity?.active) filterStr += `grayscale(${blackIntensity.value}%) `;
                    }
                }
                
                return (
                    <div 
                        key={photo.id} 
                        onClick={() => {
                            trackPhotoClick(photo.id);
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
                    </div>
                )
            })}
            </div>
            </section>
            </div>
                        
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
                                style={{ filter: getFilterStyle(selectedGalleryPhoto.filters) }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            
                            <button 
                                onClick={() => setSelectedGalleryPhoto(null)}
                                className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white rounded-full p-1 hover:bg-black/80 transition-colors z-30"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>

                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const filteredPhotos = [...existingPhotos].sort((a, b) => {
                                        const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                                        const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                                        if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                                        if (aPinned) return -1;
                                        if (bPinned) return 1;
                                        return 0;
                                    }).filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase()));
                                    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedGalleryPhoto.id);
                                    if (currentIndex > 0) {
                                        const nextPhoto = filteredPhotos[currentIndex - 1];
                                        trackPhotoClick(nextPhoto.id);
                                        setSelectedGalleryPhoto(nextPhoto);
                                    }
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/80 transition-colors z-30 flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const filteredPhotos = [...existingPhotos].sort((a, b) => {
                                        const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                                        const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                                        if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                                        if (aPinned) return -1;
                                        if (bPinned) return 1;
                                        return 0;
                                    }).filter(photo => filterCategory === 'all' || photo.tags?.some((t: string) => t.toLowerCase() === filterCategory.toLowerCase()));
                                    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedGalleryPhoto.id);
                                    if (currentIndex < filteredPhotos.length - 1) {
                                        const nextPhoto = filteredPhotos[currentIndex + 1];
                                        trackPhotoClick(nextPhoto.id);
                                        setSelectedGalleryPhoto(nextPhoto);
                                    }
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/80 transition-colors z-30 flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-[24px]">chevron_right</span>
                            </button>

                            <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none">
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
                                <span className={`material-symbols-outlined mb-1 text-[20px] transition-colors ${selectedGalleryPhoto.pinnedOrder ? 'text-emerald-accent' : 'text-silver-text group-hover:text-white'}`}>push_pin</span>
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
{photoToDelete && (
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
            {showCancelConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
                    <div className="bg-surface-container border border-outline-variant w-full max-w-sm p-6 relative flex flex-col gap-4 overflow-hidden rounded-lg">
                        <h3 className="text-white text-lg font-bold">¿Cancelar edición?</h3>
                        <p className="text-on-surface-variant text-sm">Hiciste cambios sin guardar. Si cancelas ahora, esos cambios se perderán.</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 text-sm text-silver-text hover:text-white transition-colors">Volver</button>
                            <button onClick={cancelEdit} className="px-4 py-2 text-sm bg-[#b91c1c] text-white rounded hover:bg-[#991b1b] transition-colors">Sí, cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            </DemoLayout>
    );
}
