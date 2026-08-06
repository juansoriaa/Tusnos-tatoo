import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const openModal = (index: number) => {`;

const rep = `  const loadMoreTattoos = async () => {
    if (!hasMore || !lastDoc || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
        const uid = artistData?.uid || artistData?.id || resolveTargetId();
        const { collection, query, where, orderBy, limit, startAfter, getDocs } = await import('firebase/firestore');
        const qTattoos = query(
            collection(db, 'photos'),
            where('createdBy', '==', uid),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(12)
        );
        const tattoosSnapshot = await getDocs(qTattoos);
        
        if (tattoosSnapshot.docs.length > 0) {
            setLastDoc(tattoosSnapshot.docs[tattoosSnapshot.docs.length - 1]);
        }
        if (tattoosSnapshot.docs.length < 12) {
            setHasMore(false);
        }
        
        let newPhotos = tattoosSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                src: data.url || data.imageUrl || data.src,
                previewUrl: data.previewUrl,
                thumbnailUrl: data.thumbnailUrl,
                alt: data.info || data.title,
                title: data.title || 'Foto de Tatuaje',
                categories: data.tags || data.categories || ['Portfolio'],
                filters: data.filters || [],
                hours: data.hours,
                sessions: data.sessions,
                size: data.size,
                pinnedOrder: data.pinnedOrder,
                originalFallbackId: data.originalFallbackId
            };
        });
        
        setAllTattoos(prev => [...prev, ...newPhotos]);
    } catch(e) {
        console.error("Error loading more tattoos", e);
    } finally {
        setIsLoadingMore(false);
    }
  };

  const openModal = (index: number) => {`;

code = code.replace(target, rep);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
