  useEffect(() => {
    let authUnsub = () => {};
    let isMounted = true;
    
    const loadProfileData = async (authUid: string | undefined) => {
        let targetId = id;
        if (!targetId) targetId = authUid;
        if (!targetId) targetId = localStorage.getItem('demoUserId');
        if (!targetId) targetId = 'anonymous_demo';
        
        try {
            if (!artistData) setIsProfileLoading(true);
            if (allTattoos.length === 0) setIsTattoosLoading(true);
            
            let artistUid = targetId;
            let currentArtistData = null;
            let currentArtistDocId = null;

            // Resolve ID if it's a tag
            if (artistUid.startsWith('@') || artistUid.length < 20) {
                let tag = artistUid.startsWith('@') ? artistUid : '@' + artistUid;
                const q = query(collection(db, 'users'), where('userTag', '==', tag));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    artistUid = snap.docs[0].id;
                    currentArtistData = snap.docs[0].data();
                    currentArtistDocId = artistUid;
                }
            } 
            
            // Now that we definitely have the UID, we can fetch BOTH artist profile (if we don't have it yet) and tattoos in parallel using Promise.all!
            const promises = [];
            
            if (!currentArtistData && artistUid !== 'anonymous_demo' && artistUid !== 'demo') {
                promises.push(getDoc(doc(db, 'users', artistUid)).then(docSnap => {
                    if (docSnap.exists()) {
                        currentArtistData = docSnap.data();
                        currentArtistDocId = docSnap.id;
                    }
                }));
            } else {
                promises.push(Promise.resolve());
            }

            const qTattoos = query(
                collection(db, 'photos'),
                where('createdBy', '==', artistUid),
                orderBy('createdAt', 'desc'),
                limit(20)
            );
            promises.push(getDocs(qTattoos));
            
            const results = await Promise.all(promises);
            const tattoosSnapshot = results[1];
            
            if (isMounted) {
                if (currentArtistData) {
                    const data = { ...currentArtistData, uid: currentArtistDocId };
                    setArtistData(data);
                    globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], artistData: data };
                } else if (targetId === 'demo' || targetId === 'anonymous_demo') {
                    const saved = localStorage.getItem('demoArtistData_demo');
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved);
                            currentArtistData = parsed;
                            setArtistData(parsed);
                        } catch (e) {}
                    }
                }
                
                let finalPhotos: any[] = [];
                if (tattoosSnapshot) {
                    finalPhotos = tattoosSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            src: data.url || data.imageUrl || data.src,
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
                }
                
                let isDemoUser = false;
                if (artistUid === '@victor_ink' || artistUid === 'victor_ink' || artistUid === 'demo' || artistUid === '@demo' || artistUid === 'anonymous_demo') isDemoUser = true;
                if (currentArtistData && (currentArtistData.userTag === '@demo' || currentArtistData.userTag === '@victor_ink' || currentArtistData.userTag === 'victor_ink' || currentArtistData.userTag === 'demo')) {
                    isDemoUser = true;
                }
                if (isDemoUser) {
                    const fallback = [
                        {
                          id: "fallback_1",
                          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
                          alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
                          title: "Detailed black & grey realism",
                          categories: ["Realismo", "Blackwork"],
                          hours: 12,
                          sessions: 2,
                          size: "20x15 cm"
                        },
                        {
                          id: "fallback_2",
                          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
                          alt: "Close-up of a delicate minimalist tattoo of a single rose.",
                          title: "Delicate minimalist single rose",
                          categories: ["Minimalista"],
                          hours: 3,
                          sessions: 1,
                          size: "8x5 cm"
                        },
                        {
                          id: "fallback_3",
                          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
                          alt: "Large-scale blackwork tattoo covering a full back.",
                          title: "Large-scale blackwork back piece",
                          categories: ["Blackwork", "Tradicional"],
                          hours: 24,
                          sessions: 4,
                          size: "Espalda completa"
                        },
                        {
                          id: "fallback_4",
                          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_bLleuw4yQOy32XLTc-ZA36ZI1Tx20UNajjWgcV5DQKPXzxE6vuXBvD3Ov7hcyCDB0Wpbc1BK7v4CJMIFC3KWS1bBdxzGJUcjSraTSohPMSOjESD5If5O8I8ZxmV0rWCZ_T_ncpPVYMBz9OD9_NXcCjwNkftJNjmowLcbK_jq3Fy-FieRJHky4A0G8SWmDSNGfDrlvoUxmb8aYt9Dxvi2w5uLOR4ir0BxgO2Sh5IfSstId4FI96uowW3Y1Jw1YCCRUk82ep4yPk",
                          alt: "Hyper-realistic black and grey realism tattoo",
                          title: "Hyper-realistic black & grey",
                          categories: ["Realismo", "Blackwork"],
                          hours: 15,
                          sessions: 3,
                          size: "Media manga"
                        },
                        {
                          id: "fallback_5",
                          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5LMtrwwTSFu95uiU0bVfXq9VmWZIJ10dyJ3Lwbu6VmGCGEnBfZXi0WQlrXz0JAAAXzBurYTXa8IleL_Z1UTW7x4BHigWcVZCarsYy-PDu3G5JOwCsz3c0mgBTVI90e2b4bcw5lLDYzc5mU0qXptlWkjo0e3ynOS0xxfhCjxtvA0Bykbfo3wSX79T_fwcMg4uFHYXGxws2NYoOaKhhgr6J8ErFHQqB5QJSnK9c2zkwmEgiIM-74wbPKlVjQPO8pxETkDa8jrj1OmA",
                          alt: "Detailed blackwork owl",
                          title: "Detailed blackwork owl",
                          categories: ["Blackwork", "Realismo"],
                          hours: 8,
                          sessions: 2,
                          size: "15x15 cm"
                        }
                    ];
                    const limitedFallback = fallback.slice(0, 5);
                    const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                    const addedFallbackPhotos = limitedFallback.filter(f => !finalPhotos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id));
                    finalPhotos = [...finalPhotos, ...addedFallbackPhotos];
                }
                
                finalPhotos.sort((a, b) => {
                    const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                    const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                    if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                    if (aPinned) return -1;
                    if (bPinned) return 1;
                    return 0;
                });
                
                setAllTattoos(finalPhotos);
                setIsProfileLoading(false);
                setIsTattoosLoading(false);
            }
        } catch (error) {
            console.error(error);
            if (isMounted) {
                setIsProfileLoading(false);
                setIsTattoosLoading(false);
            }
        }
    };

    if (id) {
        loadProfileData(undefined);
    } else {
        const localUid = localStorage.getItem('demoUserId');
        if (localUid) {
            loadProfileData(localUid);
        } else {
            authUnsub = onAuthStateChanged(auth, (user) => {
                loadProfileData(user?.uid);
            });
        }
    }
    
    const handleProfileDataChanged = () => {
        loadProfileData(localStorage.getItem('demoUserId') || auth.currentUser?.uid);
    };
    window.addEventListener('profileDataChanged', handleProfileDataChanged);
    
    return () => {
        isMounted = false;
        authUnsub();
        window.removeEventListener('profileDataChanged', handleProfileDataChanged);
    };
  }, [id]);
